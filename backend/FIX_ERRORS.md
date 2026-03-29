# Quick Fix Checklist - Error Resolution

## ✅ Database Error Fixed
**Error:** `Unknown column 'name' in 'field list'`

**Solution Applied:**
- ✅ Updated `db.js` to auto-create users table with `name` column
- ✅ Updated register endpoint to accept and save user `name`
- ✅ Added ALTER TABLE command to add `name` column to existing databases

**Action Required:** None - automatically fixed on next server start

---

## 🔧 Email Service Error - ACTION REQUIRED

**Error:** `Error: connect ETIMEDOUT` at Gmail

**Root Cause:** Email credentials are still placeholder values

### Fix Steps (Choose One):

#### Option 1: Quick Fix (Fastest)
1. Open `/Users/sriram/Desktop/barter-system/backend/server.js`
2. Find lines 13-19 (EMAIL CONFIGURATION section)
3. Replace:
   ```javascript
   user: "your-email@gmail.com",
   pass: "your-app-password"
   ```
   With your real Gmail and App Password

#### Option 2: Use Environment Variables (Recommended)
1. Create `.env` file in backend folder
2. Add these lines:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```
3. Run: `npm install dotenv`
4. No changes needed in server.js (already configured)

---

## 📧 How to Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click **Security** (left menu)
3. Enable **2-Step Verification** (if not already done)
4. Go to https://myaccount.google.com/apppasswords
5. Select **Mail** and **Windows Computer**
6. Copy the **16-character password** that appears
7. Use this password in server.js or .env

**Example:**
```
Gmail: sriram@gmail.com
App Password: abcd efgh ijkl mnop (16 chars with spaces)
```

---

## 🚀 Next Steps

1. **Configure Email:**
   - Option 1: Update server.js directly
   - Option 2: Create .env file

2. **Restart Server:**
   ```bash
   cd /Users/sriram/Desktop/barter-system/backend
   npm start
   ```

3. **Verify:**
   You should see:
   ```
   ✅ MySQL Connected
   ✅ Users table ready
   ✅ Exchanges table ready
   ✅ Email service ready
   ```

4. **Test Exchange:**
   - User A sends exchange request
   - User B receives email notification
   - Both users get confirmation emails

---

## Database Changes Summary

### Users Table (AUTO-CREATED):
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),              -- NEW!
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Exchanges Table (AUTO-CREATED):
```sql
CREATE TABLE exchanges (
  id, from_user_id, from_user_name, from_user_email,
  to_user_id, to_user_name, to_user_email,
  what_you_offering, what_you_need,
  exchange_date, exchange_place, notes, status, created_at
)
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Unknown column 'name'" | ✅ Fixed - Restart server |
| "Email: connect ETIMEDOUT" | 🔧 Configure Gmail credentials |
| "Invalid login credentials" | Check 2FA enabled + use App Password |
| Email not arriving | Check spam folder + verify recipient email in DB |

---

## File Locations
- Server: `/Users/sriram/Desktop/barter-system/backend/server.js`
- Database: `/Users/sriram/Desktop/barter-system/backend/db.js`
- Setup Guide: `/Users/sriram/Desktop/barter-system/backend/EMAIL_SETUP.md`
