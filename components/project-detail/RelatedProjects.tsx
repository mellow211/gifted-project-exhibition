"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { getRelatedProjects } from "@/lib/project-service";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Compass, ArrowRight } from "lucide-react";

interface RelatedProjectsProps {
  currentSlug: string;
  category: string;
  tags?: string[];
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({
  currentSlug,
  category,
  tags = [],
}) => {
  const [related, setRelated] = useState<Project[]>([]);

  useEffect(() => {
    getRelatedProjects(currentSlug, category, tags).then(setRelated);
  }, [currentSlug, category, tags]);

  if (related.length === 0) return null;

  return (
    <section className="py-14">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>MORE TO EXPLORE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">
              다른 프로젝트도 만나보세요
            </h2>
            <p className="text-xs text-navy-500 mt-0.5">
              비슷한 관심사와 질문을 탐구한 학생들의 다른 작품들입니다.
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <span>전체 전시 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
