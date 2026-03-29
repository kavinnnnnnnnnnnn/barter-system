# 🔐 Email OTP Verification System - Complete Guide

## Overview
Your registration system now includes **OTP (One-Time Password) email verification** to ensure users register with real, working email addresses.

---

## Registration Flow

### Two-Step Registration Process

```
STEP 1: User Details
├─ Full Name
├─ Email Address
└─ Password
    ↓
STEP 2: Email Verification
├─ OTP sent to email
├─ User enters 6-digit OTP
└─ Account created ✅
```

---

## How It Works

### Step 1: Send OTP

1. **User enters:**
   - Full Name
   - Email Address
   - Password (min 6 characters)

2. **Click "📧 Send OTP to Email"**
   - Frontend validates inputs
   - Backend checks if email already exists
   - Generates 6-digit OTP
   - Sends OTP email
   - Stores OTP temporarily (10-minute expiry)

3. **User receives email** with:
   - 6-digit verification code
   - 10-minute expiry timer
   - Instructions

---

### Step 2: Verify OTP & Register

1. **User switches to Step 2**
   - Displays which email OTP was sent to
   - Shows countdown timer (10 minutes)

2. **User enters 6-digit OTP**
   - Backend verifies OTP:
     - ✅ OTP matches
     - ❌ OTP incorrect
     - ❌ OTP expired
     - ❌ Email already registered

3. **Account Created Successfully**
   - Redirects to login page

---

## Backend Endpoints

### POST /send-otp
Send OTP to user's email

**Request:**
```json
{
  "email": "user@gmail.com",
  "name": "John Doe"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**Response (Error):**
```json
{
  "error": "Invalid email format"
}
```

---

### POST /verify-otp-register
Verify OTP and create account

**Request:**
```json
{
  "email": "user@gmail.com",
  "otp": "123456",
  "name": "John Doe",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "✅ Account created successfully! Redirecting to login..."
}
```

**Response (Error):**
```json
{
  "error": "Invalid OTP. Please try again."
}
```

---

## Email Content

When OTP is sent, user receives:

```
From: noreply@bartersystem.com
Subject: 🔐 Barter System - Email Verification OTP

Hi John Doe,

Thank you for registering with Barter System!

Your verification code:
┌──────────────────┐
│    123456        │
└──────────────────┘

Valid for 10 minutes

If you didn't request this, please ignore this email.
```

---

## Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| "Name is required" | Empty name field | Enter your name |
| "Invalid email format" | Wrong email format | Use valid email (has @) |
| "Password must be at least 6 characters" | Short password | Use stronger password |
| "No OTP sent to this email" | No OTP request | Click "Send OTP" again |
| "OTP has expired" | More than 10 minutes passed | Request new OTP |
| "Invalid OTP" | Wrong code entered | Check email again |
| "Email already registered" | Email exists in database | Use different email |

---

## Frontend Features

### ✨ User Experience

- **Two-Step Form:**
  - Step 1: Registration details
  - Step 2: OTP verification

- **Countdown Timer:**
  - Shows remaining time (10:00 → 00:00)
  - Turns red when expiring
  - Auto-disables after expiry

- **Back Button:**
  - Can go back to Step 1
  - Clears OTP input
  - Restarts countdown

- **Real-time Feedback:**
  - Shows which email OTP was sent to
  - Clear error messages
  - Success indicators

- **Data Persistence:**
  - Stores email/password in localStorage
  - Clears after successful registration
  - Safe & secure

---

## OTP Validation

### Frontend Checks
✅ Name not empty
✅ Email format valid (contains @)
✅ Password at least 6 characters
✅ OTP is exactly 6 digits
✅ OTP not expired

### Backend Checks
✅ Email format valid
✅ Email not already registered
✅ OTP exists for email
✅ OTP not expired (10-minute window)
✅ OTP matches exactly

---

## OTP Storage (Backend)

```javascript
otpStorage = {
  "user@gmail.com": {
    otp: "123456",
    expiryTime: 1673456789000,
    name: "John Doe"
  }
}
```

- **Stored in memory** (RAM)
- **Expires after 10 minutes**
- **Cleared after successful registration**
- **Cleared on OTP verification failure**

---

## Testing the System

### Test Case 1: Successful Registration

```
1. Go to register.html
2. Enter:
   - Name: "John Doe"
   - Email: "john@gmail.com"
   - Password: "pass123"
3. Click "Send OTP"
4. Check email for OTP
5. Enter OTP code
6. Click "Verify & Create Account"
7. Expected: ✅ Account created, redirects to login
```

---

### Test Case 2: Expired OTP

```
1. Send OTP
2. Wait 10+ minutes
3. Try to verify
4. Expected: ❌ "OTP has expired"
```

---

### Test Case 3: Wrong OTP

```
1. Send OTP (e.g., 123456)
2. Enter wrong code (e.g., 654321)
3. Click verify
4. Expected: ❌ "Invalid OTP"
```

---

### Test Case 4: Duplicate Email

```
1. Register with: test@gmail.com ✅
2. Try to register again with: test@gmail.com
3. Expected: ❌ "Email already registered"
```

---

## Security Features

✅ **OTP Expiration** - 10-minute timeout
✅ **Unique OTP** - Random 6-digit code
✅ **Email Verification** - Proves email works
✅ **Password Validation** - Min 6 characters
✅ **Email Uniqueness** - No duplicates
✅ **One-time Use** - OTP deleted after use
✅ **Secure Storage** - In-memory (not in code)

---

## Browser Storage

The system uses localStorage temporarily:
- `regEmail` - User's email
- `regPassword` - User's password
- `regName` - User's name

These are **cleared after successful registration** for security.

---

## Console Logs (Backend)

When OTP is sent:
```
✅ OTP sent to user@gmail.com: 123456
```

When OTP is verified:
```
✅ User registered and verified: user@gmail.com
```

---

## Troubleshooting

### Email Not Received
1. Check spam folder
2. Wait a few seconds
3. Request new OTP (old one expires in 10 min)
4. Verify email address is correct

### "No OTP sent to this email"
- You need to complete Step 1 first
- Click "Send OTP" button
- Wait for confirmation

### OTP Code Shows in Console
- If email service is unavailable, OTP shows in browser console
- Use code from console for testing

### Backend Not Responding
1. Ensure server is running: `node server.js`
2. Check terminal for errors
3. Verify .env file has credentials

---

## Success Indicators

✅ After sending OTP:
- Message: "✅ OTP sent! Check your email"
- Color: Green
- Auto-switches to Step 2

✅ After verifying OTP:
- Message: "✅ Account created successfully!"
- Redirects to login.html
- localStorage cleared

---

## Summary

Your registration system now includes:
- ✅ Real email verification via OTP
- ✅ 10-minute expiry for security
- ✅ Beautiful two-step interface
- ✅ Countdown timer
- ✅ Error handling
- ✅ Back button to edit details
- ✅ Duplicate email prevention
- ✅ Works with/without email service

**Users can only register with real, working email addresses!** 🔐
