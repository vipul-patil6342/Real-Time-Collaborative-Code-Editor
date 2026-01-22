import { createSlice } from "@reduxjs/toolkit"
import { createRoom } from "./room.thunk";

const initialState = {
    loading: false,
    error: null,
    roomId: null
}

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        clearRoom: (state) => {
            state.roomId = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {

        const pending = (state) => {
            state.loading = true;
            state.error = null;
        }

        const rejected = (state, action) => {
            state.loading = true;
            state.error = action.payload;
        }

        builder
            .addCase(createRoom.pending, pending)
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.roomId = action.payload.roomId;
            })
            .addCase(createRoom.rejected, rejected)
    }
})

export const { clearRoom } = roomSlice.actions;
export default roomSlice.reducer;