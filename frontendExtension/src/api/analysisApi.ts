import type { AnalysisDto, IApiSuccessResponse } from "@resume-fit/shared";
import { axiosInstance } from "./axiosInstance";

export interface CreateAnalysisRequest {
  jobDescription: string;
  resume: File;
}

export const analysisApi = {
  async createAnalysis(input: CreateAnalysisRequest): Promise<AnalysisDto> {
    const formData = new FormData();
    formData.append("jobDescription", input.jobDescription);
    formData.append("resume", input.resume);

    const response = await axiosInstance.post<IApiSuccessResponse<{ analysis: AnalysisDto }>>(
      "/analyses",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data.data.analysis;
  },

  async claimAnalysis(analysisId: string): Promise<AnalysisDto> {
    const response = await axiosInstance.post<IApiSuccessResponse<{ analysis: AnalysisDto }>>(
      `/analyses/${analysisId}/claim`,
    );
    return response.data.data.analysis;
  },
};
