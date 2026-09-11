"use client";

import React, { useEffect, useState } from "react";
import { ExhibitionStats } from "@/types/project";
import { getExhibitionStats } from "@/lib/project-service";
import { FolderGit2, Users, Lightbulb } from "lucide-react";

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<ExhibitionStats>({
    totalProjects: 85,
    totalStudents: 85,
    totalFields: 5,
  });

  useEffect(() => {
    getExhibitionStats().then(setStats);
  }, []);

  const items = [
    {
      value: stats.totalProjects,
      label: "PROJECTS",
      sub: "연구 프로젝트",
      icon: FolderGit2,
    },
    {
      value: stats.totalStudents,
      label: "STUDENTS",
      sub: "참여 영재 학생",
      icon: Users,
    },
    {
      value: stats.totalFields,
      label: "FIELDS",
      sub: "탐구 학문 분야",
      icon: Lightbulb,
    },
  ];

  return (
    <section className="bg-white border-y border-surface-border py-10 shadow-subtle">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-surface-border">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex flex-col items-center text-center ${
                  idx > 0 ? "pt-4 md:pt-0" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-primary opacity-80" />
                  <span className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight font-mono">
                    {item.value}
                  </span>
                </div>
                <span className="text-xs font-bold tracking-widest text-navy uppercase">
                  {item.label}
                </span>
                <span className="text-[11px] text-navy-400 mt-0.5">{item.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
