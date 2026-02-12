import axios from "axios";
import { API_BASE_URL } from "./api";

const categoryServices = axios.create({
    baseURL: API_BASE_URL + "/api/category",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Get all categories
 * @returns {Promise} Response data with category array
 */
export const getAllCategories = async () => {
    const response = await categoryServices.get("/get");
    return response.data;
};

/**
 * Add a new category
 * @param {Object} category - Category data (name)
 * @returns {Promise} Response data
 */
export const addCategory = async (category) => {
    const response = await categoryServices.post("/add", category);
    return response.data;
};

/**
 * Delete a category by ID
 * @param {string} id - Category ID
 * @returns {Promise} Response data
 */
export const deleteCategory = async (id) => {
    const response = await categoryServices.delete(`/delete/${id}`);
    return response.data;
};

/**
 * Merge a category by ID - moves all records to target category and deletes source
 * @param {string} id - Source category ID to be deleted
 * @param {string} targetCategoryId - Target category ID to move records to
 * @returns {Promise} Response data
 */
export const mergeCategory = async (id, targetCategoryId) => {
    const response = await categoryServices.put(`/merge/${id}`, { targetCategoryId });
    return response.data;
};

/**
 * Get a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise} Response data
 */
export const getCategoryById = async (id) => {
    const response = await categoryServices.get(`/get/${id}`);
    return response.data;
};



export default categoryServices;