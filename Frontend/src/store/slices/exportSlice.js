import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import * as exportServices from "../../services/exportServices";

const initialState = {
    loading: false,
    error: null
}

export const exportData = createAsyncThunk(
    "export/exportData",
    async ({types,format}, {rejectWithValue}) => {
        try{
            const response = await exportServices.exportData(types,format)
            return true
        }catch(error){
            return rejectWithValue(error.response?.data?.message || "Failed to export data")
        }
    }
)

const exportSlice = createSlice({
    name: "export",
    initialState: {
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(exportData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(exportData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(exportData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = exportSlice.actions;
export default exportSlice.reducer;