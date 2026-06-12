"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass, inputClass } from "@/components/ui";
import { categories, evidenceItems, indicators } from "@/lib/scan-data";
import { getSubmissionIssues, submissionSchema, type SubmissionSection } from "@/lib/schemas";

const sectionInfo: Record<SubmissionSection, { label: string; href: string }> = {
  profile: { label: "프로필", href: "/scan/profile" },
  self: { label: "자기평가", href: "/scan/self-assessment" },
  situational: { label: "상황판단", href: "/scan/situational-judgment" },
  project: { label: "대표 프로젝트", href: "/scan/project" },
  evidence: { label: "증거자료", href: "/scan/evidence" },
};

export default function EvidencePage() {
  const router = useRouter();
  const { state, update, ready } = useScan();
  const [evidence, setEvidence] = useState(state.evidence);
  const [source, setSource] = useState("");
  const [issues, setIssues] = useState<{ section: SubmissionSection; field: string; message: string }[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setEvidence(state.evidence);
    setSource(Object.values(state.evidence).find((item) => item.source)?.source ?? "");
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    update({ evidence });
  }, [evidence, ready, update]);

  async function submit() {
    setError("");
    setIssues([]);
    const normalized = Object.fromEntries(evidenceItems.map((item) => [item.id, {
      ...(evidence[item.id] ?? { checked: false, note: "" }),
      note: evidence[item.id]?.note?.trim() ?? "",
      source: source.trim(),
    }]));
    const payload = { ...state, evidence: normalized };
    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) { setIssues(getSubmissionIssues(payload)); return; }
    update({ evidence: normalized });
    setSubmitting(true);
    const response = await fetch("/api/scans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "진단을 제출하지 못했습니다."); setSubmitting(false); return; }
    router.push(`/scan/result/${data.id}?access=${encodeURIComponent(data.accessToken)}`);
  }

  return <ScanShell step={5} eyebrow="포트폴리오 증거자료" title="검토자가 실제로 확인할 수 있는 것은 무엇인가요?">
    <div className="space-y-8">
      <section className="rounded-3xl bg-ink p-6 text-white shadow-card md:p-9">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-lime">v1 · 수동 증거 체크</p>
        <h2 className="mt-2 text-2xl font-black">포트폴리오 자료 링크 또는 파일명</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">현재 버전은 PDF 파일을 업로드하거나 자동 분석하지 않습니다. 검토할 자료의 링크 또는 파일명을 적고, 실제로 확인 가능한 항목만 선택하세요.</p>
        <input className={`${inputClass} mt-5 border-white/20 bg-white text-ink`} placeholder="예: https://portfolio.example.com 또는 portfolio.pdf" value={source} onChange={(event) => {
          const nextSource = event.target.value;
          setSource(nextSource);
          setEvidence((current) => Object.fromEntries(evidenceItems.map((item) => [
            item.id,
            { ...(current[item.id] ?? { checked: false, note: "" }), source: nextSource },
          ])));
        }} />
        <p className="mt-3 text-xs font-bold text-white/55">아무 항목도 선택하지 않으면 리포트는 증거자료가 없는 임시 결과로 표시됩니다.</p>
      </section>
      {categories.map((category) => <section key={category.id} className="rounded-3xl bg-white p-6 shadow-card md:p-9"><h2 className="mb-6 text-2xl font-black">{category.name}</h2><div className="grid gap-6 md:grid-cols-3">
        {indicators.filter((indicator) => indicator.categoryId === category.id).map((indicator) => <div key={indicator.id}><h3 className="mb-3 text-sm font-black text-violet">{indicator.name}</h3><div className="space-y-3">
          {evidenceItems.filter((item) => item.indicatorId === indicator.id).map((item) => { const value = evidence[item.id] ?? { checked: false, note: "" }; return <div key={item.id} className={`rounded-xl border p-3 ${value.checked ? "border-ink bg-lime/30" : "border-black/10"}`}><label className="flex cursor-pointer gap-3 text-sm font-bold"><input type="checkbox" checked={value.checked} onChange={(event) => setEvidence((current) => ({ ...current, [item.id]: { ...value, checked: event.target.checked } }))} className="mt-1 size-4 accent-black" /><span>{item.text}</span></label>{value.checked && <input className={`${inputClass} mt-3 py-2 text-xs`} placeholder="페이지·장면·구간 또는 메모 (선택)" value={value.note ?? ""} onChange={(event) => setEvidence((current) => ({ ...current, [item.id]: { ...value, note: event.target.value } }))} />}</div>; })}
        </div></div>)}
      </div></section>)}
      {issues.length > 0 && <section className="rounded-2xl border border-coral/30 bg-coral/10 p-5" aria-live="polite">
        <h2 className="font-black text-coral">완료하지 못한 단계가 있습니다.</h2>
        <p className="mt-1 text-sm text-black/65">아래 단계에서 표시된 입력을 확인한 뒤 다시 시도해 주세요.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[...new Set(issues.map((issue) => issue.section))].map((section) => <Link key={section} href={sectionInfo[section].href} className="rounded-full bg-white px-4 py-2 text-sm font-black text-coral shadow-sm">{sectionInfo[section].label} 확인하기 →</Link>)}
        </div>
      </section>}
      {error && <p className="rounded-xl bg-coral/10 p-4 text-sm font-bold text-coral">{error}</p>}
      <button className={buttonClass} type="button" disabled={submitting} onClick={submit}>{submitting ? "점수 계산 중..." : "진단 리포트 만들기 →"}</button>
    </div>
  </ScanShell>;
}
