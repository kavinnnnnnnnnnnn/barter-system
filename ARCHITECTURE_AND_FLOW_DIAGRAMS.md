# 📊 Visual Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     BARTER SYSTEM - NEW FEATURE                 │
│               Product-Specific Details Collection                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           POST NEW OFFER FORM                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 📦 Category Selection                                   │   │
│  │ ┌──────────────────────────────────────────────────┐   │   │
│  │ │ [Select Category ▼]                              │   │   │
│  │ │ ⌚ Watch | 🏍️ Bike | 🚗 Car | 📚 Books | etc    │   │   │
│  │ └──────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │ 💝 What You Offer: [Text Input]                        │   │
│  │ 🔍 What You Need:  [Text Input]                        │   │
│  │ 🖼️ Image URL:     [Text Input]                         │   │
│  │                                                         │   │
│  │ ✨ DYNAMIC PRODUCT DETAILS (Generated on category)    │   │
│  │ ┌──────────────────────────────────────────────────┐   │   │
│  │ │ 📋 Product Details                               │   │   │
│  │ │ ├─ Field 1: [Input]                              │   │   │
│  │ │ ├─ Field 2: [Dropdown]                           │   │   │
│  │ │ ├─ Field 3: [Dropdown]                           │   │   │
│  │ │ └─ Field N: [Input/Dropdown]                     │   │   │
│  │ └──────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │ 📋 Required Documents                                  │   │
│  │ ├─ 📄 Certificate: [File Upload]                       │   │
│  │ ├─ 📷 Photos: [File Upload]                            │   │
│  │ └─ [Other files as needed]                             │   │
│  │                                                         │   │
│  │ [📤 Post Offer Button]                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Functions:                                                      │
│  • updateFileRequirements() - Generate product fields           │
│  • collectProductDetails() - Gather detail values               │
│  • postOffer() - Submit with product details                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ POST Request
                            │ + FormData
                            │ (offer, need, category, productDetails, files)
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /post endpoint                                             │
│  ├─ Parse productDetails JSON                                   │
│  ├─ Validate files                                              │
│  ├─ Store files                                                 │
│  └─ Save to database                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │ INSERT
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  offers table                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id                INT                                   │   │
│  │ user_id           INT                                   │   │
│  │ category          VARCHAR(50)                          │   │
│  │ offer             TEXT                                 │   │
│  │ need              TEXT                                 │   │
│  │ image             TEXT                                 │   │
│  │ product_details   JSON ← NEW FIELD!                   │   │
│  │ status            VARCHAR(20)                          │   │
│  │ created_at        TIMESTAMP                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Example product_details JSON:                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ {                                                       │   │
│  │   "category": "gadgets",                                │   │
│  │   "gadgetBrand": "Apple",                               │   │
│  │   "gadgetModel": "iPhone 13 Pro",                       │   │
│  │   "gadgetType": "Smartphone",                           │   │
│  │   "gadgetCondition": "Excellent",                       │   │
│  │   "gadgetWarranty": "Active"                            │   │
│  │ }                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

```
START: User Opens Dashboard
  │
  └─→ [User sees "Post New Offer" form]
        │
        └─→ USER ACTION 1: Select Category
              │
              ├─→ [Page detects category change]
              │
              ├─→ updateFileRequirements() function called
              │    ├─ Identifies product category
              │    ├─ Gets field definitions for that category
              │    ├─ Generates HTML for each field
              │    ├─ Shows product details section
              │    └─ Shows required file uploads
              │
              └─→ ✨ INSTANT: Product fields appear on page
                     │
                     └─→ USER ACTION 2: Fill Product Details
                           │
                           ├─→ Brand field: User types "Apple"
                           ├─→ Model field: User types "iPhone 13 Pro"
                           ├─→ Type field: User selects "Smartphone"
                           ├─→ Condition: User selects "Excellent"
                           └─→ Warranty: User selects "Active"
                                 │
                                 └─→ USER ACTION 3: Fill Standard Fields
                                       │
                                       ├─→ What You Need: "Laptop"
                                       ├─→ What You Offer: "iPhone 13 Pro"
                                       └─→ Image URL: "https://..."
                                             │
                                             └─→ USER ACTION 4: Upload Documents
                                                   │
                                                   ├─→ Certificate: [Select PDF]
                                                   └─→ Photos: [Select JPG, PNG]
                                                         │
                                                         └─→ USER ACTION 5: Click Post Offer
                                                               │
                                                               ├─→ postOffer() function called
                                                               │
                                                               ├─→ collectProductDetails() runs
                                                               │    └─ Returns: {category, gadgetBrand, 
                                                               │       gadgetModel, gadgetType, ...}
                                                               │
                                                               ├─→ Validation checks
                                                               │    ├─ Offer & Need fields filled ✓
                                                               │    ├─ Category selected ✓
                                                               │    ├─ Required files uploaded ✓
                                                               │    └─ Product details collected ✓
                                                               │
                                                               ├─→ FormData assembled
                                                               │    ├─ user_id
                                                               │    ├─ category
                                                               │    ├─ offer
                                                               │    ├─ need
                                                               │    ├─ image
                                                               │    ├─ productDetails (JSON stringified)
                                                               │    └─ files
                                                               │
                                                               ├─→ POST /post sent to backend
                                                               │
                                                               ├─→ ⏳ Loading state shown
                                                               │
                                                               ├─→ Backend responds
                                                               │
                                                               ├─→ ✅ Success!
                                                               │    ├─ Form cleared
                                                               │    ├─ Success message shown
                                                               │    └─ Redirect to category page
                                                               │
                                                               └─→ END: Offer posted with complete data!
```

---

## Category Selection → Field Generation Map

```
Category Selection
       │
       ├─ ⌚ Watch
       │  ├─ Generate: watchBrand (text)
       │  ├─ Generate: watchModel (text)
       │  ├─ Generate: watchCondition (select)
       │  └─ Generate: watchType (select)
       │
       ├─ 🏍️ Bike
       │  ├─ Generate: bikeBrand (text)
       │  ├─ Generate: bikeModel (text)
       │  ├─ Generate: bikeYear (number)
       │  ├─ Generate: bikeKilometers (number)
       │  └─ Generate: bikeCondition (select)
       │
       ├─ 🚗 Car
       │  ├─ Generate: carBrand (text)
       │  ├─ Generate: carModel (text)
       │  ├─ Generate: carYear (number)
       │  ├─ Generate: carKilometers (number)
       │  ├─ Generate: carFuelType (select)
       │  └─ Generate: carCondition (select)
       │
       ├─ 📚 Books
       │  ├─ Generate: bookTitle (text)
       │  ├─ Generate: bookAuthor (text)
       │  ├─ Generate: bookGenre (text)
       │  ├─ Generate: bookCondition (select)
       │  └─ Generate: bookYear (number)
       │
       ├─ 👔 Fashion
       │  ├─ Generate: fashionType (select)
       │  ├─ Generate: fashionSize (text)
       │  ├─ Generate: fashionBrand (text)
       │  ├─ Generate: fashionMaterial (text)
       │  ├─ Generate: fashionCondition (select)
       │  └─ Generate: fashionColor (text)
       │
       ├─ 📱 Gadgets
       │  ├─ Generate: gadgetBrand (text)
       │  ├─ Generate: gadgetModel (text)
       │  ├─ Generate: gadgetType (select)
       │  ├─ Generate: gadgetCondition (select)
       │  └─ Generate: gadgetWarranty (select)
       │
       ├─ 🏠 Land
       │  ├─ Generate: landLocation (text)
       │  ├─ Generate: landArea (number)
       │  ├─ Generate: landType (select)
       │  └─ Generate: landCondition (select)
       │
       ├─ 💎 Jewelry
       │  ├─ Generate: jewelryType (select)
       │  ├─ Generate: jewelryMaterial (select)
       │  ├─ Generate: jewelryWeight (number)
       │  ├─ Generate: jewelryCondition (select)
       │  └─ Generate: jewelryPurity (text)
       │
       └─ 🎁 Other
          └─ No product details needed
```

---

## Data Collection & Transmission

```
┌─────────────────────────────────────────────────────┐
│ FORM DATA IN BROWSER                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ offer = "iPhone 13 Pro"                             │
│ need = "Laptop"                                     │
│ image = "https://..."                               │
│ category = "gadgets"                                │
│                                                     │
│ productDetail_gadgetBrand = "Apple"                 │
│ productDetail_gadgetModel = "iPhone 13 Pro"         │
│ productDetail_gadgetType = "Smartphone"             │
│ productDetail_gadgetCondition = "Excellent"         │
│ productDetail_gadgetWarranty = "Active"             │
│                                                     │
│ certificate = [File]                                │
│ proofPhotos = [File, File, File]                    │
│                                                     │
└─────────────────────────────────────────────────────┘
           │
           │ collectProductDetails() processes
           │
           ▼
┌─────────────────────────────────────────────────────┐
│ PRODUCT DETAILS OBJECT                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ {                                                   │
│   category: "gadgets",                              │
│   gadgetBrand: "Apple",                             │
│   gadgetModel: "iPhone 13 Pro",                     │
│   gadgetType: "Smartphone",                         │
│   gadgetCondition: "Excellent",                     │
│   gadgetWarranty: "Active"                          │
│ }                                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
           │
           │ JSON.stringify()
           │
           ▼
┌─────────────────────────────────────────────────────┐
│ FORM DATA (Ready to POST)                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ user_id: "123"                                      │
│ category: "gadgets"                                 │
│ offer: "iPhone 13 Pro"                              │
│ need: "Laptop"                                      │
│ image: "https://..."                                │
│ productDetails: "{\"category\":\"gadgets\",         │
│                  \"gadgetBrand\":\"Apple\",         │
│                  \"gadgetModel\":\"iPhone 13 Pro\", │
│                  \"gadgetType\":\"Smartphone\",     │
│                  \"gadgetCondition\":\"Excellent\", │
│                  \"gadgetWarranty\":\"Active\"}"    │
│ certificate: [File Binary]                          │
│ proofPhotos: [File1, File2, File3]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
           │
           │ HTTP POST
           │
           ▼
    Backend /post endpoint
           │
           │ req.body.productDetails parsed
           │
           ▼
┌─────────────────────────────────────────────────────┐
│ DATABASE INSERT                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ INSERT INTO offers (                                │
│   user_id,                                          │
│   category,                                         │
│   offer,                                            │
│   need,                                             │
│   image,                                            │
│   product_details,                                  │
│   status                                            │
│ ) VALUES (                                          │
│   123,                                              │
│   'gadgets',                                        │
│   'iPhone 13 Pro',                                  │
│   'Laptop',                                         │
│   'https://...',                                    │
│   '{"category":"gadgets",...}',                     │
│   'active'                                          │
│ )                                                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌────────────────────────────────────────────────────────┐
│           HTML STRUCTURE                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│ <select id="category"                                  │
│         onchange="updateFileRequirements()">           │
│   [Options...]                                         │
│ </select>                                              │
│         │                                              │
│         └─ TRIGGERS ─→ updateFileRequirements()       │
│                            │                           │
│                            ├─ Read selected category   │
│                            │                           │
│                            ├─ Get field definitions    │
│                            │   from productDetails{}   │
│                            │                           │
│                            ├─ Generate HTML for each   │
│                            │   field type (text,       │
│                            │   number, select)         │
│                            │                           │
│                            ├─ Insert into              │
│                            │   #dynamicDetailsFields   │
│                            │   div                     │
│                            │                           │
│                            └─ Show/hide file sections  │
│                                                        │
│ <div id="productDetailsContainer"                      │
│      style="display: none">                            │
│   <div id="dynamicDetailsFields">                      │
│     <!-- Generated form fields go here -->             │
│   </div>                                               │
│ </div>                                                 │
│         ▲                                              │
│         │                                              │
│    Populated by updateFileRequirements()              │
│         │                                              │
│         ├─ Field values collected by                   │
│         │  collectProductDetails()                     │
│         │                                              │
│         └─ Used in postOffer()                         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Complete Event Timeline

```
Timeline of User Actions & System Responses:

T0:00   User opens dashboard
        ├─ Page loads
        └─ Form visible with category dropdown

T0:15   User clicks category dropdown
        ├─ Dropdown opens
        └─ Categories listed

T0:30   User selects "Gadgets"
        ├─ onchange event triggered
        ├─ updateFileRequirements() called
        ├─ Current fields (watch, bike, car, etc) hidden
        ├─ Gadget-specific fields generated:
        │  ├─ Brand input field
        │  ├─ Model input field
        │  ├─ Type dropdown (Smartphone, Laptop, etc)
        │  ├─ Condition dropdown (New, Excellent, etc)
        │  └─ Warranty dropdown (Active, Expired, None)
        └─ ✨ All fields instantly appear (visual update)

T1:00   User fills in Brand field
        └─ Types "Apple"

T1:15   User fills in Model field
        └─ Types "iPhone 13 Pro"

T1:30   User selects from Type dropdown
        └─ Clicks → Selects "Smartphone"

T1:45   User selects from Condition dropdown
        └─ Clicks → Selects "Excellent"

T2:00   User selects from Warranty dropdown
        └─ Clicks → Selects "Active"

T2:30   User fills "What You Need"
        └─ Types "Laptop"

T2:45   User fills "What You Offer"
        └─ Types "iPhone 13 Pro"

T3:00   User enters Image URL
        └─ Pastes URL

T3:30   User uploads certificate
        └─ Selects file

T3:45   User uploads proof photos
        └─ Selects 3 files

T4:00   User clicks "Post Offer" button
        ├─ onclick="postOffer()" triggered
        ├─ Validation checks:
        │  ├─ Offer field not empty ✓
        │  ├─ Need field not empty ✓
        │  ├─ Category selected ✓
        │  ├─ Required files uploaded ✓
        │  └─ All checks passed ✓
        ├─ collectProductDetails("gadgets") called
        │  ├─ Gets all elements with id="productDetail_*"
        │  ├─ Reads values:
        │  │  ├─ #productDetail_gadgetBrand = "Apple"
        │  │  ├─ #productDetail_gadgetModel = "iPhone 13 Pro"
        │  │  ├─ #productDetail_gadgetType = "Smartphone"
        │  │  ├─ #productDetail_gadgetCondition = "Excellent"
        │  │  └─ #productDetail_gadgetWarranty = "Active"
        │  └─ Returns object with all values
        ├─ FormData assembled with:
        │  ├─ user_id, category, offer, need, image
        │  ├─ productDetails (stringified JSON)
        │  └─ all files
        ├─ Loading indicator shown
        ├─ Form disabled
        └─ POST request sent to backend

T4:15   Backend receives request
        ├─ Parses productDetails JSON
        ├─ Saves files to storage
        └─ Inserts record to database

T4:30   Database confirms insert
        └─ Returns offer_id

T4:45   Backend sends success response
        ├─ Includes offer_id
        └─ Includes product_details confirmation

T5:00   Frontend receives success response
        ├─ Show success message
        ├─ Clear all form fields
        ├─ Hide product details section
        └─ Redirect to category page

✅ COMPLETE: Offer posted with product details!
```

---

**Diagram Version**: 1.0
**Date**: February 2026
