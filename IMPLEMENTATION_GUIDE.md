# 🛠️ Implementation Guide - Document Upload Feature

## What Was Changed

### 1. **Frontend Changes** (`front end/dashboard.html`)

#### New Features Added:
- ✅ Category dropdown selector
- ✅ Dynamic file upload fields based on category
- ✅ Visual requirements indicator (yellow box)
- ✅ Multi-file upload support for proof photos
- ✅ Updated postOffer() function to handle files

#### New Functions:
```javascript
updateFileRequirements()  // Shows/hides file inputs based on category
postOffer()              // Now handles FormData with file uploads
getRequiredFiles()       // Maps categories to required files
```

#### File Input Fields Added:
- `certificateFile` - For certificates/warranties
- `proofPhotosFile` - For multiple proof photos
- `insuranceFile` - For insurance documents
- `registrationFile` - For registration certificates
- `ownershipFile` - For ownership proofs

---

### 2. **Backend Changes** (`backend/server.js`)

#### New Dependencies:
- Added **multer** for file upload handling

#### New Configuration:
```javascript
const storage = multer.diskStorage({...})  // File storage config
const fileFilter = (req, file, cb) => {...} // File type validation
const upload = multer({...})                // Multer middleware
```

#### Updated Endpoint:
- `POST /post` - Now accepts multipart/form-data with files
- Stores file paths in database
- Creates `backend/uploads/` directory automatically

#### New Route:
- `GET /uploads/:filename` - Download uploaded files securely

---

### 3. **Database Changes** (`backend/db.js`)

#### New Table: `products`
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  offer VARCHAR(500),
  need VARCHAR(500),
  image LONGTEXT,
  category VARCHAR(100),
  certificate VARCHAR(255),          -- NEW
  proof_photos LONGTEXT,             -- NEW
  insurance VARCHAR(255),            -- NEW
  registration VARCHAR(255),         -- NEW
  ownership VARCHAR(255),            -- NEW
  status VARCHAR(50),
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

#### New Columns:
- `certificate` - Stores certificate filename
- `proof_photos` - Stores comma-separated photo filenames
- `insurance` - Stores insurance document filename
- `registration` - Stores registration filename
- `ownership` - Stores ownership proof filename

---

### 4. **Package Updates** (`backend/package.json`)

Added dependency:
```json
"multer": "^1.4.5-lts.1"
```

---

## 📂 File Structure

```
barter-system/
├── backend/
│   ├── uploads/                    ← NEW: Stores uploaded files
│   ├── server.js                   ← UPDATED: File upload handling
│   ├── db.js                       ← UPDATED: New products table
│   └── package.json                ← UPDATED: Added multer
├── front end/
│   ├── dashboard.html              ← UPDATED: Category + file uploads
│   └── script.js                   ← No changes needed
└── DOCUMENT_REQUIREMENTS_GUIDE.md  ← NEW: User guide
```

---

## 🚀 How to Deploy

### Step 1: Update Backend
```bash
cd backend
npm install  # Install multer
node server.js  # Start server
```

### Step 2: Database Setup
- Server automatically creates `products` table on startup
- Database columns will be added if they don't exist

### Step 3: Test File Uploads
1. Open dashboard.html
2. Select a category (e.g., "Watch")
3. Notice the required documents appear
4. Upload test files
5. Submit the offer

---

## 📊 Category Document Matrix

| Category | Certificate | Proof Photos | Insurance | Registration | Ownership |
|----------|:-----------:|:------------:|:---------:|:------------:|:---------:|
| Watch | ✅ | ✅ | - | - | - |
| Bike | - | ✅ | ✅ | ✅ | - |
| Car | - | ✅ | ✅ | ✅ | - |
| Books | - | ✅ | - | - | - |
| Fashion | - | ✅ | - | - | - |
| Gadgets | ✅ | ✅ | - | - | - |
| Land | - | - | - | ✅ | ✅ |
| Jewelry | ✅ | ✅ | - | - | - |
| Other | - | - | - | - | - |

---

## 🔒 Security Features

1. **File Type Validation**
   - Only allows: PDF, JPG, PNG, DOC, DOCX
   - MIME type checking on server side

2. **File Size Limits**
   - Maximum 10 MB per file
   - Prevents server storage issues

3. **Secure File Storage**
   - Files renamed with timestamps
   - Stored outside web root (`backend/uploads/`)
   - Prevents directory traversal attacks

4. **Access Control**
   - Download route validates file paths
   - Prevents unauthorized file access

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /post with files"
**Solution:** Make sure multer is installed
```bash
npm install multer
```

### Issue: "uploads directory doesn't exist"
**Solution:** Server creates it automatically on startup. Check permissions.

### Issue: File upload size error
**Solution:** Files must be under 10 MB. Compress if needed.

### Issue: File type not accepted
**Solution:** Use PDF, JPG, PNG, DOC, or DOCX formats only.

---

## ✨ Features Summary

✅ Category-based document requirements
✅ Dynamic form field display
✅ Multi-file upload support
✅ File validation (type & size)
✅ Secure file storage
✅ Database integration
✅ User-friendly interface
✅ Clear requirement indicators

---

## 📝 Next Steps (Optional)

1. **Add file viewing in offers** - Show uploaded docs when viewing offers
2. **Admin panel** - Review & verify uploaded documents
3. **Document expiration** - Auto-remove docs after 6 months
4. **Email notifications** - Alert users when offers are viewed
5. **Document OCR** - Extract data from uploaded documents

---

## 📞 Support

For issues or questions about the implementation, refer to:
- DOCUMENT_REQUIREMENTS_GUIDE.md (user guide)
- Server logs: `node server.js` output
- Database: Check `products` table for stored files
