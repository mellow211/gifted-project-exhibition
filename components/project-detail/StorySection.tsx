import React from "react";
import { BookOpen } from "lucide-react";

interface StorySectionProps {
  summary: string;
  description: string;
}

export const StorySection: React.FC<StorySectionProps> = ({
  summary,
  description,
}) => {
  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">03</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>PROJECT STORY</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          어떻게 문제를 해결하고 탐구했나요?
        </h2>

        {/* Highlight Summary callout */}
        <div className="p-5 rounded-xl bg-navy-50 border-l-4 border-primary text-navy-800 text-sm sm:text-base font-medium leading-relaxed">
          {summary}
        </div>

        {/* Detailed Narrative */}
        <div className="bg-white rounded-2xl p-7 sm:p-9 border border-surface-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-navy text-sm font-bold">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>연구 및 개발 스토리</span>
          </div>
          <div className="text-sm sm:text-base text-navy-700 leading-loose whitespace-pre-line">
            {description}
          </div>
        </div>
      </div>
    </section>
  );
};
