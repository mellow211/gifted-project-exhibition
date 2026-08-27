import React from "react";
import { Compass } from "lucide-react";

interface WhySectionProps {
  motivation: string;
}

export const WhySection: React.FC<WhySectionProps> = ({ motivation }) => {
  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">02</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>WHY</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-navy">
          왜 이 주제를 선택했나요?
        </h2>

        <div className="bg-white rounded-2xl p-7 sm:p-8 border border-surface-border shadow-subtle">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary flex-shrink-0 mt-1">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-navy">탐구 동기 및 문제의식</h3>
              <p className="text-sm sm:text-base text-navy-700 leading-relaxed">
                {motivation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
