# ⚡ Quick Start - Document Upload Feature

## 🎯 What's New?

Users must now upload supporting documents when posting barter offers based on what they're selling:

```
📦 Select Category → 📋 See Required Docs → 📤 Upload Files → ✅ Post Offer
```

---

## 📋 Quick Reference: What to Upload

### ⌚ Watch / 💎 Jewelry
- Certificate of authenticity
- Proof photos

### 🏍️ Bike / 🚗 Car
- Insurance document
- Registration certificate
- Proof photos

### 📱 Gadgets
- Warranty certificate
- Proof photos

### 🏠 Land
- Ownership proof
- Registration

### 📚 Books / 👔 Fashion
- Proof photos only

### 🎁 Other
- No requirements

---

## 🚀 Start Using It

### For Users:
1. Go to Dashboard
2. Click "📝 Post New Offer"
3. **Select a Category** ← NEW!
4. Watch: File upload boxes appear ← NEW!
5. Fill in your offer details
6. Upload all required files ← NEW!
7. Click "📤 Post Offer"

### For Developers:
1. Install: `npm install` in backend
2. Start server: `node server.js`
3. Files upload to: `backend/uploads/`
4. Database stores filenames in `products` table

---

## 📊 File Requirements

| Requirement | Details |
|------------|---------|
| File Types | PDF, JPG, PNG, DOC, DOCX |
| Max Size | 10 MB per file |
| Proof Photos | Up to 10 photos allowed |
| Required? | Yes (based on category) |
| Storage | `backend/uploads/` |

---

## 🔧 Implementation Checklist

- ✅ Frontend: Category dropdown added to dashboard.html
- ✅ Frontend: Dynamic file upload fields
- ✅ Frontend: Form validation
- ✅ Backend: Multer configured for file uploads
- ✅ Backend: File upload endpoint updated
- ✅ Database: Products table with file columns
- ✅ Security: File type and size validation
- ✅ Storage: Uploads directory auto-created

---

## 💡 Key Features

✨ **Smart Requirements** - Only asks for docs relevant to item type
✨ **Visual Feedback** - Yellow box shows what's needed
✨ **Validation** - Won't let you submit without required files
✨ **Secure** - Validates file types and limits size
✨ **Simple** - Just drag & drop or click to upload

---

## 🆘 Common Questions

**Q: Do I have to upload files?**
A: Yes, all category-specific required documents must be uploaded before posting.

**Q: What if my file is too big?**
A: Files must be under 10 MB. Compress images or PDFs if needed.

**Q: What file formats work?**
A: PDF, JPG, PNG, Word documents (DOC, DOCX)

**Q: Where are my files stored?**
A: In the `backend/uploads/` folder on the server.

**Q: Can I upload multiple proof photos?**
A: Yes! Up to 10 proof photos per offer.

---

## 📞 Need Help?

See full guides:
- **User Guide:** DOCUMENT_REQUIREMENTS_GUIDE.md
- **Dev Guide:** IMPLEMENTATION_GUIDE.md

---

**Version:** 1.0 | **Date:** Feb 20, 2026 | **Status:** ✅ Complete
