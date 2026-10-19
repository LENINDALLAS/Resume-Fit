import { ScoreInterpretationEnum } from "../enums/index.js";
import { SCORE_BAND_COLORS } from "../constants/theme.js";

export function getScoreInterpretation(score: number): ScoreInterpretationEnum {
  if (score >= 90) return ScoreInterpretationEnum.EXCELLENT_MATCH;
  if (score >= 75) return ScoreInterpretationEnum.STRONG_MATCH;
  if (score >= 60) return ScoreInterpretationEnum.GOOD_MATCH;
  if (score >= 40) return ScoreInterpretationEnum.MODERATE_MATCH;
  return ScoreInterpretationEnum.LOW_MATCH;
}

export function getScoreBandColor(score: number): string {
  if (score >= 90) return SCORE_BAND_COLORS.excellent;
  if (score >= 75) return SCORE_BAND_COLORS.strong;
  if (score >= 60) return SCORE_BAND_COLORS.good;
  if (score >= 40) return SCORE_BAND_COLORS.moderate;
  return SCORE_BAND_COLORS.low;
}
