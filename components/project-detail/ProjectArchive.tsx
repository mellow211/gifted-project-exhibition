"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import {
  FileText,
  Presentation,
  PlaySquare,
  ExternalLink,
  Maximize2,
  Download,
  AlertCircle,
} from "lucide-react";

interface ProjectArchiveProps {
  project: Project;
}

type TabType = "report" | "presentation" | "video" | "demo";

export const ProjectArchive: React.FC<ProjectArchiveProps> = ({ project }) => {
  // Determine available tabs
  const availableTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];

  if (project.report_pdf_url) {
    availableTabs.push({ id: "report", label: "연구 보고서 (PDF)", icon: FileText });
  }
  if (project.presentation_pdf_url || project.presentation_original_url) {
    availableTabs.push({ id: "presentation", label: "발표 자료", icon: Presentation });
  }
  if (project.video_url) {
    availableTabs.push({ id: "video", label: "시연 및 발표 영상", icon: PlaySquare });
  }
  if (project.external_project_url) {
    availableTabs.push({ id: "demo", label: "작품 실행 (Demo)", icon: ExternalLink });
  }

  const [activeTab, setActiveTab] = useState<TabType>(availableTabs[0]?.id || "report");

  if (availableTabs.length === 0) return null;

  // Helper for YouTube embed
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <section className="py-12 border-b border-surface-border">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase mb-1">
            <span className="font-mono text-primary font-extrabold">05</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>PROJECT ARCHIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy">
            프로젝트 전체 결과물 아카이브
          </h2>
          <p className="text-sm text-navy-500 mt-1">
            연구 보고서 전문, 발표 슬라이드, 시연 영상 및 실행 가능한 프로토타입을 감상하세요.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-surface-border overflow-x-auto pb-1">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary bg-primary-light/50"
                    : "border-transparent text-navy-600 hover:text-navy hover:bg-surface-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
          {/* TAB 1: Report PDF */}
          {activeTab === "report" && project.report_pdf_url && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2 text-xs text-navy-600">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-semibold">연구 보고서 전문 뷰어</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={project.report_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-navy-100 text-navy-700 text-xs font-semibold border border-surface-border transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>전체화면 보기</span>
                  </a>

                  <a
                    href={project.report_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-800 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-secondary" />
                    <span>PDF 열기</span>
                  </a>
                </div>
              </div>

              {/* In-Browser PDF Frame with Fallback */}
              <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-navy-50 border border-surface-border">
                <iframe
                  src={`${project.report_pdf_url}#toolbar=0&navpanes=0`}
                  title="연구 보고서 PDF 뷰어"
                  className="w-full h-full border-0"
                />
              </div>

              <p className="text-[11px] text-navy-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                모바일 환경에서 PDF 미리보기가 지원되지 않는 경우 &apos;PDF 열기&apos; 버튼으로 확인하실 수 있습니다.
              </p>
            </div>
          )}

          {/* TAB 2: Presentation Deck */}
          {activeTab === "presentation" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2 text-xs text-navy-600">
                  <Presentation className="w-4 h-4 text-primary" />
                  <span className="font-semibold">프로젝트 발표 슬라이드 (PDF 변환본)</span>
                </div>

                {project.presentation_original_url && (
                  <a
                    href={project.presentation_original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-800 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-secondary" />
                    <span>원본 발표자료 열기</span>
                  </a>
                )}
              </div>

              {project.presentation_pdf_url ? (
                <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-navy-50 border border-surface-border">
                  <iframe
                    src={`${project.presentation_pdf_url}#toolbar=0`}
                    title="발표 슬라이드 PDF 뷰어"
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="py-16 text-center text-navy-500">
                  <Presentation className="w-10 h-10 mx-auto mb-2 text-navy-300" />
                  <p className="text-sm">원본 발표자료 파일 링크가 제공됩니다.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Video Player */}
          {activeTab === "video" && project.video_url && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-navy-600 pb-3 border-b border-surface-border">
                <PlaySquare className="w-4 h-4 text-primary" />
                <span className="font-semibold">시연 및 발표 동영상</span>
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-navy-900 shadow-card">
                <iframe
                  src={getEmbedUrl(project.video_url)!}
                  title="프로젝트 시연 및 발표 영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Live Demo */}
          {activeTab === "demo" && project.external_project_url && (
            <div className="py-10 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-secondary-light flex items-center justify-center text-secondary-dark mx-auto shadow-sm">
                <ExternalLink className="w-7 h-7" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-navy">
                  학생들이 직접 개발한 프로그램을 직접 체험해보세요
                </h3>
                <p className="text-xs text-navy-500">
                  외부 웹 애플리케이션 또는 프로토타입 저장소로 안전하게 연결됩니다.
                </p>
              </div>

              <div>
                <a
                  href={project.external_project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-800 shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5"
                >
                  <span>프로젝트 실행하기</span>
                  <ExternalLink className="w-4 h-4 text-secondary" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
