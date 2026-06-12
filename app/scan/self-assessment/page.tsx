"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass } from "@/components/ui";
import { categories, indicators, selfQuestions } from "@/lib/scan-data";

export default function SelfAssessmentPage() {
  const router = useRouter();
  const { state, update, ready } = useScan();
  const stringValues = Object.fromEntries(Object.entries(state.self).map(([key, value]) => [key, String(value)]));
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Record<string, string>>({ defaultValues: stringValues });
  useEffect(() => {
    if (ready) reset(Object.fromEntries(Object.entries(state.self).map(([key, value]) => [key, String(value)])));
  }, [ready, reset]);
  useEffect(() => {
    if (!ready) return;
    const subscription = watch((self) => {
      const normalized = Object.fromEntries(
        Object.entries(self).filter(([, value]) => value !== undefined).map(([key, value]) => [key, Number(value)]),
      );
      update({ self: normalized });
    });
    return () => subscription.unsubscribe();
  }, [ready, update, watch]);

  return <ScanShell step={2} eyebrow="36개 자기평가 문항" title="평소 어떻게 디자인하나요?">
    <form onSubmit={handleSubmit((self) => { update({ self: Object.fromEntries(Object.entries(self).map(([key, value]) => [key, Number(value)])) }); router.push("/scan/situational-judgment"); })} className="space-y-8">
      {categories.map((category) => <section key={category.id} className="rounded-3xl bg-white p-6 shadow-card md:p-9">
        <div className="mb-6 flex items-baseline justify-between"><h2 className="text-2xl font-black">{category.name}</h2><span className="text-xs font-bold text-black/45">1 전혀 그렇지 않다 / 5 매우 그렇다</span></div>
        <div className="space-y-7">
          {selfQuestions.filter((question) => indicators.some((indicator) => indicator.id === question.indicatorId && indicator.categoryId === category.id)).map((question) =>
            <fieldset key={question.id} className="border-t border-black/10 pt-5">
              <legend className="mb-4 pr-4 text-sm font-bold"><span className="mr-2 text-violet">{question.order}.</span>{question.text}</legend>
              <div className="grid grid-cols-5 gap-2">
                {[1,2,3,4,5].map((value) => <label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" value={String(value)} {...register(question.id, { required: true })} /><span className="flex h-11 items-center justify-center rounded-xl border border-black/15 font-black peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white">{value}</span></label>)}
              </div>
              {errors[question.id] && <p className="mt-2 text-xs font-bold text-coral">응답을 하나 선택해 주세요.</p>}
            </fieldset>)}
        </div>
      </section>)}
      <button className={buttonClass} type="submit">상황판단으로 계속하기 →</button>
    </form>
  </ScanShell>;
}
