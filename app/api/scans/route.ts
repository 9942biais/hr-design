import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createResultAccessToken } from "@/lib/result-access";
import {
  calculateScores,
  getEvidenceStatus,
  SCORING_METHOD,
  SCORING_VERSION,
} from "@/lib/scoring";
import { submissionSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = submissionSchema.parse(await request.json());
    const result = calculateScores({ self: payload.self, situational: payload.situational, evidence: payload.evidence });
    const scanId = randomUUID();
    const accessToken = createResultAccessToken(scanId);
    const scan = await prisma.scan.create({
      data: {
        id: scanId,
        ...payload.profile,
        ...payload.project,
        selfAnswersJson: JSON.stringify(payload.self),
        situationalAnswersJson: JSON.stringify(payload.situational),
        evidenceAnswersJson: JSON.stringify(payload.evidence),
        scoringMethod: SCORING_METHOD,
        scoringVersion: SCORING_VERSION,
        evidenceStatus: getEvidenceStatus(payload.evidence),
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
    return NextResponse.json({ id: scan.id, accessToken });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "진단 제출 데이터가 올바르지 않습니다." }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "진단을 저장하지 못했습니다." }, { status: 500 });
  }
}
