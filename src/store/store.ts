import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth.slice";

const store = configureStore({
    reducer: {
        auth: authSlice
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// tại sao lại là ReturnType và typeof, sự khác nhau ở đây là gì