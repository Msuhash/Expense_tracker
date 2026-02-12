# Income Slice - Testing Checklist

## 🧪 Testing Guide

Use this checklist to verify that all features are working correctly.

---

## ✅ Backend API Testing

### 1. Test GET /api/income/get (No Filters)
```bash
# Using curl or Postman
GET http://localhost:8000/api/income/get
Headers: Authorization: Bearer <your-token>

Expected Response:
{
  "data": [...],
  "pagination": {
    "total": <number>,
    "totalPages": <number>,
    "currentPage": 1,
    "limit": 10,
    "hasMore": <boolean>
  }
}
```
- [ ] Returns income array
- [ ] Returns pagination metadata
- [ ] Default limit is 10
- [ ] Sorted by date (newest first)

---

### 2. Test GET /api/income/get (With Category Filter)
```bash
GET http://localhost:8000/api/income/get?category=Salary
Headers: Authorization: Bearer <your-token>
```
- [ ] Returns only income with matching category
- [ ] Case-sensitive match works
- [ ] Empty array if no matches

---

### 3. Test GET /api/income/get (With Amount Range)
```bash
GET http://localhost:8000/api/income/get?minAmount=1000&maxAmount=5000
Headers: Authorization: Bearer <your-token>
```
- [ ] Returns income where amount >= 1000
- [ ] Returns income where amount <= 5000
- [ ] Works with only minAmount
- [ ] Works with only maxAmount

---

### 4. Test GET /api/income/get (With Date Range)
```bash
GET http://localhost:8000/api/income/get?startDate=2026-01-01&endDate=2026-01-31
Headers: Authorization: Bearer <your-token>
```
- [ ] Returns income within date range
- [ ] Works with only startDate
- [ ] Works with only endDate
- [ ] Handles ISO date format correctly

---

### 5. Test GET /api/income/get (Combined Filters)
```bash
GET http://localhost:8000/api/income/get?category=Salary&minAmount=2000&startDate=2026-01-01&page=1&limit=5
Headers: Authorization: Bearer <your-token>
```
- [ ] All filters apply correctly
- [ ] Pagination works with filters
- [ ] Returns correct count

---

### 6. Test GET /api/income/get (Pagination)
```bash
# Page 1
GET http://localhost:8000/api/income/get?page=1&limit=5

# Page 2
GET http://localhost:8000/api/income/get?page=2&limit=5
```
- [ ] Page 1 returns first 5 items
- [ ] Page 2 returns next 5 items
- [ ] No duplicate items between pages
- [ ] hasMore is true when more pages exist
- [ ] hasMore is false on last page

---

### 7. Test POST /api/income/add
```bash
POST http://localhost:8000/api/income/add
Headers: Authorization: Bearer <your-token>
Body: {
  "amount": 5000,
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2026-01-06"
}
```
- [ ] Creates new income record
- [ ] Returns success message
- [ ] Validates required fields
- [ ] Returns 400 if fields missing

---

### 8. Test PUT /api/income/update/:id
```bash
PUT http://localhost:8000/api/income/update/<income-id>
Headers: Authorization: Bearer <your-token>
Body: {
  "amount": 5500
}
```
- [ ] Updates income record
- [ ] Returns updated document
- [ ] Validates at least one field
- [ ] Returns 404 if ID not found

---

### 9. Test DELETE /api/income/delete/:id
```bash
DELETE http://localhost:8000/api/income/delete/<income-id>
Headers: Authorization: Bearer <your-token>
```
- [ ] Deletes income record
- [ ] Returns success message
- [ ] Returns 404 if ID not found

---

### 10. Test GET /api/income/get/:id
```bash
GET http://localhost:8000/api/income/get/<income-id>
Headers: Authorization: Bearer <your-token>
```
- [ ] Returns single income record
- [ ] Returns 404 if ID not found

---

## ✅ Frontend Redux Testing

### 1. Test fetchIncome Thunk
```javascript
// In browser console or component
dispatch(fetchIncome({ page: 1, limit: 10 }));
```
- [ ] Sets loading to true
- [ ] Fetches data from API
- [ ] Updates state.income
- [ ] Updates state.pagination
- [ ] Sets loading to false
- [ ] Handles errors correctly

---

### 2. Test addIncome Thunk
```javascript
dispatch(addIncome({
  amount: 5000,
  category: 'Salary',
  description: 'Test',
  date: '2026-01-06'
}));
```
- [ ] Sets loading to true
- [ ] Sends POST request
- [ ] Auto-refreshes income list
- [ ] Maintains current filters
- [ ] Maintains current page
- [ ] Sets loading to false
- [ ] Handles errors correctly

---

### 3. Test updateIncome Thunk
```javascript
dispatch(updateIncome({
  id: '<income-id>',
  incomeData: { amount: 5500 }
}));
```
- [ ] Sets loading to true
- [ ] Sends PUT request
- [ ] Auto-refreshes income list
- [ ] Updates the modified item
- [ ] Sets loading to false
- [ ] Handles errors correctly

---

### 4. Test deleteIncome Thunk
```javascript
dispatch(deleteIncome('<income-id>'));
```
- [ ] Sets loading to true
- [ ] Sends DELETE request
- [ ] Auto-refreshes income list
- [ ] Removes deleted item
- [ ] Sets loading to false
- [ ] Handles errors correctly

---

### 5. Test fetchIncomeById Thunk
```javascript
dispatch(fetchIncomeById('<income-id>'));
```
- [ ] Sets loading to true
- [ ] Fetches single income
- [ ] Updates state.currentIncome
- [ ] Sets loading to false
- [ ] Handles errors correctly

---

### 6. Test setFilters Action
```javascript
dispatch(setFilters({ category: 'Salary' }));
```
- [ ] Updates state.filters.category
- [ ] Merges with existing filters
- [ ] Doesn't trigger API call

---

### 7. Test resetFilters Action
```javascript
dispatch(resetFilters());
```
- [ ] Clears all filter values
- [ ] Resets to empty strings
- [ ] Doesn't trigger API call

---

### 8. Test setCurrentPage Action
```javascript
dispatch(setCurrentPage(2));
```
- [ ] Updates state.pagination.currentPage
- [ ] Doesn't trigger API call

---

### 9. Test setLimit Action
```javascript
dispatch(setLimit(20));
```
- [ ] Updates state.pagination.limit
- [ ] Resets currentPage to 1
- [ ] Doesn't trigger API call

---

### 10. Test clearCurrentIncome Action
```javascript
dispatch(clearCurrentIncome());
```
- [ ] Sets state.currentIncome to null

---

### 11. Test clearError Action
```javascript
dispatch(clearError());
```
- [ ] Sets state.error to null

---

### 12. Test resetIncomeState Action
```javascript
dispatch(resetIncomeState());
```
- [ ] Resets entire state to initial values
- [ ] Clears income array
- [ ] Resets pagination
- [ ] Clears filters

---

## ✅ UI Component Testing

### 1. Test Basic Income List Display
- [ ] Shows loading spinner while fetching
- [ ] Displays income items correctly
- [ ] Shows amount, category, date, description
- [ ] Shows "No data" when empty
- [ ] Shows error message on error

---

### 2. Test Pagination UI
- [ ] Shows current page number
- [ ] Shows total pages
- [ ] Shows total items count
- [ ] "Previous" button disabled on page 1
- [ ] "Next" button disabled on last page
- [ ] Page changes update the list
- [ ] Items per page selector works

---

### 3. Test Filter UI
- [ ] Category input updates filter
- [ ] Min amount input updates filter
- [ ] Max amount input updates filter
- [ ] Start date input updates filter
- [ ] End date input updates filter
- [ ] "Apply Filters" button triggers fetch
- [ ] "Reset Filters" button clears all
- [ ] Filters persist during pagination

---

### 4. Test Add Income Form
- [ ] Form fields are editable
- [ ] Required validation works
- [ ] Submit button shows loading state
- [ ] Success message shows on add
- [ ] Error message shows on failure
- [ ] Form resets after success
- [ ] List refreshes after add

---

### 5. Test Update Income Form
- [ ] Loads existing income data
- [ ] Pre-fills form fields
- [ ] Submit button shows loading state
- [ ] Success message shows on update
- [ ] Error message shows on failure
- [ ] List refreshes after update

---

### 6. Test Delete Income
- [ ] Confirmation dialog appears
- [ ] Delete proceeds on confirm
- [ ] Delete cancels on cancel
- [ ] Success message shows on delete
- [ ] Error message shows on failure
- [ ] List refreshes after delete
- [ ] Item removed from list

---

## ✅ Integration Testing

### 1. Test Complete User Flow
1. [ ] User logs in
2. [ ] User navigates to income page
3. [ ] Income list loads with pagination
4. [ ] User applies category filter
5. [ ] Filtered results display
6. [ ] User navigates to page 2
7. [ ] Page 2 results display
8. [ ] User adds new income
9. [ ] List refreshes with new item
10. [ ] User edits an income
11. [ ] List refreshes with updated item
12. [ ] User deletes an income
13. [ ] List refreshes without deleted item
14. [ ] User resets filters
15. [ ] All income displays again

---

### 2. Test Filter Combinations
- [ ] Category + Amount Range
- [ ] Category + Date Range
- [ ] Amount Range + Date Range
- [ ] All filters combined
- [ ] Filters + Pagination

---

### 3. Test Edge Cases
- [ ] Empty database (no income)
- [ ] Single income item
- [ ] Exactly 10 items (one page)
- [ ] 11 items (two pages)
- [ ] Very large amounts
- [ ] Very old dates
- [ ] Special characters in description
- [ ] Long category names

---

### 4. Test Error Scenarios
- [ ] Network error during fetch
- [ ] Network error during add
- [ ] Network error during update
- [ ] Network error during delete
- [ ] Invalid date format
- [ ] Negative amount
- [ ] Missing required fields
- [ ] Invalid income ID

---

### 5. Test Performance
- [ ] Large dataset (100+ items)
- [ ] Rapid filter changes
- [ ] Rapid page changes
- [ ] Multiple simultaneous requests
- [ ] Memory leaks check

---

## ✅ Browser Testing

### Test in Multiple Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Test Responsive Design
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 📝 Test Results

### Date Tested: _______________
### Tested By: _______________

### Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
_____________________________________________________
_____________________________________________________
_____________________________________________________

---

## 🎯 Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ No network errors
- ✅ Correct data display
- ✅ Smooth user experience
- ✅ Proper loading states
- ✅ Clear error messages
- ✅ Fast response times (<2s)

---

## 🔧 Debugging Tips

### If filters don't work:
1. Check Redux DevTools for state changes
2. Verify query params in Network tab
3. Check backend console for filter object
4. Verify MongoDB query syntax

### If pagination doesn't work:
1. Check pagination state in Redux
2. Verify skip/limit calculations
3. Check total count from database
4. Verify hasMore flag logic

### If auto-refresh doesn't work:
1. Check thunk implementation
2. Verify dispatch calls after mutations
3. Check for errors in console
4. Verify current filters/page state

---

## 📞 Support

If you encounter issues:
1. Check `INCOME_SLICE_GUIDE.md` for API reference
2. Review `incomeSlice.usage.examples.js` for examples
3. Check `ARCHITECTURE_DIAGRAM.txt` for data flow
4. Review browser console for errors
5. Check backend logs for server errors
