import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginInput, RegisterInput, UserDto } from "@resume-fit/shared";
import { authService } from "../services/authService";

export interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
  isInitialising: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialising: true,
};

export const initializeAuth = createAsyncThunk("auth/initialize", async () => authService.initializeAuth());

export const login = createAsyncThunk("auth/login", async (input: LoginInput) => authService.login(input));

export const registerAndLogin = createAsyncThunk("auth/registerAndLogin", async (input: RegisterInput) =>
  authService.registerAndLogin(input),
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<UserDto | null>) => {
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.isInitialising = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialising = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerAndLogin.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
