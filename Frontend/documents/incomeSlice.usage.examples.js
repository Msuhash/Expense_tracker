/**
 * INCOME SLICE USAGE GUIDE
 * 
 * This file demonstrates how to use the income slice in your React components.
 * The slice provides comprehensive state management for income records with:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Filtering by category, amount range, and date range
 * - Pagination with 10 items per page
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchIncome,
    addIncome,
    updateIncome,
    deleteIncome,
    fetchIncomeById,
    setFilters,
    resetFilters,
    setCurrentPage,
    setLimit,
    clearCurrentIncome,
    clearError
} from '../store/slices/incomeSlice';

// ============================================
// EXAMPLE 1: Basic Usage - Fetch All Income
// ============================================
function BasicIncomeList() {
    const dispatch = useDispatch();
    const { income, loading, error, pagination } = useSelector(state => state.income);

    useEffect(() => {
        // Fetch income with default pagination (page 1, limit 10)
        dispatch(fetchIncome());
    }, [dispatch]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Income List</h2>
            {income.map(item => (
                <div key={item._id}>
                    <p>{item.category}: ${item.amount}</p>
                    <p>{new Date(item.date).toLocaleDateString()}</p>
                </div>
            ))}
            <p>Page {pagination.currentPage} of {pagination.totalPages}</p>
            <p>Total: {pagination.total} items</p>
        </div>
    );
}

// ============================================
// EXAMPLE 2: Pagination
// ============================================
function PaginatedIncomeList() {
    const dispatch = useDispatch();
    const { income, pagination, filters } = useSelector(state => state.income);

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchIncome({
            ...filters,
            page: newPage,
            limit: pagination.limit
        }));
    };

    const handleLimitChange = (newLimit) => {
        dispatch(setLimit(newLimit));
        dispatch(fetchIncome({
            ...filters,
            page: 1,
            limit: newLimit
        }));
    };

    return (
        <div>
            {/* Income list */}
            {income.map(item => (
                <div key={item._id}>{item.category}: ${item.amount}</div>
            ))}

            {/* Pagination controls */}
            <div>
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                >
                    Next
                </button>
            </div>

            {/* Items per page selector */}
            <select value={pagination.limit} onChange={(e) => handleLimitChange(Number(e.target.value))}>
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
            </select>
        </div>
    );
}

// ============================================
// EXAMPLE 3: Filtering
// ============================================
function FilteredIncomeList() {
    const dispatch = useDispatch();
    const { income, filters, pagination } = useSelector(state => state.income);

    const handleFilterChange = (filterName, value) => {
        // Update filters in state
        dispatch(setFilters({ [filterName]: value }));
    };

    const applyFilters = () => {
        // Reset to page 1 and fetch with filters
        dispatch(setCurrentPage(1));
        dispatch(fetchIncome({
            ...filters,
            page: 1,
            limit: pagination.limit
        }));
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
        dispatch(setCurrentPage(1));
        dispatch(fetchIncome({ page: 1, limit: pagination.limit }));
    };

    return (
        <div>
            {/* Filter Controls */}
            <div>
                <h3>Filters</h3>

                {/* Category Filter */}
                <input
                    type="text"
                    placeholder="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                />

                {/* Amount Range Filter */}
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                />

                {/* Date Range Filter */}
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />

                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={handleResetFilters}>Reset Filters</button>
            </div>

            {/* Income List */}
            <div>
                {income.map(item => (
                    <div key={item._id}>
                        <p>{item.category}: ${item.amount}</p>
                        <p>{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// EXAMPLE 4: Add Income
// ============================================
function AddIncomeForm() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.income);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const incomeData = {
            amount: e.target.amount.value,
            category: e.target.category.value,
            description: e.target.description.value,
            date: e.target.date.value
        };

        try {
            await dispatch(addIncome(incomeData)).unwrap();
            alert('Income added successfully!');
            e.target.reset();
        } catch (err) {
            console.error('Failed to add income:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="amount" type="number" placeholder="Amount" required />
            <input name="category" type="text" placeholder="Category" required />
            <input name="description" type="text" placeholder="Description" />
            <input name="date" type="date" required />
            <button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Income'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

// ============================================
// EXAMPLE 5: Update Income
// ============================================
function UpdateIncomeForm({ incomeId }) {
    const dispatch = useDispatch();
    const { currentIncome, loading } = useSelector(state => state.income);

    useEffect(() => {
        // Fetch income details
        dispatch(fetchIncomeById(incomeId));

        // Cleanup
        return () => {
            dispatch(clearCurrentIncome());
        };
    }, [dispatch, incomeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            amount: e.target.amount.value,
            category: e.target.category.value,
            description: e.target.description.value,
            date: e.target.date.value
        };

        try {
            await dispatch(updateIncome({ id: incomeId, incomeData: updatedData })).unwrap();
            alert('Income updated successfully!');
        } catch (err) {
            console.error('Failed to update income:', err);
        }
    };

    if (!currentIncome) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="amount"
                type="number"
                defaultValue={currentIncome.amount}
                required
            />
            <input
                name="category"
                type="text"
                defaultValue={currentIncome.category}
                required
            />
            <input
                name="description"
                type="text"
                defaultValue={currentIncome.description}
            />
            <input
                name="date"
                type="date"
                defaultValue={currentIncome.date?.split('T')[0]}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Income'}
            </button>
        </form>
    );
}

// ============================================
// EXAMPLE 6: Delete Income
// ============================================
function IncomeItemWithDelete({ income }) {
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this income?')) {
            try {
                await dispatch(deleteIncome(income._id)).unwrap();
                alert('Income deleted successfully!');
            } catch (err) {
                console.error('Failed to delete income:', err);
            }
        }
    };

    return (
        <div>
            <p>{income.category}: ${income.amount}</p>
            <p>{new Date(income.date).toLocaleDateString()}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

// ============================================
// EXAMPLE 7: Complete Component with All Features
// ============================================
function CompleteIncomeManager() {
    const dispatch = useDispatch();
    const { income, loading, error, pagination, filters } = useSelector(state => state.income);

    useEffect(() => {
        // Initial fetch
        dispatch(fetchIncome({ page: 1, limit: 10 }));
    }, [dispatch]);

    const handleFilterChange = (filterName, value) => {
        dispatch(setFilters({ [filterName]: value }));
    };

    const applyFilters = () => {
        dispatch(setCurrentPage(1));
        dispatch(fetchIncome({
            ...filters,
            page: 1,
            limit: pagination.limit
        }));
    };

    const handlePageChange = (newPage) => {
        dispatch(setCurrentPage(newPage));
        dispatch(fetchIncome({
            ...filters,
            page: newPage,
            limit: pagination.limit
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this income?')) {
            try {
                await dispatch(deleteIncome(id)).unwrap();
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    };

    return (
        <div>
            <h1>Income Manager</h1>

            {/* Filters */}
            <div className="filters">
                <input
                    placeholder="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={filters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={filters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                />
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
                <button onClick={applyFilters}>Apply</button>
                <button onClick={() => {
                    dispatch(resetFilters());
                    dispatch(fetchIncome({ page: 1, limit: 10 }));
                }}>Reset</button>
            </div>

            {/* Loading/Error States */}
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* Income List */}
            <div className="income-list">
                {income.map(item => (
                    <div key={item._id} className="income-item">
                        <h3>{item.category}</h3>
                        <p>Amount: ${item.amount}</p>
                        <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                        <p>Description: {item.description}</p>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.currentPage} of {pagination.totalPages}
                    ({pagination.total} total items)
                </span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export {
    BasicIncomeList,
    PaginatedIncomeList,
    FilteredIncomeList,
    AddIncomeForm,
    UpdateIncomeForm,
    IncomeItemWithDelete,
    CompleteIncomeManager
};
