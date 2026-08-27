"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { Badge, CategoryTag } from "@/components/common/Badge";
import { ArrowLeft, Share2, Check, User, Calendar, BookOpen } from "lucide-react";

interface ProjectHeroProps {
  project: Project;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: `${project.title} | 영재 프로젝트 디지털 전시관`,
            text: project.summary,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
      } catch {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="bg-navy text-white pt-28 pb-16 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Navigation Breadcrumb & Share */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>전체 프로젝트 갤러리로 돌아가기</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-medium text-navy-200 hover:text-white border border-navy-700 transition-colors shadow-subtle"
            aria-label="전시 프로젝트 공유하기"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-secondary" />
                <span className="text-secondary">링크가 복사되었습니다!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>공유하기</span>
              </>
            )}
          </button>
        </div>

        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <CategoryTag category={project.category} className="bg-navy-800 text-white border-navy-700" />
          {project.badge && <Badge type={project.badge} className="bg-navy-800 text-white border-navy-700" />}
          <span className="text-xs text-navy-300 ml-1 font-mono">
            {project.year} · {project.program}
          </span>
        </div>

        {/* Project Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {project.title}
        </h1>

        {/* Subtitle / Question highlight */}
        {project.subtitle && (
          <p className="text-lg sm:text-xl text-navy-200 font-medium leading-relaxed mb-6">
            {project.subtitle}
          </p>
        )}

        {/* Student display names & Grade */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-navy-300 pt-2 border-t border-navy-800">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-secondary" />
            <span>
              <strong>연구진:</strong> {project.team_name ? `[${project.team_name}] ` : ""}
              {project.student_display_names.join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-navy-400" />
            <span>{project.grade}</span>
          </div>
        </div>

        {/* Main Hero Image */}
        <div className="mt-8 rounded-2xl overflow-hidden border border-navy-700 shadow-glass aspect-[16/9] w-full max-h-[460px] bg-navy-900">
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
