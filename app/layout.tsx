import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "GIFTED PROJECT EXHIBITION | 영재 프로젝트 온라인 연구 전시관",
  description:
    "학생들이 어떤 질문에서 시작하여 탐구 과정을 거치고 실패와 성찰을 통해 새로운 가능성을 발견했는지를 만나는 디지털 연구 전시관(Digital Museum × Future Lab)입니다.",
  keywords: [
    "영재교육",
    "프로젝트기반학습",
    "탐구",
    "연구전시",
    "디지털전시관",
    "학생포트폴리오",
    "STEAM",
    "Future Lab",
  ],
  openGraph: {
    title: "GIFTED PROJECT EXHIBITION | 생각을 탐구하고 가능성을 발견하다",
    description:
      "학생들의 질문, 탐구 여정, 실패와 개선, 그리고 성찰이 담긴 2026 영재 프로젝트 디지털 연구 전시회",
    url: "https://gifted-exhibition.edu",
    siteName: "GIFTED PROJECT EXHIBITION",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "GIFTED PROJECT EXHIBITION 2026",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GIFTED PROJECT EXHIBITION | 영재 프로젝트 디지털 연구 전시관",
    description: "생각을 탐구하고 가능성을 발견하다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between bg-surface text-navy">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
