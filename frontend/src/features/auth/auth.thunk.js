import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage } from "../../utils/errorMessageUtil";
import { axiosInstance } from "../../config/axiosInstance";

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/login", userData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, thunkAPI) => {
        try {
            await axiosInstance.post("/auth/register", userData);
            return userData.email;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)

export const sendOtp = createAsyncThunk(
    'auth/sendOtp',
    async ({ email }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/otp/send", { email });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/otp/verify", { email, otp });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, otp, newPassword }, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/auth/reset-password", { email, otp, newPassword });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)