"use client";

import { useRouter } from "next/navigation";
import { useScan } from "@/components/scan-provider";

export function NewScanButton() {
  const router = useRouter();
  const { reset } = useScan();
  return <button className="no-print text-sm font-black underline underline-offset-4" onClick={() => { reset(); router.push("/scan/profile"); }}>새 진단 시작하기</button>;
}
