"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass, Field, inputClass } from "@/components/ui";
import { projectSchema, type ProjectData } from "@/lib/schemas";

export default function ProjectPage() {
  const router = useRouter();
  const { state, update, ready } = useScan();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectData>({ resolver: zodResolver(projectSchema), defaultValues: state.project });
  useEffect(() => { if (ready) reset(state.project); }, [ready, reset, state.project]);
  const area = `${inputClass} min-h-28 resize-y`;

  return <ScanShell step={4} eyebrow="대표 프로젝트" title="나를 가장 잘 보여주는 프로젝트를 선택하세요.">
    <form onSubmit={handleSubmit((project) => { update({ project }); router.push("/scan/evidence"); })} className="space-y-6 rounded-3xl bg-white p-6 shadow-card md:p-10">
      <Field label="프로젝트 제목" error={errors.projectTitle?.message}><input className={inputClass} {...register("projectTitle")} /></Field>
      <Field label="어떤 프로젝트였으며 왜 중요했나요?" error={errors.projectSummary?.message}><textarea className={area} {...register("projectSummary")} /></Field>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="나의 역할과 주도한 부분" error={errors.projectRole?.message}><textarea className={area} {...register("projectRole")} /></Field>
        <Field label="가장 어려웠던 디자인 과제" error={errors.projectChallenge?.message}><textarea className={area} {...register("projectChallenge")} /></Field>
      </div>
      <Field label="결과, 배운 점 또는 영향" error={errors.projectOutcome?.message}><textarea className={area} {...register("projectOutcome")} /></Field>
      <button className={buttonClass} type="submit">증거자료로 계속하기 →</button>
    </form>
  </ScanShell>;
}
