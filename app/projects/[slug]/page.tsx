import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectBySlug, getAllProjects } from "@/lib/project-service";
import { ProjectHero } from "@/components/project-detail/ProjectHero";
import { QuestionSection } from "@/components/project-detail/QuestionSection";
import { WhySection } from "@/components/project-detail/WhySection";
import { StorySection } from "@/components/project-detail/StorySection";
import { ProjectTimeline } from "@/components/project-detail/ProjectTimeline";
import { ProjectArchive } from "@/components/project-detail/ProjectArchive";
import { ReflectionSection } from "@/components/project-detail/ReflectionSection";
import { ReactionBar } from "@/components/project-detail/ReactionBar";
import { RelatedProjects } from "@/components/project-detail/RelatedProjects";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return {
      title: "프로젝트를 찾을 수 없습니다 | GIFTED PROJECT EXHIBITION",
    };
  }

  return {
    title: `${project.title} | GIFTED PROJECT EXHIBITION`,
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

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-surface">
      {/* 00 Hero Banner Header */}
      <ProjectHero project={project} />

      {/* Main Exhibition Narrative Flow Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        {/* 01 PROJECT QUESTION */}
        <QuestionSection question={project.question} />

        {/* 02 WHY */}
        <WhySection motivation={project.motivation} />

        {/* 03 PROJECT STORY */}
        <StorySection
          summary={project.summary}
          description={project.description}
        />

        {/* 04 OUR JOURNEY (Timeline) */}
        <ProjectTimeline processes={project.processes} />

        {/* 05 PROJECT ARCHIVE (Report, Slides, Video, Demo) */}
        <ProjectArchive project={project} />

        {/* 06 LEARNING & REFLECTION (What We Learned & Next Question) */}
        <ReflectionSection
          reflection={project.reflection}
          nextQuestion={project.next_question}
        />

        {/* 07 VISITOR REACTION */}
        <ReactionBar projectId={project.id} />

        {/* 08 MORE TO EXPLORE */}
        <RelatedProjects
          currentSlug={project.slug}
          category={project.category}
          tags={project.tags}
        />
      </div>
    </article>
  );
}
