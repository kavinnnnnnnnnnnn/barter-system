# 🧪 Testing Guide - Product Details Feature

## Quick Test (5 minutes)

### Step 1: Open Dashboard
1. Go to dashboard.html in browser
2. Should see "Post New Offer" form on right side

### Step 2: Select a Category
1. Click category dropdown
2. Select "Gadgets"
3. ✨ **Expected**: Product detail fields appear below the image field

### Step 3: Verify Fields Appeared
Look for:
- ✓ Brand field (text input)
- ✓ Model field (text input)
- ✓ Type dropdown
- ✓ Condition dropdown
- ✓ Warranty dropdown

### Step 4: Try Different Categories
1. Select "Watch" → Different fields appear
2. Select "Car" → Different fields appear
3. Select "Books" → Different fields appear

**Result**: Each category shows its own fields ✅

---

## Manual Testing (15 minutes)

### Test Case 1: Gadgets Category

**Setup:**
1. Open dashboard
2. Select category: "Gadgets"

**Steps:**
1. Fill "What You Need": Laptop
2. Fill "What You Offer": iPhone 13 Pro
3. Fill product details:
   - Brand: Apple
   - Model: iPhone 13 Pro
   - Type: Smartphone
   - Condition: Excellent
   - Warranty: Active
4. Add image URL (optional)
5. Upload certificate file
6. Upload proof photos

**Expected Result:**
- Form validates ✓
- Can submit ✓
- Backend receives all data ✓

---

### Test Case 2: Car Category

**Setup:**
1. Open dashboard
2. Select category: "Car"

**Steps:**
1. Fill "What You Need": Bike + Cash
2. Fill "What You Offer": Toyota Camry
3. Fill product details:
   - Brand: Toyota
   - Model: Camry
   - Year: 2018
   - Kilometers: 45000
   - Fuel Type: Petrol
   - Condition: Good
4. Add image URL
5. Upload insurance document
6. Upload registration certificate
7. Upload proof photos

**Expected Result:**
- 6 product detail fields appear ✓
- Different fields than gadgets ✓
- All data sent to backend ✓

---

### Test Case 3: Books Category

**Setup:**
1. Open dashboard
2. Select category: "Books"

**Steps:**
1. Fill "What You Need": Another book
2. Fill "What You Offer": 1984
3. Fill product details:
   - Title: 1984
   - Author: George Orwell
   - Genre: Science Fiction
   - Condition: Like New
   - Year: 2019
4. Upload proof photos

**Expected Result:**
- 5 product detail fields appear ✓
- Fewer fields than car ✓
- Only proof photos required ✓

---

### Test Case 4: Category Change

**Steps:**
1. Start with category "Gadgets"
2. Fields appear for gadgets
3. Change to "Watch"
4. Old gadget fields disappear
5. New watch fields appear

**Expected Result:**
- Clean field replacement ✓
- No old values lingering ✓
- Form ready for new category ✓

---

## Browser Console Testing

### Test 1: Verify collectProductDetails() Function

```javascript
// In browser console (F12)
// 1. Select "Gadgets" category
// 2. Fill in the product details
// 3. Run this:

collectProductDetails("gadgets")

// Expected output:
{
  category: "gadgets",
  gadgetBrand: "Apple",
  gadgetModel: "iPhone 13 Pro",
  gadgetType: "Smartphone",
  gadgetCondition: "Excellent",
  gadgetWarranty: "Active"
}
```

### Test 2: Check Field IDs

```javascript
// List all product detail fields
document.querySelectorAll('[id^="productDetail_"]').forEach(el => {
  console.log(el.id, '=', el.value)
})

// Should show all field IDs and values
```

### Test 3: Verify Data Collection

```javascript
// After selecting category and filling fields
const category = document.getElementById("category").value;
console.log("Selected category:", category);

// Should show the category in console
```

---

## Data Verification Checklist

### Before Submission
- [ ] Category selected
- [ ] "What You Need" filled
- [ ] "What You Offer" filled
- [ ] Product details filled (all visible fields)
- [ ] Required files uploaded
- [ ] Image URL added (optional)

### In Browser Console
- [ ] collectProductDetails() returns valid object
- [ ] All product detail fields have values
- [ ] No console errors shown
- [ ] FormData properly assembled

### After Submission
- [ ] Success message appears
- [ ] Form clears
- [ ] Page redirects (if configured)

---

## Testing Different Field Types

### Text Input Fields
```
Test: Enter "Apple" in Brand field
Expected: Value stored, no validation error
```

### Number Input Fields
```
Test: Enter "2020" in Year field
Expected: Only numbers accepted, no letters
```

### Dropdown (Select) Fields
```
Test: Click Condition dropdown
Expected: Options appear (New, Excellent, Good, Fair)
Test: Select "Excellent"
Expected: Value stored, field shows selection
```

---

## Error Testing

### Test 1: Missing Category
```
1. Try to submit without selecting category
Expected: Alert: "Please select a category"
```

### Test 2: Missing Product Details
```
1. Select category
2. Don't fill product details
3. Try to submit
Expected: Alert: "Please fill Offer and Need fields"
```

### Test 3: Missing Files
```
1. Select category with required files
2. Don't upload files
3. Try to submit
Expected: Alert: "Please upload required document"
```

---

## UI/UX Testing

### Visual Test Checklist
- [ ] Product details section has blue border
- [ ] Emoji icons visible (📋, etc)
- [ ] Fields properly aligned
- [ ] Labels readable
- [ ] Styling matches dashboard theme
- [ ] No overflow or text cutoff
- [ ] Responsive on mobile

### Interaction Test Checklist
- [ ] Smooth field generation
- [ ] No flickering
- [ ] Fields appear immediately
- [ ] Dropdown options work
- [ ] Input fields accept text
- [ ] No lag when selecting category

---

## Mobile Testing

### iPhone/iPad
1. Open dashboard on mobile
2. Select category
3. Verify fields appear
4. Fill product details
5. Submit form

### Android
1. Open dashboard on mobile
2. Test same as iOS

### Expected Results
- ✅ Responsive layout
- ✅ Touch-friendly buttons
- ✅ Readable text
- ✅ No horizontal scroll

---

## Cross-Browser Testing

### Chrome
- [ ] Open dashboard
- [ ] Test all features
- [ ] Check console (F12)

### Firefox
- [ ] Open dashboard
- [ ] Test all features
- [ ] Check console (F12)

### Safari
- [ ] Open dashboard
- [ ] Test all features
- [ ] Check console (⌘+⌥+I)

### Edge
- [ ] Open dashboard
- [ ] Test all features
- [ ] Check console (F12)

---

## Performance Testing

### Load Time
```
Measure time to load dashboard:
Expected: < 2 seconds
```

### Field Generation Speed
```
Select category and measure time for fields to appear:
Expected: Instant (< 100ms)
```

### Form Submission
```
Submit form and measure backend response time:
Expected: < 3 seconds
```

---

## Data Integrity Testing

### Test 1: Data Consistency
1. Fill product details
2. Change category
3. Change back to original
4. Check if fields empty (should be)

**Result**: Old data should not persist ✓

### Test 2: Data Accuracy
1. Enter specific values
2. Check console with collectProductDetails()
3. Verify exact values are returned

**Result**: Values match exactly ✓

### Test 3: Special Characters
1. Enter special characters in text fields
2. Submit form
3. Check backend logging

**Result**: Special characters handled correctly ✓

---

## Integration Testing

### Test 1: Form Submission Flow
1. Select category ✓
2. Fill all fields ✓
3. Upload files ✓
4. Click submit ✓
5. Check backend receives data ✓

### Test 2: Category-Specific Files
1. Select "Watch" → Certificate + Photos required
2. Select "Car" → Insurance + Registration + Photos
3. Select "Other" → No specific files

**Result**: Correct files shown per category ✓

### Test 3: Data Flow to Backend
```
Frontend → POST /post → Backend
├─ offer ✓
├─ need ✓
├─ category ✓
├─ productDetails ✓ (JSON stringified)
└─ files ✓
```

---

## Regression Testing

### Existing Features Should Still Work
- [ ] Category dropdown works
- [ ] File uploads work
- [ ] Form validation works
- [ ] Image URL input works
- [ ] Submit button works
- [ ] Error messages show
- [ ] Success messages show

---

## Test Scenarios

### Scenario 1: Happy Path
```
User selects category → Fills all fields → Uploads files → Submits
Expected: Success ✅
```

### Scenario 2: Partial Fill
```
User selects category → Fills some fields → Skips some → Submits
Expected: Validation error or empty fields warning ✅
```

### Scenario 3: Category Change
```
User selects category A → Fills fields → Changes to category B → Fills different fields
Expected: Clean state for new category ✅
```

### Scenario 4: Multiple Submissions
```
User submits form once → Form clears → User submits again
Expected: Both submissions successful ✅
```

---

## Checklist for Production

Before deploying to production:

- [ ] All 8 categories tested
- [ ] All field types working (text, number, select)
- [ ] Data collection verified
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cross-browser tested
- [ ] Form validation working
- [ ] File uploads working
- [ ] Backend integration guide ready
- [ ] Documentation complete

---

## Logging for Testing

### Browser Console Debugging
```javascript
// Enable detailed logging in postOffer():
console.log('📋 Product Details:', productDetails);

// Check form data being sent
console.log('📤 Sending:', formData);

// Verify backend response
console.log('✅ Response:', data);
```

### Backend Logging
```javascript
// Log received product details
console.log('Received productDetails:', req.body.productDetails);

// Parse and verify
const details = JSON.parse(req.body.productDetails);
console.log('Parsed details:', details);
```

---

## Known Issues & Fixes

### Issue: Fields not appearing
**Solution**: Refresh browser, clear cache, try different category

### Issue: Data not being sent
**Solution**: Check browser console for errors, verify collectProductDetails() returns data

### Issue: File upload failing
**Solution**: Check file type, try different file, verify permissions

### Issue: Form not submitting
**Solution**: Check validation errors, ensure all required fields filled

---

## Test Results Template

```
TEST EXECUTION REPORT
═══════════════════════════════════════════════════════════

Test Category: [Category Name]
Test Date: [Date]
Tester: [Name]
Browser: [Browser Name & Version]
Device: [Desktop/Mobile]

Test Cases Executed:
✓ Test Case 1: [Description] - PASS/FAIL
✓ Test Case 2: [Description] - PASS/FAIL
✓ Test Case 3: [Description] - PASS/FAIL

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]

Overall Status: ✅ PASS / ❌ FAIL

Signed: _______________
Date: __________________
```

---

## Quick Test Command

```bash
# Open dashboard and run in console:
selectCategory = (cat) => document.getElementById('category').value = cat;
collectDetails = () => collectProductDetails(document.getElementById('category').value);

# Usage:
selectCategory('gadgets');
collectDetails(); // Check console output
```

---

**Document**: Testing Guide
**Version**: 1.0
**Date**: February 20, 2026
