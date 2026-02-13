import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as categoryServices from "../../services/categoryServices";

// Initial State
const initialState = {
    categories: [],
    incomeCategories: [],
    expenseCategories: [],
    deleteConflict: null,
    category: null,
    loading: false,
    error: null
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoryServices.getAllCategories();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const addCategory = createAsyncThunk(
    "category/addCategory",
    async (category, { rejectWithValue, dispatch }) => {
        try {
            const response = await categoryServices.addCategory(category);
            await dispatch(fetchCategories());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await categoryServices.deleteCategory(id);
            await dispatch(fetchCategories());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const mergeCategory = createAsyncThunk(
    "category/mergeCategory",
    async ({ id, targetCategoryId }, { rejectWithValue, dispatch }) => {
        try {
            const response = await categoryServices.mergeCategory(id, targetCategoryId);
            await dispatch(fetchCategories());
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

export const getCategoryById = createAsyncThunk(
    "category/getCategoryById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryServices.getCategoryById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)

// category slice
const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        clearDeleteConflict: (state) => {
            state.deleteConflict = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Fetched categories payload:", action.payload);
                const categories = Array.isArray(action.payload) ? action.payload : [];

                const incomeCategories = categories.filter(category => category.type === "income");
                const expenseCategories = categories.filter(category => category.type === "expense");

                state.incomeCategories = incomeCategories;
                state.expenseCategories = expenseCategories;
                state.categories = categories;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch categories";
            });

        builder
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                // state.categories.push(action.payload); // category will be refreshed by thunk
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add category";
            });

        builder
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                // state.categories = state.categories.filter((category) => category._id !== action.payload); // category will be refreshed by thunk
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;

                if (action.payload?.expense != undefined) {
                    state.deleteConflict = action.payload
                } else {
                    state.error = action.payload || "Failed to delete category";
                }
            });

        builder
            .addCase(getCategoryById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCategoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload || null;
            })
            .addCase(getCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to get category";
            });

        builder
            .addCase(mergeCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(mergeCategory.fulfilled, (state, action) => {
                state.loading = false;
                // category will be refreshed by thunk
            })
            .addCase(mergeCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to merge category";
            });
    }

});

// export category actions
export const { clearDeleteConflict } = categorySlice.actions;

// export category reducer
export default categorySlice.reducer;
