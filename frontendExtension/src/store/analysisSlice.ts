import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnalysisDto } from "@resume-fit/shared";
import { analysisApi, type CreateAnalysisRequest } from "../api";
import { getErrorMessage } from "../utils";

export interface AnalysisState {
  analysis: AnalysisDto | null;
  isLoading: boolean;
  error: string | null;
  isClaiming: boolean;
  claimError: string | null;
}

const initialState: AnalysisState = {
  analysis: null,
  isLoading: false,
  error: null,
  isClaiming: false,
  claimError: null,
};

export const createAnalysis = createAsyncThunk(
  "analysis/create",
  async (input: CreateAnalysisRequest, { rejectWithValue }) => {
    try {
      return await analysisApi.createAnalysis(input);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const claimAnalysis = createAsyncThunk(
  "analysis/claim",
  async (analysisId: string, { rejectWithValue }) => {
    try {
      return await analysisApi.claimAnalysis(analysisId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    resetAnalysis(state) {
      state.analysis = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAnalysis.fulfilled, (state, action: PayloadAction<AnalysisDto>) => {
        state.isLoading = false;
        state.analysis = action.payload;
      })
      .addCase(createAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Unable to analyze this resume right now.";
      })
      .addCase(claimAnalysis.pending, (state) => {
        state.isClaiming = true;
        state.claimError = null;
      })
      .addCase(claimAnalysis.fulfilled, (state, action: PayloadAction<AnalysisDto>) => {
        state.isClaiming = false;
        state.analysis = action.payload;
      })
      .addCase(claimAnalysis.rejected, (state, action) => {
        state.isClaiming = false;
        state.claimError = (action.payload as string) ?? "Unable to save this analysis to your account.";
      });
  },
});

export const { resetAnalysis } = analysisSlice.actions;
export const analysisReducer = analysisSlice.reducer;
