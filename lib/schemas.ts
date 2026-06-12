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

const selfAnswerShape = Object.fromEntries(
  selfQuestions.map((question) => [question.id, z.coerce.number().min(1).max(5)]),
) as Record<string, z.ZodNumber>;

const situationalAnswerShape = Object.fromEntries(
  situationalQuestions.map((question) => [
    question.id,
    z.string().refine(
      (answer) => question.options.some((option) => option.id === answer),
      "선택 가능한 답변이 아닙니다.",
    ),
  ]),
) as Record<string, z.ZodType<string>>;

const evidenceAnswerSchema = z.object({
  checked: z.boolean(),
  note: z.string().optional(),
  source: z.string().optional(),
}).strict("허용되지 않은 증거자료 값입니다.");

const evidenceAnswerShape = Object.fromEntries(
  evidenceItems.map((item) => [item.id, evidenceAnswerSchema]),
) as Record<string, typeof evidenceAnswerSchema>;

export const submissionSchema = z.object({
  profile: profileSchema,
  project: projectSchema,
  self: z.object(selfAnswerShape).strict("허용되지 않은 자기평가 항목입니다."),
  situational: z.object(situationalAnswerShape).strict("허용되지 않은 상황판단 항목입니다."),
  evidence: z.object(evidenceAnswerShape).strict("허용되지 않은 증거자료 항목입니다."),
}).strict("허용되지 않은 제출 데이터입니다.");

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
