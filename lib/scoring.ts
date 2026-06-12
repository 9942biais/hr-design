import {
  categories,
  evidenceItems,
  indicators,
  selfQuestions,
  situationalQuestions,
  type IndicatorId,
} from "@/lib/scan-data";

export const SCORING_METHOD = "deterministic-v1";
export const SCORING_VERSION = "1.0.0";
export type EvidenceStatus = "missing" | "self-reported";

export type EvidenceAnswer = { checked: boolean; note?: string; source?: string };
export type ScanAnswers = {
  self: Record<string, number>;
  situational: Record<string, string>;
  evidence: Record<string, EvidenceAnswer>;
};

export type CalculatedIndicatorScore = {
  indicatorId: IndicatorId;
  name: string;
  categoryId: string;
  selfScore: number;
  situationalScore: number;
  evidenceScore: number;
  finalScore: number;
  consultingPriority: string;
};

const round = (value: number) => Math.round(value * 10) / 10;
const likertToPercent = (average: number) => ((average - 1) / 4) * 100;

export function getEvidenceStatus(evidence: ScanAnswers["evidence"]): EvidenceStatus {
  return evidenceItems.some((item) => evidence[item.id]?.checked) ? "self-reported" : "missing";
}

export function calculateScores(answers: ScanAnswers) {
  const indicatorScores: CalculatedIndicatorScore[] = indicators.map((indicator) => {
    const selfValues = selfQuestions
      .filter((question) => question.indicatorId === indicator.id)
      .map((question) => answers.self[question.id]);
    const selfAverage = selfValues.reduce((sum, value) => sum + value, 0) / selfValues.length;
    const selfScore = likertToPercent(selfAverage);

    const question = situationalQuestions.find((item) => item.indicatorId === indicator.id)!;
    const selectedOption = question.options.find((option) => option.id === answers.situational[question.id]);
    if (!selectedOption) throw new Error(`Invalid situational answer for ${question.id}`);
    const situationalScore = selectedOption.score;

    const evidenceEntries = evidenceItems
      .filter((item) => item.indicatorId === indicator.id)
      .map((item) => answers.evidence[item.id]);
    const checkedCount = evidenceEntries.filter((value) => value.checked).length;
    const evidenceScore = (checkedCount / evidenceEntries.length) * 100;
    const finalScore = selfScore * 0.25 + situationalScore * 0.35 + evidenceScore * 0.4;

    return {
      indicatorId: indicator.id,
      name: indicator.name,
      categoryId: indicator.categoryId,
      selfScore: round(selfScore),
      situationalScore: round(situationalScore),
      evidenceScore: round(evidenceScore),
      finalScore: round(finalScore),
      consultingPriority: indicator.consultingPriority,
    };
  });

  const categoryScores = Object.fromEntries(
    categories.map((category) => {
      const scores = indicatorScores.filter((score) => score.categoryId === category.id);
      return [category.id, round(scores.reduce((sum, score) => sum + score.finalScore, 0) / scores.length)];
    }),
  );
  const overallScore = round(indicatorScores.reduce((sum, score) => sum + score.finalScore, 0) / indicatorScores.length);

  return { indicatorScores, categoryScores, overallScore, typeTags: getTypeTags(indicatorScores, categoryScores) };
}

export function getTypeTags(scores: CalculatedIndicatorScore[], categoryScores: Record<string, number>) {
  const value = (id: IndicatorId) => scores.find((score) => score.indicatorId === id)!.finalScore;
  const highestCategory = Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0][0];
  const tags: string[] = [];

  if (highestCategory === "making" && value("visual-sensibility") >= 80) tags.push("비주얼 메이커");
  if (highestCategory === "thinking" && value("concept-translation") >= 75) tags.push("콘셉트 빌더");
  if (categoryScores.making >= 75 && value("system-building") >= 75) tags.push("시스템 오거나이저");
  if (highestCategory === "communicating" && value("storytelling") >= 75) tags.push("스토리 에디터");
  if (highestCategory === "working" && value("self-direction") >= 75) tags.push("자기주도 탐험가");
  if (value("problem-discovery") < 60 || value("research-insight") < 60) tags.push("문제 정의 보완 필요");
  if (value("research-insight") < 60 && value("visual-sensibility") >= 75) tags.push("근거 보완 필요");
  if (value("portfolio-structure") < 60 || value("storytelling") < 60) tags.push("편집 보완 필요");

  return tags.length ? tags : ["균형형 디자이너"];
}
