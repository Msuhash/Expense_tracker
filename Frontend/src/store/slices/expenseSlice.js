import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ExpenseService from "../../services/expenseService";

// Initial state
const initialState = {
    expenses: [],
    graphExpenses: [],
    loadingGraph: false,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10,
        hasMore: false
    },
    filters: {
        search: "",
        category: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: ""
    }
};

// Async Thunks for API calls

/**
 * Fetch expense records with filters and pagination
 */
export const fetchExpenses = createAsyncThunk(
    "expense/fetchExpenses",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await ExpenseService.getExpenses(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Add a new expense record
 */
export const addExpense = createAsyncThunk(
    "expense/addExpense",
    async (expenseData, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await ExpenseService.addExpense(expenseData);

            // Refresh the expense list after adding
            const { filters, pagination } = getState().expense;
            await dispatch(fetchExpenses({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphExpenses());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Update an expense record
 */
export const updateExpense = createAsyncThunk(
    "expense/updateExpense",
    async ({ id, expenseData }, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await ExpenseService.updateExpense(id, expenseData);

            // Refresh the expense list after updating
            const { filters, pagination } = getState().expense;
            await dispatch(fetchExpenses({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphExpenses());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Delete an expense record
 */
export const deleteExpense = createAsyncThunk(
    "expense/deleteExpense",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await ExpenseService.deleteExpense(id);

            // Refresh the expense list after deleting
            const { filters, pagination } = getState().expense;
            await dispatch(fetchExpenses({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphExpenses());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Fetch a single expense record by ID
 */
export const fetchExpenseById = createAsyncThunk(
    "expense/fetchExpenseById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await ExpenseService.getExpenseById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Fetch expense records for graph (all data/analytics)
 */
export const fetchGraphExpenses = createAsyncThunk(
    "expense/fetchGraphExpenses",
    async (_, { rejectWithValue }) => {
        try {
            // Fetch with high limit to get sufficient data for analytics
            const response = await ExpenseService.getExpenses({ limit: 2000 });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Expense Slice
const expenseSlice = createSlice({
    name: "expense",
    initialState,
    reducers: {
        // Set filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        // Reset filters
        resetFilters: (state) => {
            state.filters = {
                search: "",
                category: "",
                minAmount: "",
                maxAmount: "",
                startDate: "",
                endDate: ""
            };
        },

        // Set current page
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },

        // Set items per page limit
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.currentPage = 1; // Reset to first page when limit changes
        },

        // Clear current expense
        clearCurrentExpense: (state) => {
            state.currentExpense = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset state
        resetExpenseState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        // Fetch Expenses
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.expenses = action.payload.data || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Expense
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Expense
            .addCase(updateExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Expense
            .addCase(deleteExpense.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Expense by ID
            .addCase(fetchExpenseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExpense = action.payload.data || null;
            })
            .addCase(fetchExpenseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Graph Expenses
            .addCase(fetchGraphExpenses.pending, (state) => {
                state.loadingGraph = true;
                state.error = null;
            })
            .addCase(fetchGraphExpenses.fulfilled, (state, action) => {
                state.loadingGraph = false;
                state.graphExpenses = action.payload.data || [];
            })
            .addCase(fetchGraphExpenses.rejected, (state, action) => {
                state.loadingGraph = false;
                state.error = action.payload;
            });
    }
});

export const {
    setFilters,
    resetFilters,
    setCurrentPage,
    setLimit,
    clearCurrentExpense,
    clearError,
    resetExpenseState
} = expenseSlice.actions;

export default expenseSlice.reducer;
