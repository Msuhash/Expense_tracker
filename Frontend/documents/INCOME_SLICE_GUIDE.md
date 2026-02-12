# Income Slice - Quick Reference Guide

## 📋 Overview
The income slice provides complete state management for income records with CRUD operations, filtering, and pagination.

## 🎯 Features
- ✅ Create, Read, Update, Delete income records
- ✅ Filter by category, amount range, and date range
- ✅ Pagination with 10 items per page (configurable)
- ✅ Automatic list refresh after mutations
- ✅ Loading and error state management

---

## 🚀 Quick Start

### 1. Import in your component
```javascript
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchIncome,
    addIncome,
    updateIncome,
    deleteIncome,
    setFilters,
    setCurrentPage
} from '../store/slices/incomeSlice';
```

### 2. Access state
```javascript
const { income, loading, error, pagination, filters } = useSelector(state => state.income);
const dispatch = useDispatch();
```

---

## 📚 Available Actions

### Async Thunks (API Calls)

#### `fetchIncome(params)`
Fetch income records with optional filters and pagination.

**Parameters:**
```javascript
{
    category: string,      // Filter by category
    minAmount: number,     // Minimum amount
    maxAmount: number,     // Maximum amount
    startDate: string,     // ISO date string
    endDate: string,       // ISO date string
    page: number,          // Page number (default: 1)
    limit: number          // Items per page (default: 10)
}
```

**Example:**
```javascript
// Fetch all income (page 1, 10 items)
dispatch(fetchIncome());

// Fetch with filters
dispatch(fetchIncome({
    category: 'Salary',
    minAmount: 1000,
    maxAmount: 5000,
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    page: 1,
    limit: 10
}));
```

---

#### `addIncome(incomeData)`
Add a new income record.

**Parameters:**
```javascript
{
    amount: number,        // Required
    category: string,      // Required
    description: string,   // Optional
    date: string          // Required (ISO date)
}
```

**Example:**
```javascript
dispatch(addIncome({
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2026-01-06'
}));
```

---

#### `updateIncome({ id, incomeData })`
Update an existing income record.

**Parameters:**
```javascript
{
    id: string,           // Income ID
    incomeData: {
        amount: number,
        category: string,
        description: string,
        date: string
    }
}
```

**Example:**
```javascript
dispatch(updateIncome({
    id: '507f1f77bcf86cd799439011',
    incomeData: {
        amount: 5500,
        category: 'Salary',
        description: 'Updated salary',
        date: '2026-01-06'
    }
}));
```

---

#### `deleteIncome(id)`
Delete an income record.

**Parameters:**
```javascript
id: string  // Income ID
```

**Example:**
```javascript
dispatch(deleteIncome('507f1f77bcf86cd799439011'));
```

---

#### `fetchIncomeById(id)`
Fetch a single income record by ID.

**Parameters:**
```javascript
id: string  // Income ID
```

**Example:**
```javascript
dispatch(fetchIncomeById('507f1f77bcf86cd799439011'));
// Result will be in state.income.currentIncome
```

---

### Synchronous Actions

#### `setFilters(filters)`
Update filter values.

**Example:**
```javascript
dispatch(setFilters({ category: 'Salary' }));
dispatch(setFilters({ minAmount: 1000, maxAmount: 5000 }));
```

---

#### `resetFilters()`
Clear all filters.

**Example:**
```javascript
dispatch(resetFilters());
```

---

#### `setCurrentPage(page)`
Change the current page.

**Example:**
```javascript
dispatch(setCurrentPage(2));
```

---

#### `setLimit(limit)`
Change items per page (resets to page 1).

**Example:**
```javascript
dispatch(setLimit(20));
```

---

#### `clearCurrentIncome()`
Clear the currently selected income.

**Example:**
```javascript
dispatch(clearCurrentIncome());
```

---

#### `clearError()`
Clear error state.

**Example:**
```javascript
dispatch(clearError());
```

---

#### `resetIncomeState()`
Reset entire state to initial values.

**Example:**
```javascript
dispatch(resetIncomeState());
```

---

## 📊 State Structure

```javascript
{
    income: [],              // Array of income records
    currentIncome: null,     // Single income record (from fetchIncomeById)
    loading: false,          // Loading state
    error: null,             // Error message
    pagination: {
        total: 0,            // Total number of records
        totalPages: 0,       // Total number of pages
        currentPage: 1,      // Current page number
        limit: 10,           // Items per page
        hasMore: false       // Whether there are more pages
    },
    filters: {
        category: "",        // Category filter
        minAmount: "",       // Minimum amount filter
        maxAmount: "",       // Maximum amount filter
        startDate: "",       // Start date filter
        endDate: ""          // End date filter
    }
}
```

---

## 💡 Common Patterns

### Pattern 1: Initial Load
```javascript
useEffect(() => {
    dispatch(fetchIncome({ page: 1, limit: 10 }));
}, [dispatch]);
```

### Pattern 2: Apply Filters
```javascript
const applyFilters = () => {
    dispatch(setCurrentPage(1));
    dispatch(fetchIncome({ 
        ...filters, 
        page: 1, 
        limit: pagination.limit 
    }));
};
```

### Pattern 3: Change Page
```javascript
const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    dispatch(fetchIncome({ 
        ...filters, 
        page: newPage, 
        limit: pagination.limit 
    }));
};
```

### Pattern 4: Add with Refresh
```javascript
const handleAdd = async (data) => {
    try {
        await dispatch(addIncome(data)).unwrap();
        // List automatically refreshes
        alert('Success!');
    } catch (err) {
        alert('Error: ' + err);
    }
};
```

### Pattern 5: Delete with Confirmation
```javascript
const handleDelete = async (id) => {
    if (window.confirm('Delete this income?')) {
        try {
            await dispatch(deleteIncome(id)).unwrap();
            // List automatically refreshes
        } catch (err) {
            console.error(err);
        }
    }
};
```

---

## 🔧 Backend API Endpoints

The slice expects these endpoints to be available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/income/get` | Get income with filters & pagination |
| POST | `/api/income/add` | Add new income |
| PUT | `/api/income/update/:id` | Update income |
| DELETE | `/api/income/delete/:id` | Delete income |
| GET | `/api/income/get/:id` | Get single income |

### Query Parameters for GET `/api/income/get`
- `category` - Filter by category
- `minAmount` - Minimum amount
- `maxAmount` - Maximum amount
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Response Format for GET `/api/income/get`
```javascript
{
    data: [...],           // Array of income records
    pagination: {
        total: 100,        // Total records
        totalPages: 10,    // Total pages
        currentPage: 1,    // Current page
        limit: 10,         // Items per page
        hasMore: true      // Has more pages
    }
}
```

---

## ⚠️ Important Notes

1. **Authentication**: All API calls require authentication token (handled by axios interceptor)
2. **Auto-refresh**: After add/update/delete, the list automatically refreshes with current filters
3. **Error Handling**: Always use try-catch with `.unwrap()` for async thunks
4. **Date Format**: Use ISO date strings (YYYY-MM-DD) for date filters
5. **Pagination Reset**: Changing limit resets to page 1 automatically

---

## 🎨 UI Integration Tips

### Loading State
```javascript
{loading && <Spinner />}
```

### Error Display
```javascript
{error && <Alert type="error">{error}</Alert>}
```

### Empty State
```javascript
{!loading && income.length === 0 && <EmptyState />}
```

### Pagination Controls
```javascript
<button 
    disabled={pagination.currentPage === 1}
    onClick={() => handlePageChange(pagination.currentPage - 1)}
>
    Previous
</button>
<span>Page {pagination.currentPage} of {pagination.totalPages}</span>
<button 
    disabled={!pagination.hasMore}
    onClick={() => handlePageChange(pagination.currentPage + 1)}
>
    Next
</button>
```

---

## 📝 TypeScript Support (Optional)

If using TypeScript, define these types:

```typescript
interface Income {
    _id: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
    userId: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

interface IncomeFilters {
    category: string;
    minAmount: string;
    maxAmount: string;
    startDate: string;
    endDate: string;
}

interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
}
```

---

## 🐛 Troubleshooting

### Issue: Filters not working
**Solution**: Make sure to call `fetchIncome()` after setting filters

### Issue: List not refreshing after add/update/delete
**Solution**: The thunks automatically refresh. Check for errors in console.

### Issue: Pagination showing wrong page
**Solution**: Use `setCurrentPage()` before `fetchIncome()`

### Issue: 401 Unauthorized
**Solution**: Ensure authentication token is set in axios headers

---

## 📞 Support

For issues or questions, refer to:
- `incomeSlice.usage.examples.js` - Detailed examples
- Backend controller: `Backend/controllers/incomeController.js`
- Service layer: `Frontend/src/services/IncomeService.js`
