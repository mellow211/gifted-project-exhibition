"use client";

import React, { useState, useRef } from "react";
import { Project, ProjectCategory, ProjectBadge, ProjectProcess } from "@/types/project";
import { saveProject } from "@/lib/project-service";
import { CategoryTag, Badge } from "@/components/common/Badge";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit3,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface ProjectFormProps {
  initialData?: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  "SW초급",
  "SW고급",
  "로봇초급",
  "로봇고급",
  "AI",
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
  // 모드: 신규 등록인 경우 "pdf_upload" 모드로 시작, 수정인 경우 "manual_edit" 모드
  const [mode, setMode] = useState<"pdf_upload" | "preview_confirm" | "manual_edit">(
    initialData ? "manual_edit" : "pdf_upload"
  );

  // PDF 업로드 상태
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("AUTO");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState<string>("");
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const reportInputRef = useRef<HTMLInputElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // 프로젝트 폼 상태
  const [formData, setFormData] = useState<Partial<Project>>({
    id: initialData?.id,
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    team_name: initialData?.team_name || "",
    student_display_names: initialData?.student_display_names || [""],
    grade: initialData?.grade || "초등학교 6학년",
    program: initialData?.program || "대전교육정보원 정보영재교육원 SW초급 과정",
    year: initialData?.year || 2026,
    category: (initialData?.category as ProjectCategory) || "SW초급",
    tags: initialData?.tags || ["SW초급"],
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
    badge: initialData?.badge || "NEW IDEA",
    processes: initialData?.processes || [
      {
        id: "step-1",
        project_id: initialData?.id || "temp",
        title: "문제 정의 및 아이디어 설계",
        description: "일상의 불편함을 관찰하고 가설을 세우는 단계",
        display_order: 1,
      },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [studentsInput, setStudentsInput] = useState(
    initialData?.student_display_names?.join(", ") || ""
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  // PDF 분석 실행
  const handleAnalyzePdfs = async () => {
    if (!reportFile || !manualFile) {
      setAnalyzeError("탐구 보고서 PDF와 작품 설명서 PDF 파일 2개를 모두 선택해 주세요.");
      return;
    }

    setAnalyzing(true);
    setAnalyzeError(null);
    setAnalyzeProgress("1/3 PDF 텍스트 및 구조 분석 중...");

    try {
      const data = new FormData();
      data.append("report", reportFile);
      data.append("manual", manualFile);
      if (selectedCategory !== "AUTO") {
        data.append("category", selectedCategory);
      }

      const timer = setTimeout(() => {
        setAnalyzeProgress("2/3 탐구 스토리 및 타임라인 생성 중...");
      }, 1500);

      const timer2 = setTimeout(() => {
        setAnalyzeProgress("3/3 고화질 포스터 썸네일 렌더링 중...");
      }, 3000);

      const res = await fetch("/api/admin/analyze-pdf", {
        method: "POST",
        body: data,
      });

      clearTimeout(timer);
      clearTimeout(timer2);

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "PDF 분석에 실패했습니다.");
      }

      const proj: Project = json.project;
      setFormData(proj);
      setStudentsInput(proj.student_display_names.join(", "));
      setTagsInput(proj.tags.join(", "));
      setMode("preview_confirm");
    } catch (err: any) {
      console.error("PDF analysis error:", err);
      setAnalyzeError(err?.message || "PDF 분석 중 오류가 발생했습니다.");
    } finally {
      setAnalyzing(false);
    }
  };

  // 분석 완료 후 바로 저장
  const handleConfirmAndSave = async () => {
    setSaving(true);
    try {
      const saved = await saveProject({
        ...formData,
        student_display_names: studentsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: tagsInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      onSave(saved);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // 수동 폼 저장
  const handleManualSubmit = async (e: React.FormEvent) => {
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
      slug: formData.slug || `project-${Date.now()}`,
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

  // ==========================================
  // VIEW 1: PDF 업로드 등록 화면 (기본 모드)
  // ==========================================
  if (mode === "pdf_upload") {
    return (
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-card space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-surface-muted text-navy-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 원클릭 자동 등록</span>
              </div>
              <h2 className="text-2xl font-extrabold text-navy">
                신규 영재 프로젝트 등록 (보고서 & 설명서 PDF 분석)
              </h2>
              <p className="text-xs text-navy-500 mt-0.5">
                학생의 <strong>탐구 보고서 PDF</strong>와 <strong>작품 설명서 PDF</strong> 2개 파일만 선택하면, AI가 데이터를 자동으로 추출 및 생성하여 완성합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMode("manual_edit")}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-surface-border text-xs font-medium text-navy-600 hover:bg-surface-muted"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>직접 수동 입력하기</span>
          </button>
        </div>

        {analyzeError && (
          <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{analyzeError}</span>
          </div>
        )}

        {/* Category Option */}
        <div className="bg-surface rounded-2xl p-5 border border-surface-border space-y-3">
          <label className="block text-xs font-bold text-navy">
            교육과정 (카테고리) 설정
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("AUTO")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === "AUTO"
                  ? "bg-navy text-white shadow-sm"
                  : "bg-white text-navy-600 border border-surface-border hover:border-navy-300"
              }`}
            >
              ✨ PDF에서 자동 감지 (권장)
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-navy text-white shadow-sm"
                    : "bg-white text-navy-600 border border-surface-border hover:border-navy-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Two PDF Dropzones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Report PDF */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy flex items-center justify-between">
              <span>① 탐구 보고서 PDF 파일 *</span>
              <span className="text-[11px] text-navy-400 font-normal">8~10페이지 본문 보고서</span>
            </label>
            <div
              onClick={() => reportInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                reportFile
                  ? "border-primary bg-primary-light/20"
                  : "border-surface-border hover:border-primary/50 hover:bg-surface"
              }`}
            >
              <input
                ref={reportInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setReportFile(e.target.files[0]);
                }}
              />
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-3">
                <FileText className={`w-6 h-6 ${reportFile ? "text-primary" : ""}`} />
              </div>
              {reportFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary line-clamp-1">{reportFile.name}</p>
                  <p className="text-[11px] text-navy-400 font-mono">
                    {(reportFile.size / 1024).toFixed(1)} KB · 파일 선택됨
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-navy">보고서 PDF 클릭 또는 드래그 업로드</p>
                  <p className="text-[11px] text-navy-400">보고서(sw초급 이름).pdf 형식</p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Manual PDF */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-navy flex items-center justify-between">
              <span>② 작품 설명서 PDF 파일 *</span>
              <span className="text-[11px] text-navy-400 font-normal">1페이지 요약 포스터 (썸네일 생성용)</span>
            </label>
            <div
              onClick={() => manualInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                manualFile
                  ? "border-secondary-dark bg-emerald-50/30"
                  : "border-surface-border hover:border-secondary hover:bg-surface"
              }`}
            >
              <input
                ref={manualInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setManualFile(e.target.files[0]);
                }}
              />
              <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className={`w-6 h-6 ${manualFile ? "text-secondary-dark" : ""}`} />
              </div>
              {manualFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-secondary-dark line-clamp-1">{manualFile.name}</p>
                  <p className="text-[11px] text-navy-400 font-mono">
                    {(manualFile.size / 1024).toFixed(1)} KB · 파일 선택됨
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-navy">작품설명서 PDF 클릭 또는 드래그 업로드</p>
                  <p className="text-[11px] text-navy-400">작품설명서(sw초급 이름).pdf 형식</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-surface-border">
          <p className="text-xs text-navy-400">
            💡 PDF 2개 외에 제목, 학생명, 요약, 연구 절차는 AI가 자동으로 분석하여 입력합니다.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-surface-border text-xs font-semibold text-navy-600 hover:bg-surface-muted"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!reportFile || !manualFile || analyzing}
              onClick={handleAnalyzePdfs}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-800 transition-all shadow-card hover:shadow-hover disabled:opacity-40"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                  <span>{analyzeProgress}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>PDF 분석 및 프로젝트 자동 생성</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AI 분석 결과 검토 및 바로 등록 화면
  // ==========================================
  if (mode === "preview_confirm") {
    return (
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-card space-y-8 animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-surface-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary-dark" />
              <span>AI 분석 및 데이터 생성 완료</span>
            </div>
            <h2 className="text-2xl font-extrabold text-navy">
              분석 결과 검토 및 전시관 등록
            </h2>
            <p className="text-xs text-navy-500 mt-0.5">
              생성된 프로젝트 정보를 확인하세요. 바로 등록하거나 필요시 세부 내용을 수정할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("pdf_upload")}
              className="px-4 py-2 rounded-xl border border-surface-border text-xs font-semibold text-navy-600 hover:bg-surface-muted"
            >
              다른 파일 분석
            </button>
            <button
              type="button"
              onClick={() => setMode("manual_edit")}
              className="px-4 py-2 rounded-xl border border-surface-border text-xs font-semibold text-navy-700 hover:bg-surface-muted flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-primary" />
              <span>세부 내용 직접 수정</span>
            </button>
          </div>
        </div>

        {/* Extracted Project Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface rounded-2xl p-6 border border-surface-border">
          {/* Thumbnail */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-[11px] font-bold text-navy-400 uppercase tracking-wider">
              자동 렌더링된 포스터 썸네일
            </span>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-navy-900 border border-surface-border shadow-subtle relative group">
              <img
                src={formData.thumbnail_url}
                alt={formData.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Core Info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryTag category={formData.category || "SW초급"} />
              <Badge type={formData.badge || "NEW IDEA"} />
              <span className="text-xs text-navy-500 font-medium">
                {formData.team_name} · {formData.student_display_names?.join(", ")}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-navy">
              {formData.title}
            </h3>

            {/* Question */}
            <div className="p-4 rounded-xl bg-white border border-surface-border space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                01 RESEARCH QUESTION (핵심 탐구 질문)
              </span>
              <p className="text-xs sm:text-sm font-semibold text-navy leading-relaxed">
                &ldquo;{formData.question}&rdquo;
              </p>
            </div>

            {/* Motivation */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-navy-400 uppercase">
                02 MOTIVATION (탐구의 필요성 및 동기)
              </span>
              <p className="text-xs text-navy-600 leading-relaxed line-clamp-3">
                {formData.motivation}
              </p>
            </div>

            {/* Process Timeline */}
            <div className="space-y-2 pt-2 border-t border-surface-border">
              <span className="text-[10px] font-bold tracking-widest text-navy-400 uppercase">
                04 JOURNEY (단계별 탐구 과정)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.processes?.map((proc, i) => (
                  <div key={proc.id || i} className="p-2.5 rounded-lg bg-white border border-surface-border text-xs">
                    <span className="font-mono font-bold text-[10px] text-primary block">
                      STEP {i + 1}
                    </span>
                    <p className="font-bold text-navy truncate">{proc.title}</p>
                    <p className="text-[11px] text-navy-500 line-clamp-2 mt-0.5">{proc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {formData.tags?.map((t) => (
                <span key={t} className="text-[11px] bg-white border border-surface-border px-2 py-0.5 rounded text-navy-500 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Confirm */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-surface-border text-xs font-semibold text-navy-600 hover:bg-surface-muted"
          >
            취소
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleConfirmAndSave}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-800 transition-all shadow-card hover:shadow-hover disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-secondary" />
            <span>{saving ? "전시관 등록 중..." : "🚀 이 내용으로 전시관에 등록하기"}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: 수동 수정 모드 (기존 수정 / 디테일 편집)
  // ==========================================
  return (
    <form
      onSubmit={handleManualSubmit}
      className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-card space-y-8"
    >
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
              {initialData ? "프로젝트 수정" : "프로젝트 세부 내용 입력 및 편집"}
            </h2>
            <p className="text-xs text-navy-400">
              전시관에 게시할 학생 연구 산출물의 세부 텍스트를 검토하고 수정합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!initialData && (
            <button
              type="button"
              onClick={() => setMode("pdf_upload")}
              className="px-3 py-2 rounded-lg border border-surface-border text-xs font-medium text-navy-600 hover:bg-surface-muted"
            >
              ← PDF 자동 분석으로 돌아가기
            </button>
          )}
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
          <span>기본 메타데이터</span>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              전시 카테고리 (교육과정) *
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

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              학생 표시명 (개인정보 보호 마스킹) *
            </label>
            <input
              type="text"
              required
              value={studentsInput}
              onChange={(e) => setStudentsInput(e.target.value)}
              placeholder="예: 김*현 (초6)"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              소속 학교 및 팀명
            </label>
            <input
              type="text"
              value={formData.team_name}
              onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
              placeholder="예: 대전배울초"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="SW초급, Python, Tkinter, 자기주도학습"
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 2. Narrative Sections */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        <h3 className="text-sm font-bold text-navy flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>연구 내러티브 내용</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              01 PROJECT QUESTION (연구 핵심 질문) *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              02 WHY (탐구의 필요성 및 연구 동기) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              03 STORY SUMMARY (프로젝트 한 줄 요약) *
            </label>
            <textarea
              rows={2}
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-700 mb-1">
              03 STORY DESCRIPTION (연구 상세 내용 및 결과 분석) *
            </label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                06 배운 점과 성찰 (Reflection)
              </label>
              <textarea
                rows={3}
                value={formData.reflection}
                onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1">
                06 다음 연구를 향한 질문 (Next Question)
              </label>
              <textarea
                rows={3}
                value={formData.next_question}
                onChange={(e) => setFormData({ ...formData, next_question: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-surface-border rounded-lg leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Toggles */}
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
        </div>
      </div>

      {/* Actions */}
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
