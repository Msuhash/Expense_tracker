import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './slices/uiSlice.js';
import authSlice from './slices/authSlice.js';
import incomeSlice from './slices/incomeSlice.js';
import categorySlice from './slices/categorySlice.js';
import expenseSlice from './slices/expenseSlice.js';
import analyticsSlice from './slices/analyticsSlice.js';
import budgetSlice from './slices/budgetSlice.js';
import exportSlice from './slices/exportSlice.js';

const Store = configureStore({
    reducer: {
        ui: uiSlice,
        auth: authSlice,
        income: incomeSlice,
        category: categorySlice,
        expense: expenseSlice,
        analytics: analyticsSlice,
        budget: budgetSlice,
        export: exportSlice
    }
})

export default Store;