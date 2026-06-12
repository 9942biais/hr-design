"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass, inputClass } from "@/components/ui";
import { categories, evidenceItems, indicators } from "@/lib/scan-data";
import { submissionSchema } from "@/lib/schemas";

export default function EvidencePage() {
  const router = useRouter();
  const { state, update } = useScan();
  const [evidence, setEvidence] = useState(state.evidence);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError("");
    const normalized = Object.fromEntries(evidenceItems.map((item) => [item.id, evidence[item.id] ?? { checked: false, note: "" }]));
    const payload = { ...state, evidence: normalized };
    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) { setError("이전 단계에 작성하지 않은 항목이 있습니다. 해당 단계로 돌아가 확인해 주세요."); return; }
    update({ evidence: normalized });
    setSubmitting(true);
    const response = await fetch("/api/scans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "진단을 제출하지 못했습니다."); setSubmitting(false); return; }
    router.push(`/scan/result/${data.id}`);
  }

  return <ScanShell step={5} eyebrow="포트폴리오 증거자료" title="검토자가 실제로 확인할 수 있는 것은 무엇인가요?">
    <div className="space-y-8">
      {categories.map((category) => <section key={category.id} className="rounded-3xl bg-white p-6 shadow-card md:p-9"><h2 className="mb-6 text-2xl font-black">{category.name}</h2><div className="grid gap-6 md:grid-cols-3">
        {indicators.filter((indicator) => indicator.categoryId === category.id).map((indicator) => <div key={indicator.id}><h3 className="mb-3 text-sm font-black text-violet">{indicator.name}</h3><div className="space-y-3">
          {evidenceItems.filter((item) => item.indicatorId === indicator.id).map((item) => { const value = evidence[item.id] ?? { checked: false, note: "" }; return <div key={item.id} className={`rounded-xl border p-3 ${value.checked ? "border-ink bg-lime/30" : "border-black/10"}`}><label className="flex cursor-pointer gap-3 text-sm font-bold"><input type="checkbox" checked={value.checked} onChange={(event) => setEvidence((current) => ({ ...current, [item.id]: { ...value, checked: event.target.checked } }))} className="mt-1 size-4 accent-black" /><span>{item.text}</span></label>{value.checked && <input className={`${inputClass} mt-3 py-2 text-xs`} placeholder="페이지 번호 또는 메모 (선택)" value={value.note ?? ""} onChange={(event) => setEvidence((current) => ({ ...current, [item.id]: { ...value, note: event.target.value } }))} />}</div>; })}
        </div></div>)}
      </div></section>)}
      {error && <p className="rounded-xl bg-coral/10 p-4 text-sm font-bold text-coral">{error}</p>}
      <button className={buttonClass} type="button" disabled={submitting} onClick={submit}>{submitting ? "점수 계산 중..." : "진단 리포트 만들기 →"}</button>
    </div>
  </ScanShell>;
}
