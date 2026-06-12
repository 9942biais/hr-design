"use client";

export const inputClass = "w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-violet focus:ring-4 focus:ring-violet/10";
export const buttonClass = "inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet disabled:cursor-not-allowed disabled:opacity-40";

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold">{label}</span>{children}{error && <span className="mt-1 block text-xs font-bold text-coral">{error}</span>}</label>;
}
