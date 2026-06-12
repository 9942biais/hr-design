"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScanShell } from "@/components/scan-shell";
import { useScan } from "@/components/scan-provider";
import { buttonClass, Field, inputClass } from "@/components/ui";
import { profileSchema, type ProfileData } from "@/lib/schemas";

export default function ProfilePage() {
  const router = useRouter();
  const { state, update, ready } = useScan();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileData>({ resolver: zodResolver(profileSchema), defaultValues: state.profile });
  useEffect(() => { if (ready) reset(state.profile); }, [ready, reset, state.profile]);

  return <ScanShell step={1} eyebrow="학생 프로필" title="먼저, 현재의 나를 알려주세요.">
    <form onSubmit={handleSubmit((profile) => { update({ profile }); router.push("/scan/self-assessment"); })} className="rounded-3xl bg-white p-6 shadow-card md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="이름" error={errors.studentName?.message}><input className={inputClass} {...register("studentName")} placeholder="이름" /></Field>
        <Field label="학년" error={errors.grade?.message}><select className={inputClass} {...register("grade")}><option>3학년</option><option>4학년</option></select></Field>
        <Field label="전공" error={errors.major?.message}><input className={inputClass} {...register("major")} placeholder="시각디자인" /></Field>
        <Field label="희망 진로" error={errors.careerPath?.message}><input className={inputClass} {...register("careerPath")} placeholder="브랜드 디자이너, UX 디자이너 등" /></Field>
        <Field label="이메일 (선택)" error={errors.email?.message}><input className={inputClass} {...register("email")} placeholder="you@example.com" /></Field>
      </div>
      <button className={`${buttonClass} mt-8`} type="submit">자기평가로 계속하기 →</button>
    </form>
  </ScanShell>;
}
