import React from "react";
import { ProjectBadge, ProjectCategory } from "@/types/project";
import { Sparkles, Lightbulb, Rocket, Compass, Layers } from "lucide-react";

interface BadgeProps {
  type?: ProjectBadge | string;
  className?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ type, className = "", size = "sm" }) => {
  if (!type) return null;

  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3.5 py-1";

  switch (type) {
    case "CURATOR'S PICK":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>CURATOR&apos;S PICK</span>
        </span>
      );
    case "NEW IDEA":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-secondary/10 text-secondary-dark border border-secondary/30 ${sizeClasses} ${className}`}
        >
          <Lightbulb className="w-3 h-3" />
          <span>NEW IDEA</span>
        </span>
      );
    case "CREATIVE QUESTION":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses} ${className}`}
        >
          <Compass className="w-3 h-3" />
          <span>CREATIVE QUESTION</span>
        </span>
      );
    case "TECH CHALLENGE":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses} ${className}`}
        >
          <Rocket className="w-3 h-3" />
          <span>TECH CHALLENGE</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-navy-50 text-navy-600 border border-surface-border ${sizeClasses} ${className}`}
        >
          {type}
        </span>
      );
  }
};

export const CategoryTag: React.FC<{ category: ProjectCategory | string; className?: string }> = ({
  category,
  className = "",
}) => {
  let colorStyle = "bg-navy-50 text-navy-700 border-surface-border";

  if (category === "AI & DATA") {
    colorStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
  } else if (category === "SOFTWARE") {
    colorStyle = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (category === "ROBOT & IoT") {
    colorStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (category === "SCIENCE") {
    colorStyle = "bg-teal-50 text-teal-800 border-teal-200";
  } else if (category === "CREATIVE") {
    colorStyle = "bg-purple-50 text-purple-800 border-purple-200";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded border ${colorStyle} ${className}`}
    >
      <Layers className="w-2.5 h-2.5 opacity-70" />
      {category}
    </span>
  );
};
