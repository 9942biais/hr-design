import { describe, expect, it } from "vitest";
import { categories, evidenceItems, indicators, selfQuestions, situationalQuestions } from "@/lib/scan-data";
import { calculateScores, getTypeTags, type CalculatedIndicatorScore } from "@/lib/scoring";

function answers(likert: number, situationalScore: number, checked: boolean) {
  return {
    self: Object.fromEntries(selfQuestions.map((question) => [question.id, likert])),
    situational: Object.fromEntries(
      situationalQuestions.map((question) => [
        question.id,
        question.options.find((option) => option.score === situationalScore)!.id,
      ]),
    ),
    evidence: Object.fromEntries(evidenceItems.map((item) => [item.id, { checked }])),
  };
}

function tagScores(values: Partial<Record<(typeof indicators)[number]["id"], number>>) {
  return indicators.map((indicator) => ({
    indicatorId: indicator.id,
    name: indicator.name,
    categoryId: indicator.categoryId,
    selfScore: 0,
    situationalScore: 0,
    evidenceScore: 0,
    finalScore: values[indicator.id] ?? 65,
    consultingPriority: indicator.consultingPriority,
  })) satisfies CalculatedIndicatorScore[];
}

describe("calculateScores", () => {
  it("returns 100 for perfect answers and 0 for minimum answers", () => {
    expect(calculateScores(answers(5, 100, true)).overallScore).toBe(100);
    expect(calculateScores(answers(1, 0, false)).overallScore).toBe(0);
  });

  it("applies the 25/35/40 weights", () => {
    const result = calculateScores(answers(3, 100, true));
    expect(result.overallScore).toBe(87.5);
    expect(result.indicatorScores.every((score) => score.finalScore === 87.5)).toBe(true);
  });

  it("calculates each category from exactly three indicators", () => {
    const result = calculateScores(answers(3, 100, true));
    expect(Object.keys(result.categoryScores)).toEqual(categories.map((category) => category.id));
    expect(Object.values(result.categoryScores)).toEqual([87.5, 87.5, 87.5, 87.5]);
  });
});

describe("getTypeTags", () => {
  it.each([
    ["비주얼 메이커", { "visual-sensibility": 85 }, { thinking: 65, making: 90, communicating: 65, working: 65 }],
    ["콘셉트 빌더", { "concept-translation": 80 }, { thinking: 90, making: 65, communicating: 65, working: 65 }],
    ["시스템 오거나이저", { "system-building": 80 }, { thinking: 65, making: 80, communicating: 65, working: 65 }],
    ["스토리 에디터", { storytelling: 80 }, { thinking: 65, making: 65, communicating: 90, working: 65 }],
    ["자기주도 탐험가", { "self-direction": 80 }, { thinking: 65, making: 65, communicating: 65, working: 90 }],
    ["문제 정의 보완 필요", { "problem-discovery": 59 }, { thinking: 65, making: 65, communicating: 65, working: 65 }],
    ["근거 보완 필요", { "research-insight": 59, "visual-sensibility": 80 }, { thinking: 65, making: 70, communicating: 65, working: 65 }],
    ["편집 보완 필요", { "portfolio-structure": 59 }, { thinking: 65, making: 65, communicating: 65, working: 65 }],
  ])("assigns %s", (tag, values, categoryScores) => {
    expect(getTypeTags(tagScores(values), categoryScores)).toContain(tag);
  });

  it("uses the balanced fallback when no rule matches", () => {
    expect(getTypeTags(tagScores({}), { thinking: 65, making: 65, communicating: 65, working: 65 })).toEqual(["균형형 디자이너"]);
  });
});
