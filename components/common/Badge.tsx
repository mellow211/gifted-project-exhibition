import React from "react";
import { ProjectBadge, ProjectCategory } from "@/types/project";
import { Sparkles, Lightbulb, Rocket, Compass, Layers } from "lucide-react";

interface BadgeProps {
  type?: ProjectBadge | string;
  className?: string;
  size?: "sm" | "md";
  dark?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ type, className = "", size = "sm", dark = false }) => {
  if (!type) return null;

  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3.5 py-1";

  switch (type) {
    case "CURATOR'S PICK":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
            dark
              ? "bg-primary/25 text-secondary border-secondary/40 shadow-sm"
              : "bg-primary/10 text-primary border-primary/20"
          } ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>CURATOR&apos;S PICK</span>
        </span>
      );
    case "NEW IDEA":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
            dark
              ? "bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-sm"
              : "bg-secondary/10 text-secondary-dark border-secondary/30"
          } ${sizeClasses} ${className}`}
        >
          <Lightbulb className="w-3 h-3" />
          <span>NEW IDEA</span>
        </span>
      );
    case "CREATIVE QUESTION":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
            dark
              ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/50 shadow-sm"
              : "bg-amber-50 text-amber-700 border-amber-200"
          } ${sizeClasses} ${className}`}
        >
          <Compass className="w-3 h-3" />
          <span>CREATIVE QUESTION</span>
        </span>
      );
    case "TECH CHALLENGE":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
            dark
              ? "bg-purple-500/25 text-purple-200 border-purple-400/50 shadow-sm"
              : "bg-purple-50 text-purple-700 border-purple-200"
          } ${sizeClasses} ${className}`}
        >
          <Rocket className="w-3 h-3" />
          <span>TECH CHALLENGE</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full border ${
            dark
              ? "bg-navy-800 text-navy-200 border-navy-700"
              : "bg-navy-50 text-navy-600 border-surface-border"
          } ${sizeClasses} ${className}`}
        >
          {type}
        </span>
      );
  }
};

export const CategoryTag: React.FC<{
  category: ProjectCategory | string;
  className?: string;
  dark?: boolean;
}> = ({ category, className = "", dark = false }) => {
  let colorStyle = "";

  if (dark) {
    // 다크 모드 (ProjectHero 등 어두운 배경 전용 고대비 스타일)
    if (category === "SW초급") {
      colorStyle = "bg-sky-500/25 text-sky-200 border-sky-400/60";
    } else if (category === "SW고급") {
      colorStyle = "bg-indigo-500/25 text-indigo-200 border-indigo-400/60";
    } else if (category === "로봇초급") {
      colorStyle = "bg-emerald-500/25 text-emerald-200 border-emerald-400/60";
    } else if (category === "로봇고급") {
      colorStyle = "bg-amber-500/25 text-amber-200 border-amber-400/60";
    } else if (category === "AI" || category === "AI & DATA") {
      colorStyle = "bg-purple-500/30 text-purple-200 border-purple-400/70";
    } else {
      colorStyle = "bg-navy-800 text-navy-200 border-navy-600";
    }
  } else {
    // 라이트 모드 (일반 카드/목록 전용)
    if (category === "SW초급") {
      colorStyle = "bg-sky-50 text-sky-800 border-sky-200";
    } else if (category === "SW고급") {
      colorStyle = "bg-indigo-50 text-indigo-800 border-indigo-200";
    } else if (category === "로봇초급") {
      colorStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
    } else if (category === "로봇고급") {
      colorStyle = "bg-amber-50 text-amber-900 border-amber-300";
    } else if (category === "AI" || category === "AI & DATA") {
      colorStyle = "bg-purple-50 text-purple-900 border-purple-200";
    } else {
      colorStyle = "bg-navy-50 text-navy-700 border-surface-border";
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded border shadow-sm ${colorStyle} ${className}`}
    >
      <Layers className="w-3 h-3 opacity-90" />
      <span>{category}</span>
    </span>
  );
};

