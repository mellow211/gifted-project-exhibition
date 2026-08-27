"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { getFeaturedProjects } from "@/lib/project-service";
import { Badge, CategoryTag } from "@/components/common/Badge";
import { ArrowRight, Sparkles, User, Tag } from "lucide-react";

export const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-navy-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-navy-100 rounded-xl animate-pulse" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-28 bg-navy-100 rounded-xl animate-pulse" />
            <div className="h-28 bg-navy-100 rounded-xl animate-pulse" />
            <div className="h-28 bg-navy-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  const heroProject = projects[0];
  const subProjects = projects.slice(1, 4);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FEATURED PROJECTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            주목할 프로젝트
          </h2>
          <p className="text-sm text-navy-500 mt-1 max-w-xl">
            색다른 질문과 새로운 시도가 돋보이는 프로젝트를 만나보세요.
          </p>
        </div>

        <Link
          href="/projects"
          className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors group"
        >
          <span>전체 프로젝트 보기</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Editorial Grid: 1 Hero + 3 Sub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Large Hero Project Card (7 Cols) */}
        {heroProject && (
          <Link
            href={`/projects/${heroProject.slug}`}
            className="lg:col-span-7 group bg-white rounded-2xl border border-surface-border overflow-hidden shadow-card hover:shadow-hover card-hover-effect flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900">
              <img
                src={heroProject.thumbnail_url}
                alt={heroProject.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <CategoryTag category={heroProject.category} className="bg-white/90 backdrop-blur-md" />
                <Badge type={heroProject.badge || "CURATOR'S PICK"} className="bg-white/90 backdrop-blur-md" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 text-xs text-navy-200 mb-1">
                  <User className="w-3.5 h-3.5 text-secondary" />
                  <span>{heroProject.team_name ? `${heroProject.team_name} · ` : ""}{heroProject.student_display_names.join(", ")}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-secondary transition-colors line-clamp-2">
                  {heroProject.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-navy-600 text-sm leading-relaxed line-clamp-2">
                {heroProject.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-surface-border">
                <div className="flex flex-wrap gap-1.5">
                  {heroProject.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-navy-500 bg-surface-muted px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                  <span>프로젝트 관람하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* 3 Secondary Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {subProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group bg-white rounded-xl border border-surface-border p-4 shadow-subtle hover:shadow-card card-hover-effect flex gap-4 items-center"
            >
              <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-navy-900">
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CategoryTag category={project.category} />
                  {project.badge && <Badge type={project.badge} />}
                </div>

                <h4 className="font-bold text-sm text-navy group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h4>

                <p className="text-xs text-navy-400 line-clamp-1">
                  {project.team_name ? `${project.team_name} · ` : ""}
                  {project.student_display_names.join(", ")}
                </p>

                <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  <span>관람하기</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
