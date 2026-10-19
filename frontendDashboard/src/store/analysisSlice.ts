import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnalysisDto } from "@resume-fit/shared";
import { analysisApi } from "../api";
import { getErrorMessage } from "../utils";

export interface AnalysisState {
  analysis: AnalysisDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  analysis: null,
  isLoading: false,
  error: null,
};

export const fetchAnalysis = createAsyncThunk(
  "analysis/fetch",
  async (analysisId: string, { rejectWithValue }) => {
    try {
      return await analysisApi.getAnalysis(analysisId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAnalysis = createAsyncThunk(
  "analysis/delete",
  async (analysisId: string, { rejectWithValue }) => {
    try {
      await analysisApi.deleteAnalysis(analysisId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    clearAnalysis(state) {
      state.analysis = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action: PayloadAction<AnalysisDto>) => {
        state.isLoading = false;
        state.analysis = action.payload;
      })
      .addCase(fetchAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) ?? "Unable to load this analysis.";
      })
      .addCase(deleteAnalysis.fulfilled, (state) => {
        state.analysis = null;
      });
  },
});

export const { clearAnalysis } = analysisSlice.actions;
export const analysisReducer = analysisSlice.reducer;
