# 📄 Document Requirements for Barter Offers

## Overview
The barter system now requires users to submit supporting documents based on the item category they are offering. This ensures authenticity and builds trust in the marketplace.

---

## 📋 Category-Based Document Requirements

### ⌚ Watch
- **Required Documents:**
  - Original Certificate (PDF, JPG, PNG, DOC)
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Verify authenticity and condition of the watch

### 🏍️ Bike/Motorcycle
- **Required Documents:**
  - Insurance Document (PDF, JPG, PNG, DOC)
  - Registration Certificate (PDF, JPG, PNG, DOC)
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Verify ownership, insurance status, and vehicle condition

### 🚗 Car/Vehicle
- **Required Documents:**
  - Insurance Document (PDF, JPG, PNG, DOC)
  - Registration Certificate (PDF, JPG, PNG, DOC)
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Verify ownership, insurance, and vehicle condition

### 📚 Books
- **Required Documents:**
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Show book condition and authenticity

### 👔 Fashion/Clothing
- **Required Documents:**
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Show clothing condition and fit

### 📱 Gadgets/Electronics
- **Required Documents:**
  - Warranty/Certificate (PDF, JPG, PNG, DOC)
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Verify warranty status and device condition

### 🏠 Land/Property
- **Required Documents:**
  - Ownership Proof (PDF, JPG, PNG, DOC)
  - Registration Certificate (PDF, JPG, PNG, DOC)
- **Purpose:** Verify ownership and legal status

### 💎 Jewelry
- **Required Documents:**
  - Certificate of Authenticity (PDF, JPG, PNG, DOC)
  - Proof Photos (Multiple photos allowed)
- **Purpose:** Verify authenticity and condition

### 🎁 Other
- **Required Documents:** None
- **Note:** No specific requirements, but photos are recommended

---

## 📝 How It Works

### 1. **Post an Offer**
   - Navigate to the "Post New Offer" section on the dashboard
   - Select a **Category** from the dropdown menu
   - Fill in "What You Need" and "What You Offer"
   - (Optional) Add an image URL

### 2. **Document Requirements Display**
   - Once you select a category, required documents will appear in a highlighted section
   - A yellow box shows what documents are needed for your selected category

### 3. **Upload Required Files**
   - File upload fields will dynamically appear based on your category
   - Accepted file types: **PDF, JPG, PNG, DOC, DOCX**
   - Maximum file size: **10 MB per file**
   - For proof photos: You can upload **up to 10 photos**

### 4. **Submit Your Offer**
   - Once all required documents are uploaded, click "📤 Post Offer"
   - The system validates all required files are present
   - Files are securely stored on the server
   - A confirmation message appears upon successful submission

---

## 🔐 File Security & Storage

- **Location:** Files are stored in `backend/uploads/` directory
- **Naming:** Files are renamed with timestamps to prevent conflicts
- **Access:** Files can be downloaded/viewed by authorized users
- **Validation:** Only specific file types are accepted to prevent security issues
- **Size Limit:** Maximum 10 MB per file

---

## ✅ Validation Rules

1. **Category must be selected** - Cannot post without selecting a category
2. **All required documents must be uploaded** - Cannot post if any required file is missing
3. **Valid file types only** - JPG, PNG, PDF, DOC, DOCX
4. **File size limit** - Maximum 10 MB per file
5. **Multiple photos allowed** - For proof photos, you can upload multiple images

---

## 🚀 Benefits

- **Trust & Transparency:** Buyers can verify authenticity of items
- **Faster Exchanges:** Clear documentation speeds up the decision process
- **Dispute Resolution:** Documents help resolve disputes if any arise
- **Quality Assurance:** Proof photos ensure items match descriptions

---

## 📞 Support

If you have issues uploading documents:
- Ensure files are in supported formats (PDF, JPG, PNG, DOC, DOCX)
- Check file size is under 10 MB
- Try a different browser or clear cache
- Contact support for persistent issues

---

## 🔄 Version History

- **v1.0** (Feb 20, 2026): Initial implementation with category-based document requirements
