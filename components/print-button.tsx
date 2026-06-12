"use client";

export function PrintButton() {
  return <button onClick={() => window.print()} className="no-print rounded-full bg-ink px-6 py-3 text-sm font-black text-white hover:bg-violet">인쇄 / PDF 저장</button>;
}
