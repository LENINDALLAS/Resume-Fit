import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LoginInput, RegisterInput, UserDto } from "@resume-fit/shared";
import { authService } from "../services/authService";
import { dashboardService } from "../services/dashboardService";

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

export const processHandoff = createAsyncThunk("auth/processHandoff", async (token: string) =>
  dashboardService.processExtensionHandoff(token),
);

export const login = createAsyncThunk("auth/login", async (input: LoginInput) => authService.login(input));

export const register = createAsyncThunk("auth/register", async (input: RegisterInput) =>
  authService.register(input),
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
      .addCase(processHandoff.fulfilled, (state, action: PayloadAction<UserDto | null>) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
        state.isInitialising = false;
      })
      .addCase(processHandoff.rejected, (state) => {
        state.isInitialising = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.fulfilled, () => {
        // Registration does not automatically authenticate the user (approved MVP behavior).
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
