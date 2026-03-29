# 📚 Quick Reference - Product Details Fields

## Category → Product Details Fields Mapping

### ⌚ Watch
```
Brand          (text)      Brand name - Rolex, Omega, Seiko
Model          (text)      Model name - Submariner, Datejust
Condition      (select)    New | Like New | Excellent | Good | Fair
Type           (select)    Automatic | Manual | Quartz | Digital
```

### 🏍️ Bike/Motorcycle
```
Brand          (text)      Honda, Royal Enfield, Harley
Model          (text)      CB 500, Bullet, Street 750
Year           (number)    2015, 2020, 2023
Kilometers     (number)    50000, 75000, 100000
Condition      (select)    Excellent | Good | Fair | Needs Repair
```

### 🚗 Car/Vehicle
```
Brand          (text)      Toyota, BMW, Maruti, Hyundai
Model          (text)      Camry, 3 Series, Swift, i20
Year           (number)    2015, 2018, 2020, 2022
Kilometers     (number)    45000, 85000, 120000
Fuel Type      (select)    Petrol | Diesel | CNG | Hybrid | Electric
Condition      (select)    Excellent | Good | Fair | Needs Repair
```

### 📚 Books
```
Title          (text)      The Midnight Library, 1984
Author         (text)      Matt Haig, George Orwell
Genre          (text)      Fiction, Science, History, Mystery
Condition      (select)    Like New | Good | Fair | Well-Read
Publication    (number)    2020, 2021, 2019
```

### 👔 Fashion/Clothing
```
Type           (select)    Shirt | Pants | Dress | Jacket | Shoes | Other
Size           (text)      XS, S, M, L, XL, XXL
Brand          (text)      Levi's, Nike, Gucci, Zara
Material       (text)      Cotton, Polyester, Wool, Silk
Condition      (select)    New | Like New | Good | Fair | Worn
Color          (text)      Blue, Red, Black, White, Mixed
```

### 📱 Gadgets/Electronics
```
Brand          (text)      Apple, Samsung, Google, Dell
Model          (text)      iPhone 13, Galaxy S21, MacBook Pro
Type           (select)    Smartphone | Laptop | Tablet | Watch | 
                           Headphones | Camera | Other
Condition      (select)    New | Like New | Excellent | Good | Fair
Warranty       (select)    Active | Expired | None
```

### 🏠 Land/Property
```
Location       (text)      Mumbai, Delhi, Bangalore, Chennai
Area           (number)    5000, 10000, 50000 (sq. ft)
Type           (select)    Residential | Commercial | Agricultural | Mixed
Condition      (select)    Clear | Disputed | Under Mortgage | Other
```

### 💎 Jewelry
```
Type           (select)    Ring | Necklace | Bracelet | Earrings | 
                           Watch | Other
Material       (select)    Gold | Silver | Platinum | Diamond | Other
Weight         (number)    2.5, 5, 10 (grams)
Condition      (select)    New | Like New | Excellent | Good | Fair
Purity         (text)      22K, 18K, 14K, 916, 750
```

---

## Field Types Used

| Type | Example | Input Method |
|------|---------|--------------|
| **text** | Brand, Model, Title, Author | Text input box |
| **number** | Year, KM, Weight, Area | Number input (spinner) |
| **select** | Condition, Fuel Type, Type | Dropdown list |

---

## Required Documents by Category

| Category | Certificate | Proof Photos | Insurance | Registration | Ownership |
|----------|:---:|:---:|:---:|:---:|:---:|
| Watch | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bike | ❌ | ✅ | ✅ | ✅ | ❌ |
| Car | ❌ | ✅ | ✅ | ✅ | ❌ |
| Books | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fashion | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gadgets | ✅ | ✅ | ❌ | ❌ | ❌ |
| Land | ❌ | ❌ | ❌ | ✅ | ✅ |
| Jewelry | ✅ | ✅ | ❌ | ❌ | ❌ |
| Other | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Field Validation Rules

### Text Fields
- No validation (free text)
- Max 100 characters recommended
- Example: "Apple", "iPhone 13 Pro Max"

### Number Fields
- Must be numeric
- Positive numbers only
- Example: 2020, 50000, 5.5

### Select Fields
- Must choose from predefined options
- One selection per field
- Cannot be blank if field is present

---

## Common Values

### Condition Levels (Most Common)
```
Excellent   →  Looks brand new, fully functional
Good        →  Minor wear, fully functional
Fair        →  Some wear, mostly functional
```

### Brand Examples

**Watches**: Rolex, Omega, Seiko, Citizen, Fossil
**Bikes**: Honda, Royal Enfield, Harley, Bajaj
**Cars**: Toyota, Honda, BMW, Maruti, Hyundai, Tata
**Gadgets**: Apple, Samsung, Google, Sony, LG
**Fashion**: Levi's, Nike, Gucci, Zara, H&M
**Jewelry**: Tanishq, Joyalukkas, Malabar Gold

### Material Types
**Jewelry**: Gold, Silver, Platinum, Diamond
**Fashion**: Cotton, Polyester, Wool, Silk, Denim

### Fuel Types
- Petrol (most common)
- Diesel
- CNG
- Hybrid
- Electric

---

## Example Filled Forms

### Example 1: Watch Offer
```
Brand: Rolex
Model: Submariner
Condition: Excellent
Type: Automatic
```

### Example 2: Car Offer
```
Brand: Toyota
Model: Camry
Year: 2018
Kilometers: 45000
Fuel Type: Petrol
Condition: Good
```

### Example 3: Book Offer
```
Title: The Midnight Library
Author: Matt Haig
Genre: Fiction
Condition: Like New
Publication: 2020
```

---

## JSON Output Format

When collected and sent to backend:

```javascript
{
  category: "gadgets",
  gadgetBrand: "Apple",
  gadgetModel: "iPhone 13 Pro",
  gadgetType: "Smartphone",
  gadgetCondition: "Excellent",
  gadgetWarranty: "Active"
}
```

---

## Field ID Naming Convention

Pattern: `productDetail_{fieldName}`

Examples:
- `productDetail_watchBrand`
- `productDetail_bikeBrand`
- `productDetail_carFuelType`
- `productDetail_fashionSize`
- `productDetail_gadgetWarranty`

---

## Tips for Users

✅ **Be Specific**: More details = Better matches
✅ **Be Accurate**: Honest information builds trust
✅ **Be Complete**: Fill all available fields
✅ **Be Professional**: Use clear, descriptive text
✅ **Add Photos**: Pictures confirm condition

---

**Last Updated**: February 2026
**Version**: 1.0
