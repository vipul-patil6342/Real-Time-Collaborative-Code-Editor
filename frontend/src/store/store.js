import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../features/room/room.slice"

export const store = configureStore({
    reducer : {
        room : roomReducer,
    }
})