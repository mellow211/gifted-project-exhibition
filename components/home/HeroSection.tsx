import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-surface">
      {/* Subtle Future Lab abstract background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute -top-40 right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-secondary/15 blur-3xl" />
        <div className="absolute top-1/2 left-[-15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-primary/5 blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#0B1020 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>대전교육정보원정보영재교육원</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-navy tracking-tight leading-[1.2]">
            2026 개인주제탐구발표대회 <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              온라인 전시장
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-navy-600 font-normal leading-relaxed max-w-2xl">
            대전교육정보원정보영재교육원 학생들이 스스로 질문을 던지고, 탐구하고, 실험하며 완성한 창의적 연구 산출물을 만나보세요. 
            단순한 결과물이 아닌 질문에서 성찰까지 이어지는 지적 탐구의 여정입니다.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy-800 shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5"
            >
              <span>전시 관람하기</span>
              <ArrowRight className="w-4 h-4 text-secondary" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
