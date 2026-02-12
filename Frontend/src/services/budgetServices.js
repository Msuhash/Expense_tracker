import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/budget";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const addBudget = async (budget) => {
    const response = await api.post("/create-budget", budget);
    return response.data;
}

export const getBudget = async () => {
    const response = await api.get("/get-budget");
    return response.data;
}

export const getSummary = async() => {
    const response = await api.get("/summary-budget");
    return response.data;
}

export const deleteBudget = async (id) => {
    const response = await api.delete(`/delete-budget/${id}`)
    return response.data
}

export const updateBudget = async (id, budget) => {
    const response = await api.put(`/update-budget/${id}`, budget)
    return response.data
}

// export const updateAmount = async (id, amount) => {
//     const response = await api.put(`/update-budget-amount/${id}`, {amount});
//     return response.data
// }