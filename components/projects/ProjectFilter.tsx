import React from "react";
import { ProjectFilterState } from "@/types/project";

interface ProjectFilterProps {
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
  onReset?: () => void;
}

const CATEGORIES = [
  { id: "ALL", label: "전체 전시" },
  { id: "SW초급", label: "SW초급" },
  { id: "SW고급", label: "SW고급" },
  { id: "로봇초급", label: "로봇초급" },
  { id: "로봇고급", label: "로봇고급" },
  { id: "AI", label: "AI" },
];

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isSelected = filters.category === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange({ ...filters, category: cat.id })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? "bg-navy text-white shadow-sm"
                : "bg-surface text-navy-600 border border-surface-border hover:border-navy-300 hover:text-navy hover:bg-white"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};

