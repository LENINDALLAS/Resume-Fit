import type { Analysis, Prisma } from "@prisma/client";
import { AnalysisStatusEnum } from "@resume-fit/shared";
import type {
  CertificationsEvaluation,
  EducationEvaluation,
  ExperienceEvaluation,
  MatchedSkill,
  MissingSkill,
  ProjectsEvaluation,
  ScoreBreakdown,
} from "@resume-fit/shared";
import { prisma } from "../lib/prisma.js";

export interface CreateAnalysisData {
  userId: string | null;
  jobTitle: string | null;
  companyName: string | null;
  atsScore: number;
  atsVersion: string;
  summary: string;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  experienceEvaluation: ExperienceEvaluation;
  educationEvaluation: EducationEvaluation;
  projectsEvaluation: ProjectsEvaluation;
  certificationsEvaluation: CertificationsEvaluation;
  suggestions: string[];
  strengths: string[];
  scoreBreakdown: ScoreBreakdown;
}

export const analysisRepository = {
  create(data: CreateAnalysisData): Promise<Analysis> {
    return prisma.analysis.create({
      data: {
        userId: data.userId,
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        atsScore: data.atsScore,
        atsVersion: data.atsVersion,
        summary: data.summary,
        matchedSkills: data.matchedSkills as unknown as Prisma.InputJsonValue,
        missingSkills: data.missingSkills as unknown as Prisma.InputJsonValue,
        experienceEvaluation: data.experienceEvaluation as unknown as Prisma.InputJsonValue,
        educationEvaluation: data.educationEvaluation as unknown as Prisma.InputJsonValue,
        projectsEvaluation: data.projectsEvaluation as unknown as Prisma.InputJsonValue,
        certificationsEvaluation: data.certificationsEvaluation as unknown as Prisma.InputJsonValue,
        suggestions: data.suggestions as unknown as Prisma.InputJsonValue,
        strengths: data.strengths as unknown as Prisma.InputJsonValue,
        scoreBreakdown: data.scoreBreakdown as unknown as Prisma.InputJsonValue,
        status: AnalysisStatusEnum.COMPLETED,
      },
    });
  },

  findByIdAndUserId(id: string, userId: string): Promise<Analysis | null> {
    return prisma.analysis.findFirst({ where: { id, userId } });
  },

  findManyByUserId(userId: string, skip: number, take: number): Promise<Analysis[]> {
    return prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  },

  countByUserId(userId: string): Promise<number> {
    return prisma.analysis.count({ where: { userId } });
  },

  async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
    const result = await prisma.analysis.deleteMany({ where: { id, userId } });
    return result.count > 0;
  },

  /**
   * Attaches an owner to an unclaimed (userId = null) analysis, or is a
   * no-op success if it's already owned by this same user. Never overwrites
   * another user's ownership -- the update simply matches zero rows in that case.
   */
  async claimById(id: string, userId: string): Promise<Analysis | null> {
    const result = await prisma.analysis.updateMany({
      where: { id, OR: [{ userId: null }, { userId }] },
      data: { userId },
    });

    if (result.count === 0) return null;
    return prisma.analysis.findFirst({ where: { id, userId } });
  },
};
