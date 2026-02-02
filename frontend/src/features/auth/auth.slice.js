import { createSlice } from "@reduxjs/toolkit"
import { forgotPassword, getAuthState, loginUser, sendOtp, signupUser, verifyOtp } from "./auth.thunk";

const initialState = {
    loading: true,
    user: null,
    error: null,
    email: null,
    isAuthenticated: false,
    successMessage: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {

        const pending = (state) => {
            state.loading = true;
            state.error = null;
        }

        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

        builder
            // login user
            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, rejected)

            // signup user
            .addCase(signupUser.pending, pending)
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.email = action.payload;
            })
            .addCase(signupUser.rejected, rejected)

            //send verification otp
            .addCase(sendOtp.pending, pending)
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(sendOtp.rejected, rejected)

            //verify otp
            .addCase(verifyOtp.pending, pending)
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyOtp.rejected, rejected)

            //forgot-password
            .addCase(forgotPassword.pending, pending)
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, rejected)

            //auth state
            .addCase(getAuthState.pending, pending)
            .addCase(getAuthState.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.isAuthenticated = action.payload.authenticated;
                state.user = action.payload.username;
            })
            .addCase(getAuthState.rejected, rejected)
    }
})

export const { resetError, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;