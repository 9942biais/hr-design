import { PrismaClient } from "@prisma/client";
import { categories, evidenceItems, indicators, selfQuestions, situationalQuestions } from "../lib/scan-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.indicatorScore.deleteMany();
  await prisma.scan.deleteMany();
  await prisma.situationalOption.deleteMany();
  await prisma.situationalQuestion.deleteMany();
  await prisma.selfQuestion.deleteMany();
  await prisma.evidenceItem.deleteMany();
  await prisma.indicator.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categories) await prisma.category.create({ data: category });
  for (const indicator of indicators) await prisma.indicator.create({ data: indicator });
  for (const question of selfQuestions) await prisma.selfQuestion.create({ data: question });
  for (const item of evidenceItems) await prisma.evidenceItem.create({ data: item });
  for (const question of situationalQuestions) {
    await prisma.situationalQuestion.create({
      data: {
        id: question.id,
        indicatorId: question.indicatorId,
        order: question.order,
        prompt: question.prompt,
        options: { create: question.options },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
