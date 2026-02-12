import axios from "axios";
import { API_BASE_URL } from "./api";

const api = axios.create({
    baseURL: API_BASE_URL + "/api/auth",
    withCredentials: true
});

export const login = async (loginData) => {
    const response = await api.post("/login", loginData);
    return response.data;
};

export const signUp = async (signUpData) => {
    const response = await api.post("/signUp", signUpData);
    return response.data;
};

export const sendVerifyOtp = async () => {
    const response = await api.post("/send-verify-otp");
    return response.data;
};

export const verifyOtp = async (otpData) => {
    const response = await api.post("/verifyotp", otpData);
    return response.data;
};

export const checkIsAuth = async () => {
    const response = await api.post("/isauth");
    return response.data;
};

export const sendResetOtp = async (emailData) => {
    const response = await api.post("/send-reset-otp", emailData);
    return response.data;
};

export const verifyResetOtp = async (otpData) => {
    const response = await api.post("/verify-reset-otp", otpData);
    return response.data;
};

export const resetPassword = async (passwordData) => {
    const response = await api.post("/reset-password", passwordData);
    return response.data;
};
