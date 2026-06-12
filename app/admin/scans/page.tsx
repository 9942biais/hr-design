import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createResultAccessToken } from "@/lib/result-access";

export const dynamic = "force-dynamic";

export default async function AdminScansPage() {
  const scans = await prisma.scan.findMany({ orderBy: { createdAt: "desc" } });
  return <main className="mx-auto max-w-7xl px-5 py-12 md:px-10"><div className="mb-10"><p className="text-xs font-black uppercase tracking-[.2em] text-violet">관리자</p><h1 className="mt-3 text-5xl font-black tracking-[-.05em]">제출된 진단</h1><p className="mt-3 text-black/55">진단 리포트 {scans.length}건</p></div>
    <div className="overflow-x-auto rounded-3xl bg-white shadow-card"><table className="w-full min-w-[900px] text-left"><thead className="border-b border-black/10 text-xs uppercase tracking-wider text-black/45"><tr><th className="p-5">학생</th><th className="p-5">프로필</th><th className="p-5">희망 진로</th><th className="p-5">점수</th><th className="p-5">근거 상태</th><th className="p-5">제출일</th><th className="p-5"></th></tr></thead><tbody>{scans.map((scan) => <tr key={scan.id} className="border-b border-black/10 last:border-0"><td className="p-5 font-black">{scan.studentName}</td><td className="p-5 text-sm">{scan.grade} · {scan.major}</td><td className="p-5 text-sm">{scan.careerPath}</td><td className="p-5 text-xl font-black">{Math.round(scan.overallScore)}</td><td className="p-5 text-sm font-bold">{scan.evidenceStatus === "missing" ? "미제출 · 임시" : "자가 제출"}</td><td className="p-5 text-sm">{scan.createdAt.toLocaleDateString("ko-KR")}</td><td className="p-5"><Link className="font-black underline underline-offset-4" href={`/scan/result/${scan.id}?access=${encodeURIComponent(createResultAccessToken(scan.id))}`}>리포트 보기</Link></td></tr>)}</tbody></table>{scans.length === 0 && <p className="p-10 text-center text-black/45">아직 제출된 진단이 없습니다.</p>}</div>
  </main>;
}
