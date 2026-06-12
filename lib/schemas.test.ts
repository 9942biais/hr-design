import { describe, expect, it } from "vitest";
import { evidenceItems, selfQuestions, situationalQuestions } from "@/lib/scan-data";
import { submissionSchema } from "@/lib/schemas";

function validSubmission() {
  return {
    profile: {
      studentName: "홍길동",
      grade: "3학년",
      major: "시각디자인",
      careerPath: "브랜드 디자이너",
      email: "student@example.com",
    },
    project: {
      projectTitle: "대표 프로젝트",
      projectSummary: "사용자 문제를 조사하고 해결 방향을 제안한 대표 프로젝트입니다.",
      projectRole: "리서치와 디자인 전반을 담당했습니다.",
      projectChallenge: "복잡한 정보를 명확하게 전달하는 것이 핵심 과제였습니다.",
      projectOutcome: "사용성 검증을 거쳐 최종 결과물을 완성했습니다.",
    },
    self: Object.fromEntries(selfQuestions.map((question) => [question.id, 3])),
    situational: Object.fromEntries(
      situationalQuestions.map((question) => [question.id, question.options[0].id]),
    ),
    evidence: Object.fromEntries(
      evidenceItems.map((item) => [item.id, { checked: false, note: "", source: "" }]),
    ),
  };
}

describe("submissionSchema", () => {
  it("accepts a complete canonical submission", () => {
    expect(submissionSchema.safeParse(validSubmission()).success).toBe(true);
  });

  it("rejects injected question and evidence keys", () => {
    const payload = validSubmission();
    payload.self["self-problem-discovery-injected"] = 5;
    payload.evidence["evidence-problem-discovery-injected"] = { checked: true, note: "", source: "" };
    expect(submissionSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects situational answers that are not defined options", () => {
    const payload = validSubmission();
    payload.situational[situationalQuestions[0].id] = "not-a-real-option";
    expect(submissionSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects submissions with missing required answers", () => {
    const payload = validSubmission();
    delete payload.self[selfQuestions[0].id];
    expect(submissionSchema.safeParse(payload).success).toBe(false);
  });
});
