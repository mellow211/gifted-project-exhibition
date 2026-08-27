import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Lightbulb, GraduationCap, ArrowRight, ShieldCheck, Layers } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-surface min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABOUT THE EXHIBITION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            질문에서 시작하여 <br />
            성찰로 완성되는 탐구의 기록
          </h1>
          <p className="text-base sm:text-lg text-navy-600 leading-relaxed">
            영재 프로젝트 디지털 연구 전시관은 학생들의 완성된 산출물뿐만 아니라,
            <strong> 가설과 실험, 실패와 개선의 여정 전체</strong>를 전시하는 미래지향적 연구 공간입니다.
          </p>
        </div>

        {/* 1. Core Philosophy */}
        <div className="bg-white rounded-3xl border border-surface-border p-8 sm:p-12 shadow-card space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold tracking-widest text-primary uppercase font-mono">
              OUR MANIFESTO
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
              왜 단순 자료실이 아닌 연구 전시관인가?
            </h2>
            <p className="text-sm sm:text-base text-navy-700 leading-relaxed">
              기존의 학교 아카이브는 완성된 PDF 보고서나 발표 파일만을 다운로드하는 데 그쳤습니다.
              그러나 진정한 영재 교육과 탐구 기반 학습(PBL)의 정수는 결과물 이전의
              <strong> &apos;호기심에 찬 최초의 질문&apos;</strong>과, 예상치 못한 문제를 해결해 나간
              <strong> &apos;치열한 시행착오의 과정&apos;</strong>에 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-surface-border">
            <div className="p-5 rounded-2xl bg-surface space-y-2 border border-surface-border">
              <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-navy">01 질문의 힘</h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                정답을 찾는 연습이 아닌, 아무도 묻지 않았던 새로운 질문을 정의하는 데서 연구가 시작됩니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface space-y-2 border border-surface-border">
              <div className="w-9 h-9 rounded-xl bg-secondary-light flex items-center justify-center text-secondary-dark">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-navy">02 실패와 개선</h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                실험의 실패는 막다른 길이 아닌 최적화의 단서입니다. 타임라인을 통해 개선 과정을 가감 없이 투명하게 보여줍니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface space-y-2 border border-surface-border">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-navy">03 성찰과 확장</h3>
              <p className="text-xs text-navy-600 leading-relaxed">
                무엇을 배웠는지 회고하고 다음 연구를 향한 새로운 질문(Next Question)을 제시하여 지적 성장을 이어갑니다.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Inquiry-Based Learning Journey */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase font-mono">
              RESEARCH CYCLE
            </span>
            <h2 className="text-2xl font-extrabold text-navy">
              영재 프로젝트 탐구 사이클
            </h2>
          </div>

          <div className="bg-navy text-white rounded-3xl p-8 sm:p-10 shadow-glass relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="space-y-2 p-4 rounded-xl bg-navy-800/80 border border-navy-700">
                <span className="text-secondary font-mono font-bold text-sm">PHASE 01</span>
                <h4 className="font-bold text-white text-sm">발견과 문제 정의</h4>
                <p className="text-navy-300 leading-relaxed">
                  일상과 첨단 과학기술의 접점에서 탐구할 가치가 있는 명확한 연구 질문 도출
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-navy-800/80 border border-navy-700">
                <span className="text-secondary font-mono font-bold text-sm">PHASE 02</span>
                <h4 className="font-bold text-white text-sm">설계 및 프로토타입</h4>
                <p className="text-navy-300 leading-relaxed">
                  알고리즘 코딩, 하드웨어 회로 제작, 3D 모델링을 통한 가설 검증 시스템 구현
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-navy-800/80 border border-navy-700">
                <span className="text-secondary font-mono font-bold text-sm">PHASE 03</span>
                <h4 className="font-bold text-white text-sm">실증 실험 및 고도화</h4>
                <p className="text-navy-300 leading-relaxed">
                  정량적 데이터 측정 및 실사용자 테스트를 거쳐 문제점을 분석하고 2차 개선
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-navy-800/80 border border-navy-700">
                <span className="text-secondary font-mono font-bold text-sm">PHASE 04</span>
                <h4 className="font-bold text-white text-sm">성찰과 아카이빙</h4>
                <p className="text-navy-300 leading-relaxed">
                  연구 보고서 작성, 오픈소스 공유, 동료 평가 및 차세대 확장 연구 제안
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Privacy & Protection */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 flex items-start gap-4 shadow-subtle">
          <ShieldCheck className="w-6 h-6 text-secondary-dark flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-navy">학생 연구자 보호 및 저작권 방침</h3>
            <p className="text-xs text-navy-600 leading-relaxed">
              본 전시관에 등재된 모든 학생 연구물은 참여 학생들의 소중한 지적 산출물입니다.
              학생들의 프라이버시 보호를 위해 표시명(예: 김*우)으로 안전하게 공개되며,
              모든 연구물은 비상업적 학술 관람 목적으로만 열람하실 수 있습니다.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-800 shadow-card hover:shadow-hover transition-all transform hover:-translate-y-0.5"
          >
            <span>전시 프로젝트 관람하러 가기</span>
            <ArrowRight className="w-4 h-4 text-secondary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
