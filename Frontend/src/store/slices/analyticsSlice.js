import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import * as AnalyticsService from "../../services/analyticsServices";

const initialState = {
    summary: {},
    barMonthlyComparison: {},
    categoryDistribution: {},
    trend: {},
    lineMonthlyComparison: {},
    recentTransaction: [],
    loading: false,
    error: null
}


export const fetchSummary = createAsyncThunk(
    "analytics/fetchSummary",
    async (__, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getSummary();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchMonthlyComparison = createAsyncThunk(
    "analytics/fetchMonthlyComparison",
    async (__, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getMonthlyComparison();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchCategoryDistribution = createAsyncThunk(
    "analytics/fetchCategoryDistribution",
    async (__, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getCategoryDistribution();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchTrend = createAsyncThunk(
    "analytics/fetchTrend",
    async (__, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getTrend();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchRecentTransaction = createAsyncThunk(
    "analytics/fetchRecentTransaction",
    async (__, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getRecentTransaction();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchLineMonthlyComparison = createAsyncThunk(
    "analytics/fetchLineMonthlyComparison",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await AnalyticsService.getLineMonthlyComparison(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.summary = action.payload || {};
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        //bar chart monthly comparison
        builder
            .addCase(fetchMonthlyComparison.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonthlyComparison.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.barMonthlyComparison = action.payload || {};
            })
            .addCase(fetchMonthlyComparison.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        //category distribution
        builder
            .addCase(fetchCategoryDistribution.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryDistribution.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.categoryDistribution = action.payload || {};
            })
            .addCase(fetchCategoryDistribution.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        //trend
        builder
            .addCase(fetchTrend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrend.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.trend = action.payload || {};
            })
            .addCase(fetchTrend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        //line chart monthly comparison
        builder
            .addCase(fetchLineMonthlyComparison.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLineMonthlyComparison.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.lineMonthlyComparison = action.payload || {};
            })
            .addCase(fetchLineMonthlyComparison.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(fetchRecentTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.recentTransaction = action.payload || [];
            })
            .addCase(fetchRecentTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
