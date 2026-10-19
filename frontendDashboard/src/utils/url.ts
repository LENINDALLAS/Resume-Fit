export interface HandoffParams {
  token: string | null;
  analysisId: string | null;
}

export function getHandoffParams(search: string): HandoffParams {
  const params = new URLSearchParams(search);
  return {
    token: params.get("token"),
    analysisId: params.get("analysisId"),
  };
}
