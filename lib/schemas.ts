import { z } from "zod";

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

export const submissionSchema = z.object({
  profile: profileSchema,
  project: projectSchema,
  self: z.record(z.number().min(1).max(5)),
  situational: z.record(z.string()),
  evidence: z.record(z.object({ checked: z.boolean(), note: z.string().optional() })),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
