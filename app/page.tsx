import Link from "next/link";

const categories = [
  ["01", "사고하기", "올바른 문제를 정의하고 인사이트를 콘셉트로 전환합니다."],
  ["02", "만들기", "시각적 완성도와 시스템, 설득력 있는 결과물을 만듭니다."],
  ["03", "소통하기", "포트폴리오를 편집하고 디자인 결정을 설명합니다."],
  ["04", "일하기", "과정을 주도하고 개선하며 효과적으로 협업합니다."],
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.25fr_.75fr] md:px-10">
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-violet">포트폴리오 진단 / 15–20분</p>
          <h1 className="text-6xl font-black leading-[.93] tracking-[-0.075em] md:text-[7rem]">당신의 포트폴리오는 무엇을 말하고 있나요?</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/65">디자인 전공 3·4학년을 위한 투명한 진단 도구입니다. 포트폴리오 역량 12가지를 측정하고, 강점과 집중적으로 개선할 지점을 확인하세요.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="/scan/profile" className="rounded-full bg-ink px-8 py-4 text-sm font-black text-white hover:bg-violet">표준 진단 시작하기</Link>
            <span className="text-sm font-bold">48개 응답 + 프로젝트 증거자료</span>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md rounded-full border-[22px] border-ink bg-lime p-10 shadow-card">
          <div className="flex h-full flex-col items-center justify-center rounded-full border border-ink/20 text-center">
            <span className="text-8xl font-black tracking-[-0.08em]">12</span>
            <span className="max-w-32 text-xs font-black uppercase tracking-[0.18em]">포트폴리오 핵심 지표</span>
          </div>
        </div>
      </section>
      <section className="bg-ink px-5 py-12 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden rounded-2xl bg-white/20 md:grid-cols-4">
          {categories.map(([number, title, copy]) => <article key={title} className="bg-ink p-7"><span className="text-xs font-black text-lime">{number}</span><h2 className="mt-8 text-2xl font-black">{title}</h2><p className="mt-3 text-sm leading-relaxed text-white/55">{copy}</p></article>)}
        </div>
      </section>
    </main>
  );
}
