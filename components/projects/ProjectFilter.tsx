import React from "react";
import { ProjectFilterState } from "@/types/project";
import { Filter, RotateCcw, ArrowUpDown } from "lucide-react";

interface ProjectFilterProps {
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
  onReset: () => void;
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
  onReset,
}) => {
  const isFiltered =
    filters.category !== "ALL" ||
    filters.grade !== "ALL" ||
    filters.program !== "ALL" ||
    filters.year !== "ALL" ||
    filters.searchQuery !== "";

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ ...filters, category: cat.id })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-navy text-white shadow-sm"
                  : "bg-white text-navy-600 border border-surface-border hover:border-navy-300 hover:text-navy"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Secondary Dropdown Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-navy-400 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>상세 필터:</span>
          </div>

          {/* Grade */}
          <select
            value={filters.grade}
            onChange={(e) => onChange({ ...filters, grade: e.target.value })}
            className="bg-white border border-surface-border text-navy-700 py-1 px-2.5 rounded-md text-xs focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">모든 학년</option>
            <option value="중학교">중학교</option>
            <option value="고등학교">고등학교</option>
          </select>

          {/* Program */}
          <select
            value={filters.program}
            onChange={(e) => onChange({ ...filters, program: e.target.value })}
            className="bg-white border border-surface-border text-navy-700 py-1 px-2.5 rounded-md text-xs focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">모든 교육과정</option>
            <option value="심화">영재 심화과정</option>
            <option value="융합">창의융합과정</option>
            <option value="문제해결">사회문제 해결</option>
          </select>

          {/* Year */}
          <select
            value={filters.year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="bg-white border border-surface-border text-navy-700 py-1 px-2.5 rounded-md text-xs focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">모든 연도</option>
            <option value="2026">2026년</option>
            <option value="2025">2025년</option>
          </select>

          {/* Reset Filters button if any filter is active */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-navy-500 hover:text-navy text-xs underline underline-offset-2 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>필터 초기화</span>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 text-xs text-navy-600">
          <ArrowUpDown className="w-3.5 h-3.5 text-navy-400" />
          <span className="text-navy-400">정렬:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as any })
            }
            className="bg-white border border-surface-border font-medium text-navy-800 py-1 px-2.5 rounded-md text-xs focus:ring-1 focus:ring-primary"
          >
            <option value="featured">추천순 (Curation)</option>
            <option value="latest">최신순 (Latest)</option>
            <option value="title">가나다순 (Title)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
