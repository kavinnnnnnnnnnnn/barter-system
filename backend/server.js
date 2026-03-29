const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require('dotenv').config(); // 🔴 LOAD ENV VARIABLES
const db = require("./db");

/* ======================
   🔐 SIMPLE ADMIN AUTH (in-memory tokens)
   - Uses ADMIN_EMAIL and ADMIN_PASS from .env
   - Generates short-lived token stored in memory
====================== */
const adminTokens = {}; // token -> { email, expiry }
const ADMIN_TOKEN_TTL = 1000 * 60 * 60; // 1 hour

function generateAdminToken() {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function checkAdminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token) return res.status(401).json({ error: 'Missing admin token' });
  const record = adminTokens[token];
  if (!record) return res.status(401).json({ error: 'Invalid or expired token' });
  if (Date.now() > record.expiry) {
    delete adminTokens[token];
    return res.status(401).json({ error: 'Token expired' });
  }
  // attach admin email for logging
  req.adminEmail = record.email;
  next();
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* 📁 CREATE UPLOADS DIRECTORY IF NOT EXISTS */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

/* 📤 MULTER CONFIGURATION FOR FILE UPLOADS */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

/* 📧 OTP STORAGE (In-memory) */
const otpStorage = {}; // Format: { email: { otp: '123456', timestamp: Date, data: {...} } }

/* 📧 EMAIL CONFIGURATION */
// Load from .env file (use require('dotenv').config() in db.js or at top)
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

console.log("\n📧 Email Configuration:");
console.log(`   USER: ${emailUser ? '✅ Loaded from .env' : '❌ Missing'}`);
console.log(`   PASS: ${emailPass ? '✅ Loaded from .env' : '❌ Missing'}\n`);

// Gmail SMTP Configuration with timeout handling
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS (not SSL/465)
  auth: {
    user: emailUser,
    pass: emailPass
  },
  connectionTimeout: 5000,
  socketTimeout: 5000
});

// Test email connection with detailed error handling
let emailServiceReady = false;
transporter.verify((error, success) => {
  if (error) {
    console.log("⚠️  Email service not available:", error.message);
    if (error.code === 'ETIMEDOUT') {
      console.log("   Timeout on port 587 (TLS)");
    } else if (error.code === 'EAUTH') {
      console.log("   Authentication failed - check credentials");
    }
    console.log("   ℹ️  App will continue to work, but emails won't be sent\n");
    emailServiceReady = false;
  } else {
    console.log("✅ Email service ready - Gmail connection successful\n");
    emailServiceReady = true;
  }
});

/* 🔹 TEST ROUTE */
app.get("/", (req, res) => {
  res.send("✅ Barter System Backend Running");
});

/* =======================
   � SEND OTP TO EMAIL
======================= */
app.post("/send-otp", (req, res) => {
  const email = req.body.email?.trim();
  const name = req.body.name?.trim() || "User";

  // ✅ Validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  // Store OTP temporarily
  otpStorage[email] = {
    otp: otp,
    expiryTime: expiryTime,
    name: name
  };

  // Send OTP email
  const mailOptions = {
    from: emailUser || "noreply@bartersystem.com",
    to: email,
    subject: "🔐 Barter System - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">🔐 Email Verification</h2>
        
        <p style="font-size: 16px; color: #555; margin: 20px 0;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="font-size: 16px; color: #555;">
          Thank you for registering with <strong>Barter System</strong>! 
        </p>

        <div style="background-color: white; padding: 25px; border-radius: 10px; margin: 20px 0; text-align: center; border: 2px solid #007bff;">
          <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your verification code:</p>
          <h1 style="color: #007bff; letter-spacing: 5px; font-size: 2.5rem; margin: 10px 0;">${otp}</h1>
          <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">Valid for 10 minutes</p>
        </div>

        <p style="font-size: 14px; color: #666; margin: 20px 0;">
          ⏰ <strong>This code will expire in 10 minutes.</strong> If you didn't request this, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          This is an automated message from Barter System. Please do not reply to this email.
        </p>
      </div>
    `
  };

  // Return success immediately, send email in background (non-blocking)
  res.json({ success: true, message: "OTP sent to your email" });

  if (emailServiceReady) {
    // Send email asynchronously without blocking the response
    setImmediate(() => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`❌ OTP email failed to ${email}:`, error.message);
        } else {
          console.log(`✅ OTP sent to ${email}: ${otp}`);
        }
      });
    });
  } else {
    console.log(`⚠️  Email service unavailable - OTP: ${otp}`);
  }
});

/* =======================
   ✅ VERIFY OTP & REGISTER
======================= */
app.post("/verify-otp-register", (req, res) => {
  const email = req.body.email?.trim();
  const otp = req.body.otp?.trim();
  const name = req.body.name?.trim() || "";
  const password = req.body.password?.trim();

  // ✅ Validation
  if (!email || !otp || !password) {
    return res.status(400).json({ error: "Email, OTP, and password required" });
  }

  // Check if OTP exists and is not expired
  if (!otpStorage[email]) {
    return res.status(400).json({ error: "No OTP sent to this email. Please request a new one." });
  }

  const storedOtp = otpStorage[email];

  // Check expiry
  if (Date.now() > storedOtp.expiryTime) {
    delete otpStorage[email];
    return res.status(400).json({ error: "OTP has expired. Please request a new one." });
  }

  // Verify OTP
  if (storedOtp.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP. Please try again." });
  }

  // ✅ OTP verified, now check if email exists and register
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      // ❌ Email already exists
      if (result.length > 0) {
        delete otpStorage[email];
        console.log(`❌ Registration failed: Email ${email} already exists`);
        return res.status(409).json({ error: "Email already registered." });
      }

      // ✅ Email is unique, proceed with registration
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        err => {
          if (err) {
            console.error("❌ Registration error:", err);
            return res.status(500).json({ error: "Registration failed" });
          }
          
          // Clear OTP after successful registration
          delete otpStorage[email];
          
          console.log(`✅ User registered and verified: ${email}`);
          res.json({ 
            success: true, 
            message: "✅ Account created successfully! Redirecting to login..." 
          });
        }
      );
    }
  );
});

/* =======================
   🔐 REGISTER (Old - Kept for compatibility)
======================= */
app.post("/register", (req, res) => {
  const name = req.body.name?.trim() || "";
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  // ✅ Validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // 🔴 CHECK IF EMAIL ALREADY EXISTS
  db.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      // ❌ Email already exists
      if (result.length > 0) {
        console.log(`❌ Registration failed: Email ${email} already exists`);
        return res.status(409).json({ error: "Email already registered. Please use a different email." });
      }

      // ✅ Email is unique, proceed with registration
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        err => {
          if (err) {
            console.error("❌ Registration error:", err);
            return res.status(500).json({ error: "Registration failed" });
          }
          console.log(`✅ User registered: ${email}`);
          res.json({ success: true, message: "Registered successfully" });
        }
      );
    }
  );
});

/* =======================
   🔐 LOGIN
======================= */
app.post("/login", (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res.status(400).send("Missing credentials");
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }

      if (result.length === 0) {
        return res.status(401).send("Invalid email");
      }

      if (result[0].password !== password) {
        return res.status(401).send("Invalid password");
      }

      res.json(result[0]); // ✅ login success
    }
  );
});

/* =======================
   🧠 CATEGORY DETECTION
======================= */
function getCategoryFromNeed(need) {
  if (!need) return "Other";
  need = need.toLowerCase();

  if (need.match(/watch|phone|mobile|laptop|speaker|earphone|headphone|tablet|camera|gadget|electronics/))
    return "Gadgets";

  if (need.match(/car|bike|vehicle|scooter|truck|motorcycle/))
    return "Vehicles";

  if (need.match(/shirt|dress|pant|jeans|shoe|clothes|fashion/))
    return "Fashion";

  if (need.match(/land|house|plot|property|villa|apartment/))
    return "Land";

  if (need.match(/book|novel|textbook|magazine|comic/))
    return "Books";

  return "Other";
}

/* =======================
   📤 POST BARTER OFFER WITH FILES
======================= */
app.post("/post", upload.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'proofPhotos', maxCount: 10 },
  { name: 'insurance', maxCount: 1 },
  { name: 'registration', maxCount: 1 },
  { name: 'ownership', maxCount: 1 }
]), (req, res) => {
  const { user_id, offer, need, image, category } = req.body;

  // ✅ Validation
  if (!user_id || !offer || !need) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 🔴 VERIFY USER EXISTS AND HAS VALID EMAIL
  db.query(
    "SELECT id, email FROM users WHERE id = ?",
    [user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      // ❌ User not found
      if (result.length === 0) {
        console.log(`❌ Offer posting failed: User ${user_id} not found`);
        return res.status(404).json({ error: "User not found. Please login again." });
      }

      const userEmail = result[0].email;

      // ❌ User has invalid email
      if (!userEmail || userEmail === "N/A" || !userEmail.includes("@")) {
        console.log(`❌ Offer posting failed: User ${user_id} has invalid email: ${userEmail}`);
        return res.status(400).json({ error: "Your email is invalid. Please update your profile." });
      }

      // ✅ User is valid, proceed with offer posting
      const categoryDetected = category || getCategoryFromNeed(need);
      
      // 📁 Prepare file paths
      const fileData = {
        certificate: req.files?.certificate ? req.files.certificate[0].filename : null,
        proofPhotos: req.files?.proofPhotos ? req.files.proofPhotos.map(f => f.filename).join(',') : null,
        insurance: req.files?.insurance ? req.files.insurance[0].filename : null,
        registration: req.files?.registration ? req.files.registration[0].filename : null,
        ownership: req.files?.ownership ? req.files.ownership[0].filename : null
      };

      const sql = `
        INSERT INTO products (user_id, offer, need, image, category, certificate, proof_photos, insurance, registration, ownership)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [user_id, offer, need, image || null, categoryDetected, fileData.certificate, fileData.proofPhotos, fileData.insurance, fileData.registration, fileData.ownership],
        err => {
          if (err) {
            console.error("❌ Insert error:", err);
            return res.status(500).json({ error: "Failed to post offer" });
          }
          console.log(`✅ Offer posted by user ${user_id} (${userEmail}) with files:`, fileData);
          res.json({ success: true, message: "Offer posted successfully with documents" });
        }
      );
    }
  );
});

/* =======================
   � GET USER DETAILS
======================= */
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, name, email FROM users WHERE id = ?",
    [userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(result[0]);
    }
  );
});

/* =======================
   🔄 EXCHANGE REQUEST
======================= */
app.post("/exchange", (req, res) => {
  const {
    from_user_id,
    from_user_name,
    from_user_email,
    to_user_id,
    to_user_name,
    to_user_email,
    what_you_offering,
    what_you_need,
    exchange_date,
    exchange_place,
    notes,
    status
  } = req.body;

  // 🔴 VALIDATION: Both emails must be present
  if (!from_user_id || !to_user_id || !exchange_date || !exchange_place) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!from_user_email || from_user_email === 'N/A') {
    return res.status(400).json({ error: "Your email is invalid" });
  }

  if (!to_user_email || to_user_email === 'N/A') {
    return res.status(400).json({ error: "Recipient email is invalid" });
  }

  const sql = `
    INSERT INTO exchanges (
      from_user_id, from_user_name, from_user_email,
      to_user_id, to_user_name, to_user_email,
      what_you_offering, what_you_need,
      exchange_date, exchange_place, notes, status, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    sql,
    [
      from_user_id,
      from_user_name || "N/A",
      from_user_email,
      to_user_id,
      to_user_name || "N/A",
      to_user_email,
      what_you_offering || "N/A",
      what_you_need || "N/A",
      exchange_date,
      exchange_place,
      notes || "",
      status || "pending"
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Exchange insert error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      console.log(`\n📧 Exchange Request Created - ID: ${result.insertId}`);
      console.log(`   From: ${from_user_name} (${from_user_email})`);
      console.log(`   To: ${to_user_name} (${to_user_email})`);
      console.log(`   Date: ${exchange_date}, Location: ${exchange_place}\n`);

      // 📧 Send email to RECIPIENT (Offerer - the other user)
      const acceptLink = `http://localhost:3000/exchange/${result.insertId}/accept/${to_user_id}`;
      const recipientEmail = {
        from: emailUser || "noreply@bartersystem.com",
        to: to_user_email,
        subject: `🔔 New Exchange Request from ${from_user_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">📦 New Exchange Request Received!</h2>
            
            <p style="font-size: 16px; color: #555;">
              <strong>${from_user_name}</strong> has sent you an exchange request!
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #007bff;">Exchange Details</h3>
              <p><strong>From:</strong> ${from_user_name} (${from_user_email})</p>
              <p><strong>They Are Offering:</strong> ${what_you_offering}</p>
              <p><strong>They Want From You:</strong> ${what_you_need}</p>
              <p><strong>Proposed Date:</strong> ${exchange_date}</p>
              <p><strong>Meeting Location:</strong> ${exchange_place}</p>
              ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${acceptLink}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                ✅ Accept Exchange
              </a>
            </div>

            <p style="font-size: 14px; color: #888;">
              Click the button above to accept this exchange, or visit your Barter System dashboard to view more options.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">
              This is an automated message from Barter System. Please do not reply to this email.
            </p>
          </div>
        `
      };

      // 📧 Send email to REQUESTER (person who initiated)
      const requesterEmail = {
        from: emailUser || "noreply@bartersystem.com",
        to: from_user_email,
        subject: `✅ Exchange Request Sent to ${to_user_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">✅ Exchange Request Sent!</h2>
            
            <p style="font-size: 16px; color: #555;">
              Your exchange request has been sent to <strong>${to_user_name}</strong>!
            </p>

            <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #28a745;">Request Summary</h3>
              <p><strong>To:</strong> ${to_user_name} (${to_user_email})</p>
              <p><strong>You Are Offering:</strong> ${what_you_offering}</p>
              <p><strong>You Want From Them:</strong> ${what_you_need}</p>
              <p><strong>Proposed Date:</strong> ${exchange_date}</p>
              <p><strong>Meeting Location:</strong> ${exchange_place}</p>
              ${notes ? `<p><strong>Your Notes:</strong> ${notes}</p>` : ''}
              <p><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">⏳ Pending</span></p>
            </div>

            <p style="font-size: 14px; color: #888;">
              We'll notify you as soon as ${to_user_name} responds to your exchange request.
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaa;">
              This is an automated message from Barter System. Please do not reply to this email.
            </p>
          </div>
        `
      };

      // ✅ Send email to RECIPIENT (Offerer) - Optional
      if (emailServiceReady) {
        transporter.sendMail(recipientEmail, (error, info) => {
          if (error) {
            console.log(`   ⚠️  Email to recipient (${to_user_email}) failed:`, error.message);
          } else {
            console.log(`   ✅ Email sent to OFFERER: ${to_user_email}`);
          }
        });

        // ✅ Send email to REQUESTER (Person who initiated)
        transporter.sendMail(requesterEmail, (error, info) => {
          if (error) {
            console.log(`   ⚠️  Email to requester (${from_user_email}) failed:`, error.message);
          } else {
            console.log(`   ✅ Email sent to REQUESTER: ${from_user_email}`);
          }
        });
      } else {
        console.log(`   ℹ️  Email service unavailable - emails not sent (but exchange was created)`);
      }

      // Return response regardless of email status
      return res.json({
        success: true,
        message: "Exchange request created successfully",
        exchange_id: result.insertId,
        email_status: emailServiceReady ? "sent to both" : "pending (email service unavailable)"
      });
    }
  );
});

/* =======================
   📥 GET ALL OFFERS (PRODUCTS)
======================= */
app.get("/products", (req, res) => {
  db.query(
    "SELECT * FROM products ORDER BY created_at DESC",
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch offers" });
      }
      res.json(result);
    }
  );
});

/* =======================
   📋 GET EXCHANGE REQUESTS FOR USER
======================= */
app.get("/exchange/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM exchanges WHERE to_user_id = ? OR from_user_id = ? ORDER BY created_at DESC",
    [userId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch exchange requests" });
      }
      res.json(result);
    }
  );
});

/* =======================
   ✅ ACCEPT EXCHANGE FROM EMAIL LINK
======================= */
app.get("/exchange/:exchangeId/accept/:userId", (req, res) => {
  const exchangeId = req.params.exchangeId;
  const userId = req.params.userId;

  // 🔹 First, fetch the exchange details
  db.query(
    "SELECT * FROM exchanges WHERE id = ?",
    [exchangeId],
    (err, result) => {
      if (err) {
        console.error("❌ Error fetching exchange:", err);
        return res.status(500).send("<h2>❌ Error processing your request</h2>");
      }

      if (result.length === 0) {
        return res.status(404).send("<h2>❌ Exchange request not found</h2>");
      }

      const exchange = result[0];

      // 🔹 Verify that the user accepting is the recipient
      if (exchange.to_user_id != userId) {
        return res.status(403).send("<h2>❌ You are not authorized to accept this exchange</h2>");
      }

      // 🔹 Check if already accepted or declined
      if (exchange.status !== 'pending') {
        return res.status(400).send(`<h2>⚠️  This exchange request has already been ${exchange.status}</h2>`);
      }

      // 🔹 Update status to accepted
      db.query(
        "UPDATE exchanges SET status = ? WHERE id = ?",
        ['accepted', exchangeId],
        (err, updateResult) => {
          if (err) {
            console.error("❌ Error updating exchange:", err);
            return res.status(500).send("<h2>❌ Error accepting exchange</h2>");
          }

          console.log(`\n✅ Exchange ${exchangeId} ACCEPTED via email link`);
          console.log(`   By: ${exchange.to_user_name} (${exchange.to_user_email})`);
          console.log(`   From: ${exchange.from_user_name} (${exchange.from_user_email})\n`);

          // 📧 Send confirmation email to BOTH users
          const confirmationHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
              <h2 style="color: #28a745;">🎉 Exchange Request Accepted!</h2>
              <p style="font-size: 16px; color: #555;">
                The exchange request between <strong>${exchange.from_user_name}</strong> and <strong>${exchange.to_user_name}</strong> has been accepted!
              </p>
              <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #28a745;">
                <h3 style="color: #28a745;">✅ Exchange Confirmed</h3>
                <p><strong>Accepted By:</strong> ${exchange.to_user_name} (${exchange.to_user_email})</p>
                <p><strong>Initiated By:</strong> ${exchange.from_user_name} (${exchange.from_user_email})</p>
                <p><strong>Offer:</strong> ${exchange.what_you_offering}</p>
                <p><strong>Receive:</strong> ${exchange.what_you_need}</p>
                <p><strong>Exchange Date:</strong> ${exchange.exchange_date}</p>
                <p><strong>Meeting Location:</strong> ${exchange.exchange_place}</p>
                ${exchange.notes ? `<p><strong>Notes:</strong> ${exchange.notes}</p>` : ''}
              </div>
              <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #0056b3; font-size: 14px;">
                  📍 <strong>Next Step:</strong> Meet on the agreed date and location to complete the exchange!
                </p>
              </div>
              <p style="font-size: 14px; color: #888;">
                Please contact each other to confirm the final details.
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #aaa;">
                This is an automated message from Barter System. Please do not reply to this email.
              </p>
            </div>
          `;
          const confirmationEmailInitiator = {
            from: emailUser || "noreply@bartersystem.com",
            to: exchange.from_user_email,
            subject: `🎉 Your Exchange Request was ACCEPTED by ${exchange.to_user_name}!`,
            html: confirmationHtml
          };
          const confirmationEmailRecipient = {
            from: emailUser || "noreply@bartersystem.com",
            to: exchange.to_user_email,
            subject: `🎉 You ACCEPTED the Exchange Request from ${exchange.from_user_name}!`,
            html: confirmationHtml
          };
          if (emailServiceReady) {
            transporter.sendMail(confirmationEmailInitiator, (error, info) => {
              if (error) {
                console.log(`   ⚠️  Confirmation email to initiator (${exchange.from_user_email}) failed:`, error.message);
              } else {
                console.log(`   ✅ Confirmation email sent to INITIATOR: ${exchange.from_user_email}`);
              }
            });
            transporter.sendMail(confirmationEmailRecipient, (error, info) => {
              if (error) {
                console.log(`   ⚠️  Confirmation email to recipient (${exchange.to_user_email}) failed:`, error.message);
              } else {
                console.log(`   ✅ Confirmation email sent to RECIPIENT: ${exchange.to_user_email}`);
              }
            });
          }

          // 🌐 Return success HTML page
          res.send(`
            <html>
            <head>
              <title>✅ Exchange Accepted</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                }
                .container {
                  background: white;
                  padding: 40px;
                  border-radius: 15px;
                  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                  text-align: center;
                  max-width: 500px;
                }
                h1 {
                  color: #28a745;
                  font-size: 2.5em;
                  margin: 0 0 20px 0;
                }
                p {
                  color: #555;
                  font-size: 1.1em;
                  line-height: 1.6;
                  margin: 15px 0;
                }
                .details {
                  background-color: #f0f8f5;
                  padding: 20px;
                  border-radius: 10px;
                  margin: 20px 0;
                  text-align: left;
                }
                .button {
                  background-color: #28a745;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  font-size: 1em;
                  display: inline-block;
                  margin-top: 20px;
                }
                .button:hover {
                  background-color: #218838;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🎉 Exchange Accepted!</h1>
                <p><strong>Congratulations!</strong> You have successfully accepted the exchange request.</p>
                
                <div class="details">
                  <p><strong>From:</strong> ${exchange.from_user_name}</p>
                  <p><strong>Exchange Date:</strong> ${exchange.exchange_date}</p>
                  <p><strong>Meeting Location:</strong> ${exchange.exchange_place}</p>
                  <p><strong>Contact Email:</strong> ${exchange.from_user_email}</p>
                </div>

                <p style="color: #666; font-size: 0.95em;">
                  A confirmation email has been sent to ${exchange.from_user_name}. Please meet on the agreed date and location to complete the exchange.
                </p>

                <a href="http://localhost:3000" class="button">Return to Barter System</a>
              </div>
            </body>
            </html>
          `);
        }
      );
    }
  );
});

/* =======================
   ✅ ACCEPT/DECLINE EXCHANGE REQUEST
======================= */
app.put("/exchange/:exchangeId/status", (req, res) => {
  const exchangeId = req.params.exchangeId;
  const { status } = req.body;

  if (!status || !["accepted", "declined", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  db.query(
    "UPDATE exchanges SET status = ? WHERE id = ?",
    [status, exchangeId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update status" });
      }
      res.json({
        success: true,
        message: `Exchange request ${status} successfully`
      });
    }
  );
});

/* =======================
   � DEBUG: GET OTP (Testing Only)
======================= */
app.get("/debug/get-otp/:email", (req, res) => {
  const email = req.params.email?.trim();
  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }
  
  if (otpStorage[email]) {
    res.json({ 
      email, 
      otp: otpStorage[email].otp,
      expiresIn: Math.round((otpStorage[email].expiryTime - Date.now()) / 1000) + " seconds"
    });
  } else {
    res.json({ error: "No OTP found for this email" });
  }
});

/* =======================   📋 GET ALL EXCHANGES
======================= */
app.get("/exchanges", (req, res) => {
  const sql = `SELECT * FROM exchanges ORDER BY created_at DESC`;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error retrieving exchanges:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

/* =======================
   🔐 ADMIN LOGIN
   POST /admin/login { email, password } -> returns { token }
======================= */
app.post('/admin/login', (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASS;

  if (!adminEmail || !adminPass) return res.status(500).json({ error: 'Admin credentials not configured on server' });

  if (email !== adminEmail || password !== adminPass) return res.status(401).json({ error: 'Invalid admin credentials' });

  const token = generateAdminToken();
  adminTokens[token] = { email: adminEmail, expiry: Date.now() + ADMIN_TOKEN_TTL };

  console.log(`🔐 Admin logged in: ${adminEmail}`);
  res.json({ success: true, token, expiresIn: ADMIN_TOKEN_TTL / 1000 });
});

/* =======================
   🔒 ADMIN: GET ALL OFFERS
======================= */
app.get('/admin/offers', checkAdminAuth, (req, res) => {
  const sql = `SELECT p.*, u.name as owner_name, u.email as owner_email FROM products p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Error retrieving offers for admin:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

/* =======================
   🔒 ADMIN: GET ALL EXCHANGES
======================= */
app.get('/admin/exchanges', checkAdminAuth, (req, res) => {
  const sql = `SELECT e.*, uf.name AS from_name, uf.email AS from_email, ut.name AS to_name, ut.email AS to_email FROM exchanges e LEFT JOIN users uf ON e.from_user_id = uf.id LEFT JOIN users ut ON e.to_user_id = ut.id ORDER BY e.created_at DESC`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error('❌ Error retrieving exchanges for admin:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
});

/* =======================
   📋 GET EXCHANGES FOR A USER
======================= */
app.get("/exchanges/:userId", (req, res) => {
  const userId = req.params.userId;
  
  const sql = `
    SELECT * FROM exchanges 
    WHERE from_user_id = ? OR to_user_id = ?
    ORDER BY created_at DESC
  `;
  
  db.query(sql, [userId, userId], (err, result) => {
    if (err) {
      console.error("❌ Error retrieving user exchanges:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

/* =======================
   📁 SERVE UPLOADED FILES
======================= */
app.use("/uploads", express.static(uploadsDir));
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsDir, filename);
  
  // Security: Prevent directory traversal
  if (!filepath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  res.download(filepath, (err) => {
    if (err) {
      console.error("❌ Error downloading file:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
});

/* =======================
   🚀 START SERVER
======================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
