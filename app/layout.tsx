import type { Metadata } from "next";
import "./globals.css";
import { ScanProvider } from "@/components/scan-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Designer InBody Standard Scan",
  description: "디자인 전공 학부생을 위한 결정론적 포트폴리오 진단 도구입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><ScanProvider><SiteHeader />{children}</ScanProvider></body></html>;
}
