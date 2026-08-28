import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white mt-24 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-navy-800">
          {/* Brand Philosophy */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-secondary border border-navy-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white">
                대전교육정보원 정보영재교육원
              </span>
            </div>
            <p className="text-navy-300 text-sm max-w-md leading-relaxed">
              <strong>2026 개인주제탐구발표대회 온라인 전시장</strong>은 정보영재 학생들이 던진 최초의 질문에서 출발하여,
              실험과 실패, 개선의 여정을 거쳐 도달한 성찰과 새로운 가능성을 기록하는 디지털 연구 전시 공간입니다.
            </p>
            <div className="flex items-center gap-2 text-xs text-navy-400">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>학생 연구자 보호를 위해 가명 처리된 표시명만 공개됩니다.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-400">
              EXHIBITION HALLS
            </h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li>
                <Link href="/projects?category=AI+%26+DATA" className="hover:text-white transition-colors">
                  AI & DATA (인공지능과 데이터)
                </Link>
              </li>
              <li>
                <Link href="/projects?category=SOFTWARE" className="hover:text-white transition-colors">
                  SOFTWARE (소프트웨어)
                </Link>
              </li>
              <li>
                <Link href="/projects?category=ROBOT+%26+IoT" className="hover:text-white transition-colors">
                  ROBOT & IoT (로봇 & 컴퓨팅)
                </Link>
              </li>
              <li>
                <Link href="/projects?category=SCIENCE" className="hover:text-white transition-colors">
                  SCIENCE (과학 탐구)
                </Link>
              </li>
              <li>
                <Link href="/projects?category=CREATIVE" className="hover:text-white transition-colors">
                  CREATIVE (창의융합)
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & Admin */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-400">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-sm text-navy-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  홈 (Home)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  전체 프로젝트 갤러리
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  전시회 소개 (About)
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-navy-400 hover:text-secondary transition-colors"
                >
                  <span>관리자 콘솔</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-400 gap-4">
          <p>© 2026 대전교육정보원 정보영재교육원. All rights reserved.</p>
          <div className="flex items-center gap-1 text-navy-400">
            <span>2026 정보영재 개인주제탐구발표대회</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
