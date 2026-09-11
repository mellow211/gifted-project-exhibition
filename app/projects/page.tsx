"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Project, ProjectFilterState } from "@/types/project";
import { getAllProjects, filterProjects } from "@/lib/project-service";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SearchBar } from "@/components/projects/SearchBar";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { LayoutGrid, Sparkles, FolderSearch, RotateCcw } from "lucide-react";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";

  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ProjectFilterState>({
    searchQuery: "",
    category: initialCategory,
    grade: "ALL",
    program: "ALL",
    year: "ALL",
    sortBy: "title",
  });

  useEffect(() => {
    getAllProjects().then((data) => {
      setAllProjects(data);
      setLoading(false);
    });
  }, []);

  // Update filter when query param changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    return filterProjects(allProjects, filters);
  }, [allProjects, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      category: "ALL",
      grade: "ALL",
      program: "ALL",
      year: "ALL",
      sortBy: "title",
    });
  };

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-border">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>PROJECT GALLERY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
            학생들의 질문과 탐구를 만나보세요
          </h1>
          <p className="text-sm text-navy-500">
            과정별 학생 연구 결과물과 단계별 탐구 과정을 가나다순으로 열람할 수 있습니다.
          </p>
        </div>

      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 shadow-subtle space-y-4">
        <SearchBar
          value={filters.searchQuery}
          onChange={(q) => setFilters({ ...filters, searchQuery: q })}
        />

        <ProjectFilter
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
        />
      </div>

      {/* Project Count Bar */}
      <div className="flex items-center justify-between text-xs text-navy-500 font-medium px-1">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold text-navy text-sm">
            {filteredProjects.length} {filteredProjects.length === 1 ? "Project" : "Projects"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface text-navy-600 border border-surface-border">
            가나다순 정렬
          </span>
        </div>
        {filters.category !== "ALL" && (
          <span className="text-primary font-semibold">
            &apos;{filters.category}&apos; 전시관
          </span>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="bg-white rounded-xl border border-surface-border h-72 animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-subtle my-12">
          <div className="w-14 h-14 rounded-2xl bg-navy-50 text-navy-400 flex items-center justify-center mx-auto">
            <FolderSearch className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy">
              {allProjects.length === 0
                ? "현재 전시관 준비 중입니다."
                : "검색 조건에 맞는 프로젝트를 찾지 못했습니다."}
            </h3>
            <p className="text-xs text-navy-500">
              {allProjects.length === 0
                ? "영재 학생들의 연구 결과물이 곧 공개될 예정입니다. 잠시만 기다려 주세요."
                : "다른 키워드로 검색하거나 필터를 재설정해 보세요."}
            </p>
          </div>
          {allProjects.length > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy-800 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>전체 프로젝트 보기</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 text-center text-sm text-navy-400">
          갤러리 로딩 중...
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
