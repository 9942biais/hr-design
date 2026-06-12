import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-10">
      <Link href="/" className="font-black tracking-[-0.04em]">DESIGNER INBODY</Link>
      <nav className="flex gap-5 text-xs font-bold uppercase tracking-[0.14em]">
        <Link href="/scan/profile">진단 시작</Link>
        <Link href="/admin/scans">관리자</Link>
      </nav>
    </header>
  );
}
