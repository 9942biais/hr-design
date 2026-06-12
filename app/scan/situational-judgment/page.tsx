"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass } from "@/components/ui";
import { indicators, situationalQuestions } from "@/lib/scan-data";

export default function SituationalJudgmentPage() {
  const router = useRouter();
  const { state, update, ready } = useScan();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string, string>>({ defaultValues: state.situational });
  useEffect(() => { if (ready) reset(state.situational); }, [ready, reset, state.situational]);

  return <ScanShell step={3} eyebrow="12개 디자인 상황" title="이 상황에서 어떻게 하겠습니까?">
    <form onSubmit={handleSubmit((situational) => { update({ situational }); router.push("/scan/project"); })} className="space-y-5">
      {situationalQuestions.map((question) => <fieldset key={question.id} className="rounded-3xl bg-white p-6 shadow-card md:p-8">
        <legend className="w-full"><span className="text-xs font-black uppercase tracking-wider text-violet">{String(question.order).padStart(2,"0")} · {indicators.find((item) => item.id === question.indicatorId)?.name}</span><span className="mt-2 block text-xl font-black leading-snug">{question.prompt}</span></legend>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {question.options.map((option) => <label key={option.id} className="cursor-pointer"><input className="peer sr-only" type="radio" value={option.id} {...register(question.id, { required: true })} /><span className="flex min-h-16 items-center rounded-xl border border-black/15 px-4 py-3 text-sm font-semibold peer-checked:border-ink peer-checked:bg-lime">{option.text}</span></label>)}
        </div>
        {errors[question.id] && <p className="mt-2 text-xs font-bold text-coral">나의 접근 방식과 가장 가까운 응답을 선택해 주세요.</p>}
      </fieldset>)}
      <button className={buttonClass} type="submit">대표 프로젝트로 계속하기 →</button>
    </form>
  </ScanShell>;
}
