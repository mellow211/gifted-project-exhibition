"use client";

import React, { useState } from "react";
import { Project, ProjectCategory, ProjectBadge, ProjectProcess } from "@/types/project";
import { saveProject } from "@/lib/project-service";
import { Plus, Trash2, ArrowLeft, Save, Sparkles, Layers, Image as ImageIcon } from "lucide-react";

interface ProjectFormProps {
  initialData?: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  "AI & DATA",
  "SOFTWARE",
  "ROBOT & IoT",
  "SCIENCE",
  "CREATIVE",
];

const BADGES: ProjectBadge[] = [
  "CURATOR'S PICK",
  "NEW IDEA",
  "CREATIVE QUESTION",
  "TECH CHALLENGE",
];

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    id: initialData?.id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    team_name: initialData?.team_name || "",
    student_display_names: initialData?.student_display_names || [""],
    grade: initialData?.grade || "중학교 2학년",
    program: initialData?.program || "영재 심화과정",
    year: initialData?.year || 2026,
    category: initialData?.category || "AI & DATA",
    tags: initialData?.tags || ["인공지능"],
    question: initialData?.question || "",
    summary: initialData?.summary || "",
    motivation: initialData?.motivation || "",
    description: initialData?.description || "",
    reflection: initialData?.reflection || "",
    next_question: initialData?.next_question || "",
    thumbnail_url:
      initialData?.thumbnail_url ||
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    report_pdf_url: initialData?.report_pdf_url || "",
    presentation_pdf_url: initialData?.presentation_pdf_url || "",
    presentation_original_url: initialData?.presentation_original_url || "",
    video_url: initialData?.video_url || "",
    external_project_url: initialData?.external_project_url || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
    display_order: initialData?.display_order || 1,
    badge: initialData?.badge || "CURATOR'S PICK",
    processes: initialData?.processes || [
      {
        id: "step-1",
        project_id: initialData?.id || "temp",
        title: "문제 정의 및 선행연구",
        description: "주변의 문제를 관찰하고 가설을 세우는 단계",
        display_order: 1,
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [studentsInput, setStudentsInput] = useState(
    initialData?.student_display_names?.join(", ") || "김*우, 이*진"
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || "인공지능, 엣지컴퓨팅"
  );

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9가-힣]/g, "-").replace(/-+/g, "-"),
    }));
  };

  const addProcessStep = () => {
    const currentProcesses = formData.processes || [];
    const newStep: ProjectProcess = {
      id: `step-${Date.now()}`,
      project_id: formData.id || "temp",
      title: `탐구 단계 ${currentProcesses.length + 1}`,
      description: "",
      display_order: currentProcesses.length + 1,
    };
    setFormData({ ...formData, processes: [...currentProcesses, newStep] });
  };

  const removeProcessStep = (index: number) => {
    const currentProcesses = formData.processes || [];
    const updated = currentProcesses.filter((_, i) => i !== index);
    setFormData({ ...formData, processes: updated });
  };

  const updateProcessStep = (index: number, field: keyof ProjectProcess, value: any) => {
    const currentProcesses = [...(formData.processes || [])];
    currentProcesses[index] = { ...currentProcesses[index], [field]: value };
    setFormData({ ...formData, processes: currentProcesses });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Partial<Project> = {
      ...formData,
      student_display_names: studentsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      slug:
        formData.slug ||
        `project-${Date.now()}`,
    };

    try {
      const saved = await saveProject(payload);
      onSave(saved);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-surface-muted text-navy-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-navy">
              {initialData ? "프로젝트 수정" : "신규 영재 프로젝트 등록"}
            </h2>
            <p className="text-xs text-navy-400">
              전시관에 게시할 학생 연구 산출물의 세부 정보를 입력하세요.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-surface-border text-xs font-semibold text-navy-600 hover:bg-surface-muted"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-secondary" />
            <span>{saving ? "저장 중..." : "전시 프로젝트 저장"}</span>
          </button>
        </div>
      </div>

      {/* 1. Basic Metadata */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-navy flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>기본 정보 및 메타데이터</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              프로젝트 제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="예: AI 다중 센서 분리수거 도우미"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ai-recycling-assistant"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              전시 카테고리 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              부제 또는 핵심 질문 요약
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="복합 재질 쓰레기를 이미지 센서로 분류할 수 없을까?"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              팀 이름 (선택)
            </label>
            <input
              type="text"
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              placeholder="GreenVision"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              학생 표시명 (개인정보 보호 가명, 쉼표 구분) *
            </label>
            <input
              type="text"
              required
              value={studentsInput}
              onChange={(e) => setStudentsInput(e.target.value)}
              placeholder="김*우 (중2), 이*진 (중2)"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              학년 및 소속
            </label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="중학교 2-3학년"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              교육 프로그램 과정명
            </label>
            <input
              type="text"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              placeholder="인공지능 & 융합과학 심화과정"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              큐레이션 뱃지 (Badge)
            </label>
            <select
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value as ProjectBadge })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg bg-white"
            >
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="컴퓨터비전, YOLOv8, 환경공학"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              대표 썸네일 이미지 URL
            </label>
            <input
              type="url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 2. Inquiry Storytelling Content */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <h3 className="text-sm font-bold text-navy flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>탐구 스토리텔링 콘텐츠</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              01 PROJECT QUESTION (우리는 이런 질문에서 시작했습니다) *
            </label>
            <textarea
              required
              rows={2}
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="투명 페트병과 라벨이 붙은 페트병을 인공지능이 0.5초 안에 정확히 구별해 자동 분류할 수 있을까?"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              02 WHY (왜 이 주제를 선택했나요? 탐구 동기) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              placeholder="학교 분리수거장에서 라벨이 제거되지 않은 페트병이 버려져 재활용률이 급감하는 현실을 목격했습니다..."
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              03 PROJECT STORY (1줄 요약) *
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="경량화 YOLOv8 모델과 마이크로컨트롤러를 결합하여 복합 재질 플라스틱을 실시간 판별하고 자동 분류하는 친환경 AI 디바이스 개발"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              03 PROJECT STORY (상세 탐구 및 구현 내용) *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="본 연구는 라즈베리파이와 초소형 카메라 모듈을 기반으로 3,500장의 데이터셋을 직접 구축하고..."
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                WHAT WE LEARNED (무엇을 배웠나요?)
              </label>
              <textarea
                rows={3}
                value={formData.reflection}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                placeholder="단순 모델 정확도뿐만 아니라 조명과 물리적 기구부 안정성의 중요성을 배웠습니다..."
                className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                NEXT QUESTION (다시 탐구한다면?)
              </label>
              <textarea
                rows={3}
                value={formData.next_question}
                onChange={(e) => setFormData({ ...formData, next_question: e.target.value })}
                placeholder="분광 센서를 융합하여 PLA와 일반 PET를 비파괴 방식으로 100% 분별할 수 있을까?"
                className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Timeline Journey Steps Editor */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy">
            04 OUR JOURNEY (탐구 과정 타임라인 단계)
          </h3>
          <button
            type="button"
            onClick={addProcessStep}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-navy-100 text-xs font-semibold text-navy-700 border border-surface-border transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-primary" />
            <span>단계 추가</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.processes?.map((step, idx) => (
            <div
              key={step.id || idx}
              className="p-4 bg-surface rounded-xl border border-surface-border space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary font-mono">
                  STEP {idx + 1}
                </span>
                {formData.processes && formData.processes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProcessStep(idx)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="단계 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-navy-600 mb-1">
                    단계 제목
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateProcessStep(idx, "title", e.target.value)}
                    placeholder="예: 3D 모델링 및 하우징 출력"
                    className="w-full px-3 py-1.5 text-xs border border-surface-border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-navy-600 mb-1">
                    단계 관련 이미지 URL (선택)
                  </label>
                  <input
                    type="url"
                    value={step.image_url || ""}
                    onChange={(e) => updateProcessStep(idx, "image_url", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-1.5 text-xs border border-surface-border rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-navy-600 mb-1">
                    단계 설명 및 탐구 내용
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => updateProcessStep(idx, "description", e.target.value)}
                    placeholder="가설을 검증하기 위한 실험 설계 및 시행착오 과정 기록"
                    className="w-full px-3 py-1.5 text-xs border border-surface-border rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Archive URLs */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <h3 className="text-sm font-bold text-navy">
          05 PROJECT ARCHIVE (결과물 링크)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              보고서 PDF URL
            </label>
            <input
              type="url"
              value={formData.report_pdf_url || ""}
              onChange={(e) => setFormData({ ...formData, report_pdf_url: e.target.value })}
              placeholder="https://.../report.pdf"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              발표 슬라이드 PDF URL
            </label>
            <input
              type="url"
              value={formData.presentation_pdf_url || ""}
              onChange={(e) => setFormData({ ...formData, presentation_pdf_url: e.target.value })}
              placeholder="https://.../presentation.pdf"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              원본 PPTX 다운로드 링크
            </label>
            <input
              type="url"
              value={formData.presentation_original_url || ""}
              onChange={(e) => setFormData({ ...formData, presentation_original_url: e.target.value })}
              placeholder="https://.../presentation.pptx"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              동영상 링크 (YouTube 또는 Vimeo)
            </label>
            <input
              type="url"
              value={formData.video_url || ""}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              외부 작품 데모 실행 URL (웹 앱, GitHub, 시뮬레이터)
            </label>
            <input
              type="url"
              value={formData.external_project_url || ""}
              onChange={(e) => setFormData({ ...formData, external_project_url: e.target.value })}
              placeholder="https://demo.example.com"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 5. Curation & Visibility Toggles */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <h3 className="text-sm font-bold text-navy">전시 및 공개 설정</h3>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy-800">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span>전시관 공개 (Published)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-navy-800">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span>메인 추천작 설정 (Featured)</span>
          </label>

          <div className="flex items-center gap-2 text-xs font-semibold text-navy-700">
            <span>전시 정렬 순서:</span>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-16 px-2 py-1 border border-surface-border rounded text-xs text-center"
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-surface-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-surface-border text-xs font-semibold text-navy-600 hover:bg-surface-muted"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy-800 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-secondary" />
          <span>{saving ? "저장 중..." : "전시 프로젝트 저장"}</span>
        </button>
      </div>
    </form>
  );
};
