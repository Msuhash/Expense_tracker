import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as BudgetService from "../../services/budgetServices";

const initialState = {
    budget: [],
    summary: {},
    loading: false,
    error: null
}

export const fetchBudget = createAsyncThunk(
    "budget/fetchBudget",
    async (__, { rejectWithValue }) => {
        try {
            const response = await BudgetService.getBudget();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const fetchSummary = createAsyncThunk(
    "budget/fetchSummary",
    async (_, { rejectWithValue }) => {
        try {
            const response = await BudgetService.getSummary();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const addBudget = createAsyncThunk(
    "budget/addBudget",
    async (budgetData, { rejectWithValue, dispatch }) => {
        try {
            const response = await BudgetService.addBudget(budgetData);
            await dispatch(fetchBudget());
            await dispatch(fetchSummary());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const deleteBudget = createAsyncThunk(
    "budget/deleteBudget",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await BudgetService.deleteBudget(id);
            await dispatch(fetchBudget());
            await dispatch(fetchSummary());
            return response

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)

        }
    }
)

export const updateBudget = createAsyncThunk(
    "budget/updateBudget",
    async ({ id, budgetData }, { rejectWithValue, dispatch }) => {
        try {
            const response = await BudgetService.updateBudget(id, budgetData);
            await dispatch(fetchBudget());
            await dispatch(fetchSummary());
            return response;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

// export const updateAmount = createAsyncThunk(
//     "budget/updateAmount",
//     async ({id, amount}, {rejectWithValue, dispatch}) => {
//         try{
//             const response = await BudgetService.updateAmount(id, amount);
//             await dispatch(fetchBudget());
//             await dispatch(fetchSummary());
//             return response;
//         }catch(error){
//             return rejectWithValue(error.response?.data?.message || error.message)
//         }
//     }
// )

const budgetSlice = createSlice({
    name: "budget",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.budget = action.payload || []
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch budget"
            })

        builder
            .addCase(fetchSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.summary = action.payload || {}
            })
            .addCase(fetchSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch summary"
            })

        builder
            .addCase(addBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBudget.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add budget"
            })

        builder
            .addCase(deleteBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBudget.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete budget"
            })

        builder
            .addCase(updateBudget.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBudget.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update budget"
            })

        // builder
        //     .addCase(updateAmount.pending, (state) => {
        //         state.loading = true;
        //         state.error = null;
        //     })
        //     .addCase(updateAmount.fulfilled, (state) => {
        //         state.loading = false;
        //         state.error = null;
        //     })
        //     .addCase(updateAmount.rejected, (state, action) => {
        //         state.loading = false;
        //         state.error = action.payload || "Failed to update amount"
        //     })
    }
})

export default budgetSlice.reducer;