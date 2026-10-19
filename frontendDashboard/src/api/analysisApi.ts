import type { AnalysisDto, IApiSuccessResponse } from "@resume-fit/shared";
import { axiosInstance } from "./axiosInstance";

export const analysisApi = {
  async getAnalysis(analysisId: string): Promise<AnalysisDto> {
    const response = await axiosInstance.get<IApiSuccessResponse<{ analysis: AnalysisDto }>>(
      `/analyses/${analysisId}`,
    );
    return response.data.data.analysis;
  },

  async deleteAnalysis(analysisId: string): Promise<void> {
    await axiosInstance.delete(`/analyses/${analysisId}`);
  },
};
