import { z } from "zod";
import { evidenceItems, selfQuestions, situationalQuestions } from "@/lib/scan-data";

export const profileSchema = z.object({
  studentName: z.string().min(2, "이름을 입력해 주세요."),
  grade: z.enum(["3학년", "4학년"]),
  major: z.string().min(2, "전공을 입력해 주세요."),
  careerPath: z.string().min(2, "희망 진로를 입력해 주세요."),
  email: z.string().email("올바른 이메일 주소를 입력해 주세요.").or(z.literal("")),
});

export const projectSchema = z.object({
  projectTitle: z.string().min(2, "프로젝트 제목을 입력해 주세요."),
  projectSummary: z.string().min(20, "20자 이상 작성해 주세요."),
  projectRole: z.string().min(10, "담당 역할을 설명해 주세요."),
  projectChallenge: z.string().min(10, "핵심 과제를 설명해 주세요."),
  projectOutcome: z.string().min(10, "결과를 설명해 주세요."),
});

const completeRecord = <T extends z.ZodTypeAny>(keys: readonly string[], valueSchema: T) =>
  z.record(valueSchema).superRefine((value, context) => {
    keys.forEach((key) => {
      if (value[key] === undefined) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: "응답이 필요합니다." });
      }
    });
  });

export const submissionSchema = z.object({
  profile: profileSchema,
  project: projectSchema,
  self: completeRecord(selfQuestions.map((question) => question.id), z.coerce.number().min(1).max(5)),
  situational: completeRecord(situationalQuestions.map((question) => question.id), z.string().min(1)),
  evidence: completeRecord(evidenceItems.map((item) => item.id), z.object({ checked: z.boolean(), note: z.string().optional(), source: z.string().optional() })),
});

export type SubmissionSection = "profile" | "self" | "situational" | "project" | "evidence";

export function getSubmissionIssues(input: unknown) {
  const result = submissionSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    section: issue.path[0] as SubmissionSection,
    field: String(issue.path[1] ?? ""),
    message: issue.message,
  }));
}

export type ProfileData = z.infer<typeof profileSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
