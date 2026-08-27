import React from "react";
import { HelpCircle, Quote } from "lucide-react";

interface QuestionSectionProps {
  question: string;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({ question }) => {
  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">01</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>PROJECT QUESTION</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          우리는 이런 질문에서 시작했습니다.
        </h2>

        {/* Large Typography Inquiry Highlight Card */}
        <div className="relative bg-white rounded-2xl p-8 sm:p-10 border border-surface-border shadow-card overflow-hidden">
          <div className="absolute -top-4 -left-2 text-primary/10 select-none pointer-events-none">
            <Quote className="w-24 h-24" />
          </div>

          <div className="relative z-10">
            <p className="text-xl sm:text-2xl lg:text-3xl font-serif text-navy font-semibold leading-snug">
              &ldquo;{question}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
