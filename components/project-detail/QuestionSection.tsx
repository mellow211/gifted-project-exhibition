import React from "react";
import { HelpCircle, Quote } from "lucide-react";

interface QuestionSectionProps {
  question: string;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({ question }) => {
  const cleanQuestion = question.replace(/^[“"']+|[”"']+$/g, "").trim();

  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">01</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>PROJECT QUESTION</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          우리는 이런 질문에서 시작했습니다.
        </h2>

        {/* Large Typography Inquiry Highlight Card - Centered */}
        <div className="relative bg-gradient-to-b from-white to-navy-50/40 rounded-2xl p-8 sm:p-12 border border-surface-border shadow-card overflow-hidden flex flex-col items-center justify-center">
          <div className="mb-4 text-primary/30">
            <Quote className="w-10 h-10" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-serif text-navy font-bold leading-relaxed tracking-tight break-keep [text-wrap:balance]">
              &ldquo;{cleanQuestion}&rdquo;
            </p>
          </div>

          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-6" />
        </div>
      </div>
    </section>
  );
};
