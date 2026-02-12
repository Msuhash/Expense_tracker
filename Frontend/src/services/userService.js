import axios from "axios";
import { API_BASE_URL } from "./api";

const api = axios.create({
    baseURL: API_BASE_URL + "/api/user",
    withCredentials: true
})

export const getUserData = async () => {
    const response = await api.get("/data");
    return response.data.UserData;
}

export const updateUsername = async (username) => {
    const response = await api.put("/update-username", { username });
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