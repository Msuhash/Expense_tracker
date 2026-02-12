import axios from "axios";
import { API_BASE_URL } from "./api";

const API_URL = API_BASE_URL + "/api/analytics";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});


export const getSummary = async () => {
    const response = await api.get("/summary")
    return response.data
}

export const getMonthlyComparison = async () => {
    const response = await api.get("/bar-monthly-comparison");
    return response.data
}

export const getCategoryDistribution = async () => {
    const response = await api.get("/category-distribution");
    return response.data
}

export const getTrend = async () => {
    const response = await api.get("/trend");
    return response.data
}

export const getLineMonthlyComparison = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.month1) queryParams.append("month1", params.month1);
    if (params.month2) queryParams.append("month2", params.month2);

    const url = `/line-month-comparison${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    const response = await api.get(url);
    return response.data
}

export const getRecentTransaction = async () => {
    const response = await api.get("/recent-transaction");
    return response.data
}
