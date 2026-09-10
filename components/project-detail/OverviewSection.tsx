import React from "react";
import { Lightbulb, Cpu, CheckCircle2 } from "lucide-react";

interface OverviewSectionProps {
  motivation: string;
  summary: string;
  description?: string;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  motivation,
  summary,
  description,
}) => {
  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">02</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>MOTIVATION & OVERVIEW</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          탐구 동기 및 프로젝트 개요
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Motivation */}
          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-subtle flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <span>왜 이 탐구를 시작했나요?</span>
              </div>
              <p className="text-sm sm:text-base text-navy-700 leading-relaxed">
                {motivation}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-navy-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
              <span>일상 속 문제의식에서 시작된 탐구</span>
            </div>
          </div>

          {/* Card 2: Overview & Goal */}
          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-subtle flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-secondary-dark font-bold text-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary-light flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-secondary-dark" />
                </div>
                <span>무엇을 탐구하고 개발했나요?</span>
              </div>
              <p className="text-sm sm:text-base text-navy-700 leading-relaxed">
                {summary || description}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-navy-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>실제 문제 해결을 위한 컴퓨팅 구현 및 실증</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
