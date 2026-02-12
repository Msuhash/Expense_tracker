import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as IncomeService from "../../services/incomeService";

// Initial state
const initialState = {
    income: [],
    graphIncome: [],
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
 * Fetch income records with filters and pagination
 */
export const fetchIncome = createAsyncThunk(
    "income/fetchIncome",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await IncomeService.getIncome(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Add a new income record
 */
export const addIncome = createAsyncThunk(
    "income/addIncome",
    async (incomeData, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await IncomeService.addIncome(incomeData);

            // Refresh the income list after adding
            const { filters, pagination } = getState().income;
            await dispatch(fetchIncome({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphIncome());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Update an income record
 */
export const updateIncome = createAsyncThunk(
    "income/updateIncome",
    async ({ id, incomeData }, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await IncomeService.updateIncome(id, incomeData);

            // Refresh the income list after updating
            const { filters, pagination } = getState().income;
            await dispatch(fetchIncome({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphIncome());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Delete an income record
 */
export const deleteIncome = createAsyncThunk(
    "income/deleteIncome",
    async (id, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await IncomeService.deleteIncome(id);

            // Refresh the income list after deleting
            const { filters, pagination } = getState().income;
            await dispatch(fetchIncome({
                ...filters,
                page: pagination.currentPage,
                limit: pagination.limit
            }));
            await dispatch(fetchGraphIncome());

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Fetch a single income record by ID
 */
export const fetchIncomeById = createAsyncThunk(
    "income/fetchIncomeById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await IncomeService.getIncomeById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

/**
 * Fetch income records for graph (all data/analytics)
 */
export const fetchGraphIncome = createAsyncThunk(
    "income/fetchGraphIncome",
    async (_, { rejectWithValue }) => {
        try {
            // Fetch with high limit to get sufficient data for analytics
            const response = await IncomeService.getIncome({ limit: 2000 });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Income Slice
const incomeSlice = createSlice({
    name: "income",
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

        // Clear current income
        clearCurrentIncome: (state) => {
            state.currentIncome = null;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Reset state
        resetIncomeState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        // Fetch Income
        builder
            .addCase(fetchIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncome.fulfilled, (state, action) => {
                state.loading = false;
                state.income = action.payload.data || [];
                state.pagination = action.payload.pagination || initialState.pagination;
            })
            .addCase(fetchIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch income";
            });

        // Add Income
        builder
            .addCase(addIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIncome.fulfilled, (state) => {
                state.loading = false;
                // Income list is refreshed by the thunk
            })
            .addCase(addIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add income";
            });

        // Update Income
        builder
            .addCase(updateIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIncome.fulfilled, (state) => {
                state.loading = false;
                // Income list is refreshed by the thunk
            })
            .addCase(updateIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update income";
            });

        // Delete Income
        builder
            .addCase(deleteIncome.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteIncome.fulfilled, (state) => {
                state.loading = false;
                // Income list is refreshed by the thunk
            })
            .addCase(deleteIncome.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete income";
            });

        // Fetch Income By ID
        builder
            .addCase(fetchIncomeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomeById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentIncome = action.payload;
            })
            .addCase(fetchIncomeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch income details";
            });

        // Fetch Graph Income
        builder
            .addCase(fetchGraphIncome.pending, (state) => {
                state.loadingGraph = true;
            })
            .addCase(fetchGraphIncome.fulfilled, (state, action) => {
                state.loadingGraph = false;
                state.graphIncome = action.payload.data || [];
            })
            .addCase(fetchGraphIncome.rejected, (state, action) => {
                state.loadingGraph = false;
                // We don't block the main UI error for graph failures, or we could add a specific graphError
                console.error("Graph fetch failed:", action.payload);
            });
    }
});

// Export actions
export const {
    setFilters,
    resetFilters,
    setCurrentPage,
    setLimit,
    clearCurrentIncome,
    clearError,
    resetIncomeState
} = incomeSlice.actions;

// Export reducer
export default incomeSlice.reducer;
