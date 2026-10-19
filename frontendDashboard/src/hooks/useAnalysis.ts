import { useAppSelector } from "./useAuth";

export function useAnalysis() {
  return useAppSelector((state) => state.analysis);
}
