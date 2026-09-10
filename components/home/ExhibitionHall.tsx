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
    id: "SW초급",
    name: "SW초급",
    nameKo: "소프트웨어 초급",
    description: "파이썬 기초 문법과 Tkinter GUI, 실생활 문제 해결 알고리즘 탐구",
    icon: Terminal,
    accentColor: "#0284C7",
    gradient: "from-sky-500/10 to-blue-500/5",
  },
  {
    id: "SW고급",
    name: "SW고급",
    nameKo: "소프트웨어 고급",
    description: "객체지향 설계, 시뮬레이션 알고리즘 및 지능형 웹 애플리케이션 구현",
    icon: Cpu,
    accentColor: "#4F46E5",
    gradient: "from-indigo-500/10 to-primary/5",
  },
  {
    id: "로봇초급",
    name: "로봇초급",
    nameKo: "로봇과 피지컬컴퓨팅 초급",
    description: "마이크로컨트롤러, 센서 제어 및 스마트 피지컬 컴퓨팅 하드웨어 제작",
    icon: Bot,
    accentColor: "#059669",
    gradient: "from-emerald-500/10 to-teal-500/5",
  },
  {
    id: "로봇고급",
    name: "로봇고급",
    nameKo: "로봇과 메카트로닉스 고급",
    description: "자율주행 메커니즘, 정밀 모터 제어 및 지능형 로보틱스 시스템 연구",
    icon: FlaskConical,
    accentColor: "#D97706",
    gradient: "from-amber-500/10 to-orange-500/5",
  },
  {
    id: "AI",
    name: "AI",
    nameKo: "인공지능 연구",
    description: "컴퓨터 비전, 자연어 처리, 딥러닝 객체 인식 및 지능형 데이터 과학",
    icon: Palette,
    accentColor: "#7C3AED",
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
