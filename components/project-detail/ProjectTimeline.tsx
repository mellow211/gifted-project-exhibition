import React from "react";
import { ProjectProcess } from "@/types/project";
import { Milestone, CheckCircle2 } from "lucide-react";

interface ProjectTimelineProps {
  processes?: ProjectProcess[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ processes = [] }) => {
  if (!processes || processes.length === 0) return null;

  const sortedProcesses = [...processes].sort((a, b) => a.display_order - b.display_order);

  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
          <span className="font-mono text-primary font-extrabold">03</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>OUR JOURNEY</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy">
            아이디어에서 완성까지의 탐구 여정
          </h2>
          <p className="text-sm text-navy-500 mt-1">
            가설 설정, 실험과 실패, 피드백을 반영한 개선 단계를 기록한 타임라인입니다.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-secondary before:to-primary">
          {sortedProcesses.map((step, index) => {
            return (
              <div key={step.id || index} className="relative group">
                {/* Milestone Node */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-primary group-hover:border-secondary flex items-center justify-center text-[11px] font-bold font-mono text-navy shadow-sm transition-colors">
                  {index + 1}
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-surface-border shadow-subtle hover:shadow-card card-hover-effect transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                        STEP {index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-navy">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-navy-600 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Optional Step Visual image */}
                  {step.image_url && (
                    <div className="rounded-lg overflow-hidden border border-surface-border max-h-56 w-full max-w-lg bg-navy-900">
                      <img
                        src={step.image_url}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
