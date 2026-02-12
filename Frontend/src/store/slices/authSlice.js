import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as userService from "../../services/userService"

const initialState = {
    user: null,
    loading: true,
    error: null
}

export const fetchUserData = createAsyncThunk(
    "auth/fetchUserData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getUserData();
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updateUsername = createAsyncThunk(
    "auth/updateUsername",
    async (username, { rejectWithValue, dispatch }) => {
        try {
            const response = await userService.updateUsername(username);
            dispatch(fetchUserData());
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const updatePassword = createAsyncThunk(
    "auth/updatePassword",
    async (passwords, { rejectWithValue, dispatch }) => {
        try {
            const response = await userService.updatePassword(passwords);
            dispatch(logout());
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await userService.logout();
            dispatch(logout());
            return response;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducer: {
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

        builder
            .addCase(updateUsername.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUsername.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUsername.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

        builder
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null; // Ensure user is logged out even if API fails
                state.error = action.payload.message;
            })
    }

})

export const { logout } = authSlice.actions;
export default authSlice.reducer;