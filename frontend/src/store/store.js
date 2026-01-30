import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/room/room.slice"
import authReducer from "../features/auth/auth.slice"

export const store = configureStore({
    reducer : {
        room : roomReducer,
        auth : authReducer,
    }
})