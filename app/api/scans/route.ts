import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateScores } from "@/lib/scoring";
import { submissionSchema } from "@/lib/schemas";
import { evidenceItems, selfQuestions, situationalQuestions } from "@/lib/scan-data";

export async function POST(request: Request) {
  try {
    const payload = submissionSchema.parse(await request.json());
    const hasAllAnswers = selfQuestions.every((q) => payload.self[q.id])
      && situationalQuestions.every((q) => payload.situational[q.id])
      && evidenceItems.every((item) => payload.evidence[item.id]);
    if (!hasAllAnswers) return NextResponse.json({ error: "완료하지 않은 진단 항목이 있습니다." }, { status: 400 });

    const result = calculateScores({ self: payload.self, situational: payload.situational, evidence: payload.evidence });
    const scan = await prisma.scan.create({
      data: {
        ...payload.profile,
        ...payload.project,
        selfAnswersJson: JSON.stringify(payload.self),
        situationalAnswersJson: JSON.stringify(payload.situational),
        evidenceAnswersJson: JSON.stringify(payload.evidence),
        overallScore: result.overallScore,
        categoryScoresJson: JSON.stringify(result.categoryScores),
        typeTagsJson: JSON.stringify(result.typeTags),
        indicatorScores: {
          create: result.indicatorScores.map((score) => ({
            indicatorId: score.indicatorId,
            selfScore: score.selfScore,
            situationalScore: score.situationalScore,
            evidenceScore: score.evidenceScore,
            finalScore: score.finalScore,
          })),
        },
      },
    });
    return NextResponse.json({ id: scan.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "진단 제출 데이터가 올바르지 않습니다." }, { status: 400 });
  }
}
