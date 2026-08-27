"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/types/project";
import {
  getAllProjects,
  deleteProject,
  toggleProjectPublished,
  toggleProjectFeatured,
  resetToSampleData,
} from "@/lib/project-service";
import { ProjectForm } from "./ProjectForm";
import { Badge, CategoryTag } from "@/components/common/Badge";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Search,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const data = await getAllProjects(true);
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`'${title}' 프로젝트를 삭제하시겠습니까?`)) {
      await deleteProject(id);
      showToast("프로젝트가 삭제되었습니다.");
      fetchAll();
    }
  };

  const handleTogglePublish = async (id: string) => {
    const isPub = await toggleProjectPublished(id);
    showToast(isPub ? "전시관에 공개되었습니다." : "비공개로 전환되었습니다.");
    fetchAll();
  };

  const handleToggleFeatured = async (id: string) => {
    const isFeat = await toggleProjectFeatured(id);
    showToast(isFeat ? "주목할 프로젝트(Featured)로 등록되었습니다." : "Featured 설정이 해제되었습니다.");
    fetchAll();
  };

  const handleResetSample = async () => {
    if (confirm("샘플 영재 프로젝트 8건으로 데이터베이스를 초기화하시겠습니까?")) {
      await resetToSampleData();
      showToast("샘플 데이터로 초기화되었습니다.");
      fetchAll();
    }
  };

  if (isCreating || editingProject) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProjectForm
          initialData={editingProject}
          onSave={() => {
            setIsCreating(false);
            setEditingProject(null);
            showToast("프로젝트가 성공적으로 저장되었습니다.");
            fetchAll();
          }}
          onCancel={() => {
            setIsCreating(false);
            setEditingProject(null);
          }}
        />
      </div>
    );
  }

  const filtered = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.student_display_names.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-wider uppercase mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>EXHIBITION CURATOR SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
            전시관 프로젝트 관리 대시보드
          </h1>
          <p className="text-xs text-navy-400 mt-1">
            로그인 계정: <span className="font-semibold text-navy-700">{user.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleResetSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-muted hover:bg-navy-100 text-xs font-medium text-navy-700 border border-surface-border transition-colors"
            title="기본 8개 영재 프로젝트 복원"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>샘플 데이터 리셋</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-secondary" />
            <span>신규 프로젝트 등록</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-2 rounded-lg border border-surface-border text-xs font-medium text-navy-500 hover:text-navy hover:bg-surface-muted"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-up">
          <CheckCircle2 className="w-4 h-4 text-secondary-dark" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs text-navy-400 font-medium">전체 등록 프로젝트</span>
          <p className="text-2xl font-bold font-mono text-navy mt-1">{projects.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs text-navy-400 font-medium">전시관 공개 중</span>
          <p className="text-2xl font-bold font-mono text-primary mt-1">
            {projects.filter((p) => p.published).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs text-navy-400 font-medium">주목할 프로젝트 (Featured)</span>
          <p className="text-2xl font-bold font-mono text-secondary-dark mt-1">
            {projects.filter((p) => p.featured).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-surface-border shadow-subtle">
          <span className="text-xs text-navy-400 font-medium">비공개 초안</span>
          <p className="text-2xl font-bold font-mono text-navy-400 mt-1">
            {projects.filter((p) => !p.published).length}
          </p>
        </div>
      </div>

      {/* Search and Table Area */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트명, 학생명, 카테고리 검색..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-surface-border rounded-lg bg-surface placeholder:text-navy-300"
            />
          </div>

          <span className="text-xs text-navy-400 font-medium font-mono">
            총 {filtered.length}개 프로젝트 표시 중
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-navy-700">
            <thead className="bg-surface-muted text-navy-500 font-semibold border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4">순서</th>
                <th className="py-3.5 px-4">프로젝트 제목</th>
                <th className="py-3.5 px-4">카테고리</th>
                <th className="py-3.5 px-4">학생 연구진</th>
                <th className="py-3.5 px-4 text-center">공개 여부</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-navy-400">
                    프로젝트 목록을 불러오는 중...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-navy-400">
                    등록된 프로젝트가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-navy-400">
                      {project.display_order}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-navy-900">
                          <img
                            src={project.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-navy hover:text-primary transition-colors">
                            {project.title}
                          </p>
                          <span className="text-[10px] text-navy-400 font-mono">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <CategoryTag category={project.category} />
                    </td>

                    <td className="py-4 px-4 text-navy-600">
                      <span className="line-clamp-1">
                        {project.student_display_names.join(", ")}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(project.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          project.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                        }`}
                      >
                        {project.published ? (
                          <>
                            <Eye className="w-3 h-3 text-secondary-dark" />
                            <span>공개</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>비공개</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(project.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          project.featured
                            ? "bg-primary-light text-primary border border-primary/30"
                            : "bg-surface-muted text-navy-400 border border-surface-border"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{project.featured ? "Featured" : "일반"}</span>
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block p-1.5 text-navy-400 hover:text-navy hover:bg-surface-muted rounded"
                        title="전시 페이지 미리보기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setEditingProject(project)}
                        className="p-1.5 text-navy-600 hover:text-primary hover:bg-primary-light rounded"
                        title="프로젝트 수정"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-1.5 text-navy-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="프로젝트 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
