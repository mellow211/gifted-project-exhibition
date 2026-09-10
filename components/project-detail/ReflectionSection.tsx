import React from "react";
import { GraduationCap, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

interface ReflectionSectionProps {
  reflection?: string;
  nextQuestion?: string;
}

export const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  reflection,
  nextQuestion,
}) => {
  if (!reflection && !nextQuestion) return null;

  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-1">
            <span className="font-mono text-primary font-extrabold">04</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>LEARNING & REFLECTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy">
            학생 연구자의 성찰과 새로운 질문
          </h2>
          <p className="text-sm text-navy-500 mt-1">
            하나의 탐구 결과는 끝이 아닌 또 다른 질문의 시작입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: WHAT WE LEARNED */}
          {reflection && (
            <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-card flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary-light text-secondary-dark text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>WHAT WE LEARNED</span>
                </div>
                <h3 className="text-lg font-bold text-navy">
                  프로젝트를 통해 무엇을 배웠나요?
                </h3>
                <p className="text-sm text-navy-700 leading-relaxed">
                  {reflection}
                </p>
              </div>

              <div className="pt-4 border-t border-surface-border text-xs text-navy-400 font-medium">
                연구 경험 및 협업의 가치 체득
              </div>
            </div>
          )}

          {/* Card 2: NEXT QUESTION (Visually Emphasized Future Lab style) */}
          {nextQuestion && (
            <div className="bg-gradient-to-br from-navy to-navy-800 text-white rounded-2xl p-7 border border-navy-700 shadow-card flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary-light border border-primary/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>NEXT QUESTION</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  다시 탐구한다면 어떤 질문을 던질까요?
                </h3>
                <p className="text-sm text-navy-200 leading-relaxed font-serif">
                  &ldquo;{nextQuestion}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-navy-700 text-xs text-secondary font-medium flex items-center gap-1">
                <span>차세대 연구 확장 과제</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
