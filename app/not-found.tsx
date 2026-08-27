import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="bg-white rounded-3xl border border-surface-border p-10 sm:p-14 text-center max-w-lg shadow-card space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
            404 NOT FOUND
          </span>
          <h2 className="text-2xl font-extrabold text-navy">
            전시 작품을 찾을 수 없습니다
          </h2>
          <p className="text-xs sm:text-sm text-navy-500 leading-relaxed">
            요청하신 프로젝트가 비공개 상태이거나 이동되었을 수 있습니다.
            전체 갤러리에서 다양한 학생 연구 작품을 만나보세요.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-800 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>전체 프로젝트 보기</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-surface-border text-navy-600 hover:bg-surface-muted text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>홈으로 이동</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
