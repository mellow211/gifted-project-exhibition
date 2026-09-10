import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug } from "@/lib/project-service";
import { ProjectHero } from "@/components/project-detail/ProjectHero";
import { QuestionSection } from "@/components/project-detail/QuestionSection";
import { OverviewSection } from "@/components/project-detail/OverviewSection";
import { ProjectTimeline } from "@/components/project-detail/ProjectTimeline";
import { ReflectionSection } from "@/components/project-detail/ReflectionSection";
import { ProjectArchive } from "@/components/project-detail/ProjectArchive";
import { RelatedProjects } from "@/components/project-detail/RelatedProjects";
import { EyeOff } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    preview?: string;
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const isPreview = searchParams?.preview === "true";
  const project = await getProjectBySlug(params.slug, isPreview);
  if (!project || (!project.published && !isPreview)) {
    return {
      title: "프로젝트를 찾을 수 없습니다 | 대전교육정보원 정보영재교육원",
    };
  }

  return {
    title: `${project.title} | 대전교육정보원 정보영재교육원 개인주제탐구발표대회`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | 2026 영재 연구 전시관`,
      description: project.summary,
      images: [
        {
          url: project.thumbnail_url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectDetailPage({ params, searchParams }: PageProps) {
  const isPreview = searchParams?.preview === "true";
  const project = await getProjectBySlug(params.slug, isPreview);

  // 비공개 프로젝트이고 관리자 미리보기 모드가 아니면 404 Not Found 처리
  if (!project || (!project.published && !isPreview)) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-surface">
      {/* 관리자 비공개 미리보기 알림 배너 */}
      {isPreview && !project.published && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 text-xs font-semibold sticky top-16 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                [관리자 미리보기 모드] 이 프로젝트는 현재 <strong>비공개</strong> 상태입니다. 일반 관람객에게는 노출되지 않습니다.
              </span>
            </div>
            <a
              href="/admin"
              className="inline-flex items-center px-2.5 py-1 rounded bg-amber-200/70 hover:bg-amber-200 text-amber-950 font-bold transition-colors whitespace-nowrap text-[11px]"
            >
              관리자 콘솔로 복귀
            </a>
          </div>
        </div>
      )}

      {/* 00 Hero Banner Header */}
      <ProjectHero project={project} />

      {/* Main Exhibition Narrative Flow Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        {/* 01 PROJECT QUESTION (가운데 정렬) */}
        <QuestionSection question={project.question} />

        {/* 02 MOTIVATION & OVERVIEW (동기 및 프로젝트 개요 통합) */}
        <OverviewSection
          motivation={project.motivation}
          summary={project.summary}
          description={project.description}
        />

        {/* 03 OUR JOURNEY (Timeline) */}
        <ProjectTimeline processes={project.processes} />

        {/* 04 LEARNING & REFLECTION (배운 점과 새로운 질문) */}
        <ReflectionSection
          reflection={project.reflection}
          nextQuestion={project.next_question}
        />

        {/* 05 PROJECT ARCHIVE (스크롤 없는 A4 포스터 & 보고서 뷰어) */}
        <ProjectArchive project={project} />

        {/* 06 MORE TO EXPLORE */}
        <RelatedProjects
          currentSlug={project.slug}
          category={project.category}
          tags={project.tags}
        />
      </div>
    </article>
  );
}
