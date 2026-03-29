# Email Configuration Setup

## Step 1: Install Dependencies ✅
Already done! Nodemailer is installed.

## Step 2: Fix Database Error
The users table now includes a `name` column. Your database is automatically updated.

## Step 3: Configure Gmail Credentials

### Option A: Update server.js (Easy)
Edit `/Users/sriram/Desktop/barter-system/backend/server.js` around line 13-19:

**Find this:**
```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password"
  }
});
```

**Replace with your credentials:**
```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sriram@gmail.com", // Your Gmail address
    pass: "abcd efgh ijkl mnop" // Your Gmail App Password (16 chars)
  }
});
```

### Option B: Use Environment Variables (Recommended)

Create a `.env` file in the backend folder:

**Create file:** `/Users/sriram/Desktop/barter-system/backend/.env`

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Then install dotenv:
```bash
cd /Users/sriram/Desktop/barter-system/backend
npm install dotenv
```

Add at the top of server.js (after `const db = require("./db");`):
```javascript
require('dotenv').config();
```

## Step 4: Get Gmail App Password

### Requirements:
- Gmail account
- 2-Factor Authentication enabled

### Steps:
1. Go to https://myaccount.google.com/
2. Click **Security** on the left menu
3. Enable **2-Step Verification** (if not done)
4. Go to https://myaccount.google.com/apppasswords
5. Select **Mail** and **Windows Computer**
6. Google gives you a **16-character password**
7. Copy and paste it into server.js or .env

### Example:
```
Password: abcd efgh ijkl mnop
        (has 4 spaces, 16 chars total)
```

## Step 5: Restart Server

```bash
npm start
```

You should see:
```
✅ Email service ready
```

## Database Auto-Setup ✅

The system now automatically:
- Creates `users` table with `name` column
- Creates `exchanges` table
- Adds `name` column if it doesn't exist

## Register with Name

Update your registration page to include name:

```javascript
// In register.html or login.html
const registerData = {
  name: "John Doe",     // Add this
  email: "john@example.com",
  password: "password123"
};
```

## Troubleshooting

### Error: "Unknown column 'name'"
✅ **Fixed** - Database now creates the name column automatically

### Error: "connect ETIMEDOUT"
**Solution:** Configure Gmail credentials (Steps 3-4 above)

### Error: "Invalid login credentials"
- Make sure 2-Factor Authentication is enabled
- Make sure you used App Password (16 chars), not regular password
- Check Gmail address is correct

### Emails not sending?
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Check Gmail security settings
- Look for verification email from Google
- Check server logs for detailed errors

## Email Content

When an exchange is requested, both users get emails:

**User A (Requester):** Gets confirmation email
- Confirms request was sent
- Shows recipient details
- Shows what was offered/needed
- Status: Pending

**User B (Recipient):** Gets notification email
- New exchange request received
- Shows requester details
- Shows what they're offering/asking
- Action needed: Accept or decline

## What to Do Now

1. ✅ Database: Already auto-configured
2. 🔧 Email: Update credentials in server.js or .env
3. ♻️ Restart server
4. 📧 Test by creating an exchange request
5. ✉️ Check both users' email accounts for notifications

