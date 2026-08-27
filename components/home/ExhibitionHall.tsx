"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectCategory } from "@/types/project";
import { getAllProjects } from "@/lib/project-service";
import { Cpu, Terminal, Bot, FlaskConical, Palette, ArrowRight, Compass } from "lucide-react";

interface HallMeta {
  id: ProjectCategory;
  name: string;
  nameKo: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradient: string;
}

const HALLS: HallMeta[] = [
  {
    id: "AI & DATA",
    name: "AI & DATA",
    nameKo: "인공지능과 데이터",
    description: "컴퓨터 비전, 시계열 예측, 멀티모달 감정 인식 등 지능형 데이터 과학",
    icon: Cpu,
    accentColor: "#6C63FF",
    gradient: "from-indigo-500/10 to-primary/5",
  },
  {
    id: "SOFTWARE",
    name: "SOFTWARE",
    nameKo: "소프트웨어와 코딩",
    description: "게이미피케이션 플랫폼, 환경 시뮬레이션, 사용자 인터페이스 설계",
    icon: Terminal,
    accentColor: "#3B82F6",
    gradient: "from-blue-500/10 to-indigo-500/5",
  },
  {
    id: "ROBOT & IoT",
    name: "ROBOT & IoT",
    nameKo: "로봇과 피지컬 컴퓨팅",
    description: "식물 생체 신호 수집, 초음파 햅틱 센서, 임베디드 제어 하드웨어",
    icon: Bot,
    accentColor: "#27D3A2",
    gradient: "from-emerald-500/10 to-secondary/5",
  },
  {
    id: "SCIENCE",
    name: "SCIENCE",
    nameKo: "과학 탐구",
    description: "국소 미세먼지 기류 측정, 지구과학 데이터 분석, 가설 검증 실험",
    icon: FlaskConical,
    accentColor: "#0D9488",
    gradient: "from-teal-500/10 to-emerald-500/5",
  },
  {
    id: "CREATIVE",
    name: "CREATIVE",
    nameKo: "창의융합",
    description: "동적 지식 그래프 시각화, 생태 네트워크 도감, 예술·기술 융합",
    icon: Palette,
    accentColor: "#9333EA",
    gradient: "from-purple-500/10 to-pink-500/5",
  },
];

export const ExhibitionHall: React.FC = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getAllProjects().then((projects) => {
      const tally: Record<string, number> = {};
      projects.forEach((p) => {
        tally[p.category] = (tally[p.category] || 0) + 1;
      });
      setCounts(tally);
    });
  }, []);

  return (
    <section id="exhibition-hall" className="py-20 bg-surface-muted/50 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>EXPLORE THE EXHIBITION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
            어떤 생각을 만나볼까요?
          </h2>
          <p className="text-sm text-navy-500">
            관심 있는 탐구 영역을 선택하여 학생 연구자들의 아이디어와 프로젝트를 감상하세요.
          </p>
        </div>

        {/* 5 Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HALLS.map((hall) => {
            const Icon = hall.icon;
            const projectCount = counts[hall.id] || 0;

            return (
              <Link
                key={hall.id}
                href={`/projects?category=${encodeURIComponent(hall.id)}`}
                className="group relative bg-white rounded-2xl border border-surface-border p-7 shadow-subtle hover:shadow-hover card-hover-effect flex flex-col justify-between overflow-hidden"
              >
                {/* Background ambient accent */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${hall.gradient} blur-2xl opacity-60 group-hover:scale-150 transition-transform duration-500`}
                />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: hall.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-surface-muted text-navy-600 border border-surface-border">
                      {projectCount} Projects
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-navy-400">
                      {hall.name}
                    </span>
                    <h3 className="text-lg font-bold text-navy group-hover:text-primary transition-colors">
                      {hall.nameKo}
                    </h3>
                  </div>

                  <p className="text-xs text-navy-500 leading-relaxed">
                    {hall.description}
                  </p>
                </div>

                <div className="relative pt-6 mt-4 border-t border-surface-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>전시관 입장하기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
