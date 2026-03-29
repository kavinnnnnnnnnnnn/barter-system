# 🔧 Backend Integration Guide - Product Details

## Overview
The frontend now sends product-specific details with each offer. The backend needs to store and utilize this data.

## What the Backend Receives

### POST /post endpoint receives:
```javascript
{
  user_id: "user_id",
  offer: "iPhone 13",
  need: "Laptop",
  image: "https://...",
  category: "gadgets",
  productDetails: "{\"category\":\"gadgets\",\"gadgetBrand\":\"Apple\",\"gadgetModel\":\"iPhone 13\",\"gadgetType\":\"Smartphone\",\"gadgetCondition\":\"Excellent\",\"gadgetWarranty\":\"Active\"}",
  certificate: [file],
  proofPhotos: [files],
  insurance: [file],
  registration: [file],
  ownership: [file]
}
```

Note: `productDetails` is sent as a JSON string and needs to be parsed.

## Database Schema Updates

### Add Column to `offers` Table

```sql
ALTER TABLE offers ADD COLUMN product_details JSON DEFAULT NULL;
```

OR create a separate table:

```sql
CREATE TABLE offer_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  offer_id INT NOT NULL,
  category VARCHAR(50),
  details_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
);
```

## Backend Implementation

### Update server.js POST /post endpoint

```javascript
// Parse product details
const productDetails = JSON.parse(req.body.productDetails || '{}');

// Example: Store in offers table
const query = `
  INSERT INTO offers 
  (user_id, category, offer, need, image, product_details, status)
  VALUES (?, ?, ?, ?, ?, ?, 'active')
`;

db.query(query, [
  req.body.user_id,
  req.body.category,
  req.body.offer,
  req.body.need,
  req.body.image,
  JSON.stringify(productDetails)  // Store as JSON
]);
```

### Example Handler Function

```javascript
app.post('/post', upload.array('proofPhotos', 10), (req, res) => {
  try {
    const { user_id, category, offer, need, image } = req.body;
    
    // Parse product details
    let productDetails = {};
    try {
      productDetails = JSON.parse(req.body.productDetails || '{}');
    } catch (e) {
      console.error('Error parsing product details:', e);
      productDetails = {};
    }

    // Validate required files
    const requiredFiles = getRequiredFiles(category);
    // ... validation logic ...

    // Insert offer with product details
    const query = `
      INSERT INTO offers 
      (user_id, category, offer, need, image, product_details, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())
    `;

    db.query(query, [
      user_id,
      category,
      offer,
      need,
      image,
      JSON.stringify(productDetails)
    ], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.json({ 
          success: false, 
          error: 'Error saving offer. Please try again.' 
        });
      }

      const offerId = result.insertId;
      
      // Handle file uploads...
      // Store product details successfully
      
      console.log('✅ Offer posted with details:', {
        offerId,
        category,
        productDetails
      });

      res.json({ 
        success: true, 
        message: 'Offer posted successfully!',
        offer_id: offerId,
        product_details: productDetails
      });
    });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, error: 'Server error' });
  }
});
```

## Querying Product Details

### Get offer with product details

```javascript
app.get('/offer/:id', (req, res) => {
  const query = `SELECT * FROM offers WHERE id = ?`;
  
  db.query(query, [req.params.id], (err, results) => {
    if (results && results[0]) {
      const offer = results[0];
      
      // Parse product details
      let productDetails = {};
      if (offer.product_details) {
        try {
          productDetails = JSON.parse(offer.product_details);
        } catch (e) {
          console.error('Error parsing details:', e);
        }
      }
      
      res.json({
        ...offer,
        product_details: productDetails  // Now it's an object
      });
    }
  });
});
```

### Search by product details

```javascript
app.get('/search', (req, res) => {
  const { category, brand, condition } = req.query;
  
  let query = `SELECT * FROM offers WHERE 1=1`;
  let params = [];
  
  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }
  
  if (brand) {
    // JSON_EXTRACT for MySQL 5.7+
    query += ` AND JSON_EXTRACT(product_details, '$.*.Brand') LIKE ?`;
    params.push(`%${brand}%`);
  }
  
  if (condition) {
    // Search in condition fields
    query += ` AND (
      JSON_EXTRACT(product_details, '$.*.Condition') LIKE ? OR
      JSON_EXTRACT(product_details, '$.*.condition') LIKE ? OR
      JSON_EXTRACT(product_details, '$.watchCondition') LIKE ? OR
      JSON_EXTRACT(product_details, '$.bikeCondition') LIKE ? OR
      JSON_EXTRACT(product_details, '$.gadgetCondition') LIKE ?
    )`;
    params.push(`%${condition}%`, `%${condition}%`, `%${condition}%`, `%${condition}%`, `%${condition}%`);
  }
  
  db.query(query, params, (err, results) => {
    if (err) return res.json({ error: 'Search failed' });
    
    // Parse all product details
    const offers = results.map(offer => ({
      ...offer,
      product_details: offer.product_details ? JSON.parse(offer.product_details) : {}
    }));
    
    res.json(offers);
  });
});
```

## Display Product Details on Frontend

### Update offer cards to show product details

```javascript
// When displaying an offer
const offer = {
  id: 1,
  offer: "iPhone 13",
  category: "gadgets",
  product_details: {
    gadgetBrand: "Apple",
    gadgetModel: "iPhone 13",
    gadgetType: "Smartphone",
    gadgetCondition: "Excellent",
    gadgetWarranty: "Active"
  }
};

// Build details display
let detailsHTML = '<div class="product-details">';
for (const [key, value] of Object.entries(offer.product_details)) {
  if (key !== 'category') {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    detailsHTML += `<p><strong>${label}:</strong> ${value}</p>`;
  }
}
detailsHTML += '</div>';
```

## Email Notifications Update

When sending offer notifications, include product details:

```javascript
const productDetailsText = Object.entries(productDetails)
  .filter(([key]) => key !== 'category')
  .map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').trim();
    return `${label}: ${value}`;
  })
  .join('\n');

const emailBody = `
  Product Category: ${category}
  
  What They're Offering:
  ${offer}
  
  Product Details:
  ${productDetailsText}
  
  What They Need:
  ${need}
`;
```

## Data Backup & Migration

If you have existing offers without product_details:

```javascript
// Script to migrate existing offers if needed
// (Most will have NULL, which is fine)

app.post('/migrate-offers', (req, res) => {
  const query = `SELECT * FROM offers WHERE product_details IS NULL`;
  
  db.query(query, (err, results) => {
    // Process and update if needed
    // Most offers won't need data - new field is optional
  });
});
```

## Testing the Integration

### Test cURL command

```bash
curl -X POST http://localhost:3000/post \
  -F "user_id=1" \
  -F "category=gadgets" \
  -F "offer=iPhone 13" \
  -F "need=Laptop" \
  -F "image=https://..." \
  -F 'productDetails={"category":"gadgets","gadgetBrand":"Apple","gadgetModel":"iPhone 13","gadgetType":"Smartphone","gadgetCondition":"Excellent","gadgetWarranty":"Active"}' \
  -F "certificate=@cert.pdf" \
  -F "proofPhotos=@photo1.jpg" \
  -F "proofPhotos=@photo2.jpg"
```

### Expected Response

```json
{
  "success": true,
  "message": "Offer posted successfully!",
  "offer_id": 42,
  "product_details": {
    "category": "gadgets",
    "gadgetBrand": "Apple",
    "gadgetModel": "iPhone 13",
    "gadgetType": "Smartphone",
    "gadgetCondition": "Excellent",
    "gadgetWarranty": "Active"
  }
}
```

## Summary

✅ Parse `productDetails` JSON from request
✅ Store in database (JSON column or separate table)
✅ Retrieve and parse when displaying offers
✅ Use for search/filtering
✅ Include in notifications and communications
✅ Display on offer cards/details pages

---

**Status**: Ready for Backend Implementation
**Dependencies**: Frontend Product Details Collection Feature (Completed ✅)
