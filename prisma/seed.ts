import { PrismaClient } from "@prisma/client";
import { categories, evidenceItems, indicators, selfQuestions, situationalQuestions } from "../lib/scan-data";

const prisma = new PrismaClient();

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name, order: category.order },
      create: category,
    });
  }
  for (const indicator of indicators) {
    await prisma.indicator.upsert({
      where: { id: indicator.id },
      update: {
        categoryId: indicator.categoryId,
        name: indicator.name,
        order: indicator.order,
        consultingPriority: indicator.consultingPriority,
      },
      create: indicator,
    });
  }
  for (const question of selfQuestions) {
    await prisma.selfQuestion.upsert({
      where: { id: question.id },
      update: { indicatorId: question.indicatorId, order: question.order, text: question.text },
      create: question,
    });
  }
  for (const item of evidenceItems) {
    await prisma.evidenceItem.upsert({
      where: { id: item.id },
      update: { indicatorId: item.indicatorId, order: item.order, text: item.text, weight: item.weight },
      create: item,
    });
  }
  for (const question of situationalQuestions) {
    await prisma.situationalQuestion.upsert({
      where: { id: question.id },
      update: { indicatorId: question.indicatorId, order: question.order, prompt: question.prompt },
      create: {
        id: question.id,
        indicatorId: question.indicatorId,
        order: question.order,
        prompt: question.prompt,
      },
    });
    for (const option of question.options) {
      await prisma.situationalOption.upsert({
        where: { id: option.id },
        update: {
          questionId: question.id,
          order: option.order,
          text: option.text,
          score: option.score,
          tags: option.tags,
        },
        create: { ...option, questionId: question.id },
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
