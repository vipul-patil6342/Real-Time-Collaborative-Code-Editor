import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorMessage } from "../../utils/errorMessageUtil";
import { axiosInstance } from "../../config/axiosInstance";

export const createRoom = createAsyncThunk(
    'room/createRoom',
    async(_, thunkAPI) => {
        try {
            const response = await axiosInstance.post("/rooms");
            console.log(response.data)
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(errorMessage(error));
        }
    }
)