"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { Badge, CategoryTag } from "@/components/common/Badge";
import { ArrowRight, User } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imgSrc, setImgSrc] = useState<string>(project.thumbnail_url);
  const [hasFallback, setHasFallback] = useState(false);

  const handleImageError = () => {
    if (!hasFallback && project.poster_url) {
      setHasFallback(true);
      setImgSrc(project.poster_url);
    } else {
      const catFallbacks: Record<string, string> = {
        AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        로봇초급: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
        로봇고급: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
        SW초급: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        SW고급: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      };
      setImgSrc(catFallbacks[project.category] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80");
    }
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group bg-white rounded-xl border border-surface-border overflow-hidden shadow-subtle hover:shadow-hover card-hover-effect flex flex-col justify-between"
    >
      <div>
        {/* Aspect-ratio fixed thumbnail */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900 image-zoom-container">
          <img
            src={imgSrc}
            alt={project.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges in top corners */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <CategoryTag category={project.category} className="bg-white/90 backdrop-blur-md" />
            {project.badge && (
              <Badge type={project.badge} className="bg-white/90 backdrop-blur-md" />
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-navy-400">
            <User className="w-3 h-3 text-secondary-dark" />
            <span className="truncate">
              {project.team_name ? `${project.team_name} · ` : ""}
              {project.student_display_names.join(", ")}
            </span>
          </div>

          <h3 className="font-bold text-base text-navy group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {project.title}
          </h3>

          <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Footer Area with Tags and CTA */}
      <div className="px-5 pb-4 pt-2 border-t border-surface-border/60 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-navy-400 bg-surface-muted px-1.5 py-0.5 rounded"
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
    </Link>
  );
};
