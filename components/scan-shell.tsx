import Link from "next/link";

const steps = [
  { label: "프로필", href: "/scan/profile" },
  { label: "자기평가", href: "/scan/self-assessment" },
  { label: "상황판단", href: "/scan/situational-judgment" },
  { label: "프로젝트", href: "/scan/project" },
  { label: "증거자료", href: "/scan/evidence" },
];

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
        {steps.map(({ label, href }, index) => (
          <Link key={label} href={href} className="min-w-0 flex-1" aria-current={index + 1 === step ? "step" : undefined}>
            <div className={`h-2 rounded-full ${index < step ? "bg-ink" : "bg-black/10"}`} />
            <span className={`mt-2 hidden text-[10px] font-bold uppercase tracking-wider md:block ${index + 1 === step ? "text-violet" : ""}`}>{label}</span>
          </Link>
        ))}
      </div>
      {children}
      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-bold">
        {step > 1 && <Link href={steps[step - 2].href} className="underline underline-offset-4">← 이전 단계</Link>}
        <Link href="/" className="underline underline-offset-4">저장하고 나가기</Link>
        <span className="text-black/45" role="status">입력 내용은 자동 저장됩니다.</span>
      </div>
    </main>
  );
}
