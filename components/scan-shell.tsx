import Link from "next/link";

const steps = ["프로필", "자기평가", "상황판단", "프로젝트", "증거자료"];

export function ScanShell({ step, title, eyebrow, children }: { step: number; title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-16">
      <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-violet">{eyebrow}</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-[-0.05em] md:text-6xl">{title}</h1>
        </div>
        <p className="text-sm font-bold">{step} / {steps.length}</p>
      </div>
      <div className="mb-10 flex gap-2" aria-label="진단 진행률">
        {steps.map((label, index) => (
          <div key={label} className="flex-1">
            <div className={`h-2 rounded-full ${index < step ? "bg-ink" : "bg-black/10"}`} />
            <span className="mt-2 hidden text-[10px] font-bold uppercase tracking-wider md:block">{label}</span>
          </div>
        ))}
      </div>
      {children}
      <Link href="/" className="mt-8 inline-block text-sm font-bold underline underline-offset-4">저장하고 나가기</Link>
    </main>
  );
}
