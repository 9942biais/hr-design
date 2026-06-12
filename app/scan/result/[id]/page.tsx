import { notFound } from "next/navigation";
import { CategoryRadar, IndicatorBars } from "@/components/result-charts";
import { PrintButton } from "@/components/print-button";
import { NewScanButton } from "@/components/new-scan-button";
import { categories, indicators } from "@/lib/scan-data";
import { prisma } from "@/lib/prisma";
import { verifyResultAccessToken } from "@/lib/result-access";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ access?: string | string[] }>;
}) {
  const { id } = await params;
  const { access } = await searchParams;
  const accessToken = Array.isArray(access) ? access[0] : access;
  if (!verifyResultAccessToken(id, accessToken)) notFound();

  const scan = await prisma.scan.findUnique({ where: { id }, include: { indicatorScores: true } });
  if (!scan) notFound();
  const isProvisional = scan.evidenceStatus === "missing";
  const reportLabel = isProvisional ? "임시 진단 · 증거자료 미제출" : "표준 진단 · 자가 제출 근거";
  const evidenceNotice = isProvisional
    ? "포트폴리오 증거 항목이 선택되지 않아 증거 점수가 0점으로 계산된 임시 결과입니다."
    : "증거 점수는 학생이 직접 선택한 항목을 기준으로 계산했으며, 제3자 또는 AI 검증 결과가 아닙니다.";
  const categoryScores = JSON.parse(scan.categoryScoresJson) as Record<string, number>;
  const typeTags = JSON.parse(scan.typeTagsJson) as string[];
  const scored = indicators.map((indicator) => ({
    ...indicator,
    score: scan.indicatorScores.find((item) => item.indicatorId === indicator.id)?.finalScore ?? 0,
  }));
  const sorted = [...scored].sort((a,b) => b.score - a.score);
  const strengths = sorted.slice(0,3);
  const improvements = sorted.slice(-3).reverse();
  const radarData = categories.map((category) => ({ name: category.name, score: categoryScores[category.id] }));
  const barData = scored.map((item) => ({ name: item.name, score: item.score }));

  return <main className="print-page mx-auto max-w-7xl px-5 py-10 md:px-10">
    <div className="no-print mb-8 flex items-center justify-between"><NewScanButton /><PrintButton /></div>
    <section className="screen-report overflow-hidden rounded-[2rem] bg-white shadow-card">
      <div className="grid bg-ink text-white md:grid-cols-[1.25fr_.75fr]">
        <div className="p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[.2em] text-lime">디자이너 인바디 · {reportLabel}</p>
          <h1 className="mt-5 text-4xl font-black tracking-[-.05em] md:text-6xl">{scan.studentName}</h1>
          <p className="mt-4 text-sm text-white/60">{scan.grade} · {scan.major} · 희망 진로: {scan.careerPath}</p>
          <div className="mt-7 flex flex-wrap gap-2">{typeTags.map((tag) => <span key={tag} className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold">{tag}</span>)}</div>
        </div>
        <div className="flex items-center justify-center bg-lime p-7 text-ink"><div className="text-center"><span className="block text-[6rem] font-black leading-none tracking-[-.08em]">{Math.round(scan.overallScore)}</span><span className="text-xs font-black uppercase tracking-[.2em]">종합 점수</span></div></div>
      </div>

      <div className={`border-b px-6 py-4 text-sm font-bold md:px-8 ${isProvisional ? "border-coral/20 bg-coral/10 text-coral" : "border-violet/20 bg-violet/10 text-violet"}`}>
        {evidenceNotice}
      </div>

      <div className="grid gap-0 border-b border-black/10 md:grid-cols-4">
        {categories.map((category) => <div key={category.id} className="border-r border-black/10 p-5 last:border-r-0"><p className="text-xs font-black uppercase tracking-wider text-black/45">{category.name}</p><p className="mt-2 text-3xl font-black">{categoryScores[category.id]}</p></div>)}
      </div>

      <div className="grid md:grid-cols-[.8fr_1.2fr]">
        <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r md:p-8">
          <h2 className="text-lg font-black">4대 역량 분포</h2><CategoryRadar data={radarData} />
          <div className="mt-4 grid gap-6 xl:grid-cols-2">
            <div><h3 className="mb-3 text-xs font-black uppercase tracking-wider text-violet">가장 강한 역량</h3>{strengths.map((item, index) => <p key={item.id} className="flex items-start justify-between gap-3 border-t border-black/10 py-2 text-sm font-bold"><span className="min-w-0">{index+1}. {item.name}</span><span className="shrink-0">{item.score}</span></p>)}</div>
            <div><h3 className="mb-3 text-xs font-black uppercase tracking-wider text-coral">우선 개선 영역</h3>{improvements.map((item, index) => <p key={item.id} className="flex items-start justify-between gap-3 border-t border-black/10 py-2 text-sm font-bold"><span className="min-w-0">{index+1}. {item.name}</span><span className="shrink-0">{item.score}</span></p>)}</div>
          </div>
        </div>
        <div className="p-6 md:p-8"><h2 className="text-lg font-black">12개 세부 지표 점수</h2><IndicatorBars data={barData} /></div>
      </div>

      <div className="border-t border-black/10 p-6 md:p-8">
        <h2 className="text-lg font-black">컨설팅 우선순위</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{improvements.map((item, index) => <article key={item.id} className="print-avoid rounded-2xl bg-paper p-5"><span className="text-xs font-black text-violet">우선순위 {index+1}</span><h3 className="mt-2 font-black">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-black/65">{item.consultingPriority}</p></article>)}</div>
      </div>
      <footer className="flex justify-between border-t border-black/10 px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-black/40 md:px-8"><span>{scan.scoringMethod} · {scan.scoringVersion} · 자기평가 25% · 상황판단 35% · 증거자료 40%</span><span>{scan.createdAt.toLocaleDateString("ko-KR")}</span></footer>
    </section>
    <section className="print-only">
      <div className="flex items-end justify-between border-b-4 border-black pb-3"><div><p className="text-[8pt] font-black uppercase tracking-[.18em]">디자이너 인바디 · {reportLabel}</p><h1 className="text-[28pt] font-black leading-none">{scan.studentName}</h1><p className="mt-1 text-[8pt]">{scan.grade} · {scan.major} · {scan.careerPath}</p></div><div className="text-right"><strong className="text-[38pt] leading-none">{Math.round(scan.overallScore)}</strong><p className="text-[7pt] font-black uppercase">종합 점수</p></div></div>
      <p className={`my-2 border px-2 py-1 text-[7pt] font-bold ${isProvisional ? "border-coral text-coral" : "border-black/20"}`}>{evidenceNotice}</p>
      <div className="my-3 grid grid-cols-4 gap-2">{categories.map((category) => <div key={category.id} className="bg-paper p-2"><p className="text-[7pt] font-black uppercase">{category.name}</p><p className="text-[18pt] font-black">{categoryScores[category.id]}</p></div>)}</div>
      <div className="grid grid-cols-[1.1fr_.9fr] gap-5">
        <div><h2 className="border-b-2 border-black pb-1 text-[10pt] font-black">12개 세부 지표</h2><div className="mt-1">{scored.map((item) => <div key={item.id} className="grid grid-cols-[125px_1fr_28px] items-center gap-2 border-b border-black/10 py-[3px]"><span className="text-[7.5pt] font-bold">{item.name}</span><span className="h-2 bg-black/10"><i className="block h-full bg-black" style={{ width: `${item.score}%` }} /></span><strong className="text-right text-[8pt]">{Math.round(item.score)}</strong></div>)}</div></div>
        <div><h2 className="border-b-2 border-black pb-1 text-[10pt] font-black">진단 결과</h2><p className="mt-2 text-[7pt] font-black uppercase">유형 태그</p><p className="mt-1 text-[9pt] font-bold">{typeTags.join(" · ")}</p><p className="mt-3 text-[7pt] font-black uppercase">상위 강점</p>{strengths.map((item) => <p key={item.id} className="border-b border-black/10 py-1 text-[8pt] font-bold">{item.name} <span className="float-right">{Math.round(item.score)}</span></p>)}<p className="mt-3 text-[7pt] font-black uppercase">컨설팅 우선순위</p>{improvements.map((item, index) => <div key={item.id} className="mt-2"><p className="text-[8pt] font-black">{index+1}. {item.name}</p><p className="text-[7.5pt] leading-tight text-black/70">{item.consultingPriority}</p></div>)}</div>
      </div>
      <div className="mt-4 border-t border-black pt-2 text-[7pt]">대표 프로젝트: <strong>{scan.projectTitle}</strong> · {scan.scoringMethod} {scan.scoringVersion} · 자기평가 25% + 상황판단 35% + 포트폴리오 증거자료 40% · {scan.createdAt.toLocaleDateString("ko-KR")}</div>
    </section>
  </main>;
}
