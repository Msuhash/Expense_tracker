import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api/user" || "http://localhost:8000/api/user",
    withCredentials: true
})

export const getUserData = async () => {
    const response = await api.get("/data");
    return response.data.UserData;
}

export const updateUsername = async (username) => {
    const response = await api.put("/update-username", {username});
    return response.data;
}

export const updatePassword = async (passwords) => {
    const response = await api.put("/update-password", passwords);
    return response.data;
}

export const logout = async () => {
    await api.post("/logout");
    return true;
}