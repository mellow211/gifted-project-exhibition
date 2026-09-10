"use client";

import React, { useState } from "react";
import { Project } from "@/types/project";
import {
  FileText,
  Image as ImageIcon,
  PlaySquare,
  ExternalLink,
  Maximize2,
  Download,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

interface ProjectArchiveProps {
  project: Project;
}

type TabType = "poster" | "report" | "video" | "demo";

export const ProjectArchive: React.FC<ProjectArchiveProps> = ({ project }) => {
  const availableTabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [];

  const posterImage = project.poster_url || null;
  const reportUrl = project.report_pdf_url || project.report_url;

  // 1. Poster tab (작품 설명서 A4 요약 포스터)
  if (posterImage) {
    availableTabs.push({ id: "poster", label: "작품 설명서 (A4 포스터)", icon: ImageIcon });
  }

  // 2. Report tab (연구 보고서 전문)
  if (reportUrl) {
    availableTabs.push({ id: "report", label: "연구 보고서 (PDF 전문)", icon: FileText });
  }

  // 3. Video tab
  if (project.video_url) {
    availableTabs.push({ id: "video", label: "시연 및 발표 영상", icon: PlaySquare });
  }

  // 4. Demo tab
  if (project.external_project_url) {
    availableTabs.push({ id: "demo", label: "작품 실행 (Demo)", icon: ExternalLink });
  }

  const [activeTab, setActiveTab] = useState<TabType>(availableTabs[0]?.id || "poster");

  if (availableTabs.length === 0) return null;

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
    <section id="archive" className="py-12 border-b border-surface-border">
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
            A4 1페이지로 요약된 작품 설명서 포스터와 연구 보고서 전문을 감상할 수 있습니다.
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

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-7 shadow-subtle">
          {/* TAB 1: A4 Poster View (스크롤 없이 한눈에 들어오는 A4 세로 비율) */}
          {activeTab === "poster" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2 text-xs text-navy-600">
                  <FileCheck2 className="w-4 h-4 text-primary" />
                  <span className="font-semibold">작품 설명서 요약 포스터 (A4 1페이지)</span>
                </div>

                <div className="flex items-center gap-2">
                  {posterImage && (
                    <a
                      href={posterImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-navy-100 text-navy-700 text-xs font-semibold border border-surface-border transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>포스터 크게보기</span>
                    </a>
                  )}
                </div>
              </div>

              {/* A4 Container sized to fit fully on screen without scrolling */}
              <div className="flex justify-center p-3 sm:p-5 bg-navy-950/5 rounded-xl">
                {posterImage ? (
                  <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-300 bg-white max-w-[550px] w-full flex items-center justify-center">
                    <img
                      src={posterImage}
                      alt={`${project.title} 작품 설명서 요약 포스터`}
                      className="w-full h-auto max-h-[75vh] object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="py-20 text-center text-navy-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 text-navy-300" />
                    <p className="text-sm">포스터 이미지를 불러올 수 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Report PDF (A4 높이에 맞춰 스크롤 없이 한눈에 들어오는 뷰어) */}
          {activeTab === "report" && reportUrl && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2 text-xs text-navy-600">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-semibold">연구 보고서 전문 뷰어</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-navy-100 text-navy-700 text-xs font-semibold border border-surface-border transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>전체화면 보기</span>
                  </a>

                  <a
                    href={reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-800 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-secondary" />
                    <span>PDF 다운로드</span>
                  </a>
                </div>
              </div>

              {/* In-Browser PDF Frame: scaled to A4 portrait without page cut-off */}
              <div className="flex justify-center p-2 sm:p-4 bg-navy-950/5 rounded-xl">
                <div className="relative w-full max-w-[620px] h-[75vh] max-h-[800px] rounded-lg overflow-hidden bg-white shadow-2xl border border-slate-300">
                  <iframe
                    src={`${reportUrl}#page=1&view=Fit`}
                    title="연구 보고서 PDF 뷰어"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <p className="text-[11px] text-navy-400 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                모바일 환경에서 PDF 미리보기가 지원되지 않는 경우 &apos;PDF 다운로드&apos; 버튼으로 확인하실 수 있습니다.
              </p>
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

          {/* TAB 5: Live Demo */}
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
