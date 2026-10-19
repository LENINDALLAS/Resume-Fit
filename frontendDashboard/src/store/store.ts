import { configureStore } from "@reduxjs/toolkit";
import { authReducer, sessionExpired } from "./authSlice";
import { analysisReducer } from "./analysisSlice";
import { setOnAuthFailure } from "../api/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
  },
});

// Registered once so axiosInstance never needs to import the store directly.
setOnAuthFailure(() => store.dispatch(sessionExpired()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
