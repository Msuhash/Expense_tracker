import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/expense" || "http://localhost:8000/api/expense";

// configure axios instance with defaults
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

/**
 * Add a new expense record
 * @param {Object} expense - Expense data (amount, category, description, date)
 * @returns {Promise} Response data
 */
export const addExpense = async (expense) => {
    const response = await api.post("/add", expense);
    return response.data;
};

/**
 * Get expense records with optional filters and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search text (searches in description and category)
 * @param {string} params.category - Filter by category
 * @param {number} params.minAmount - Minimum amount filter
 * @param {number} params.maxAmount - Maximum amount filter
 * @param {string} params.startDate - Start date filter (ISO format)
 * @param {string} params.endDate - End date filter (ISO format)
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 10)
 * @returns {Promise} Response data with expense array and pagination metadata
 */
export const getExpenses = async (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add filters if provided
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.minAmount !== undefined) queryParams.append('minAmount', params.minAmount);
    if (params.maxAmount !== undefined) queryParams.append('maxAmount', params.maxAmount);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    // Add pagination parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/get${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
};

/**
 * Delete an expense record by ID
 * @param {string} id - Expense record ID
 * @returns {Promise} Response data
 */
export const deleteExpense = async (id) => {
    const response = await api.delete(`/delete/${id}`);
    return response.data;
};

/**
 * Update an expense record by ID
 * @param {string} id - Expense record ID
 * @param {Object} expense - Updated expense data
 * @returns {Promise} Response data
 */
export const updateExpense = async (id, expense) => {
    const response = await api.put(`/update/${id}`, expense);
    return response.data;
};

/**
 * Get a single expense record by ID
 * @param {string} id - Expense record ID
 * @returns {Promise} Response data
 */
export const getExpenseById = async (id) => {
    const response = await api.get(`/get/${id}`);
    return response.data;
};