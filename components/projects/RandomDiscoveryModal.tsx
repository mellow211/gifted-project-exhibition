"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getRandomProjectSlug } from "@/lib/project-service";
import { Sparkles, Dices, ArrowRight, X } from "lucide-react";

export const RandomDiscoveryButton: React.FC = () => {
  const router = useRouter();
  const [isDiscovering, setIsDiscovering] = useState(false);

  const handleRandomDiscovery = async () => {
    setIsDiscovering(true);
    const slug = await getRandomProjectSlug();
    if (slug) {
      setTimeout(() => {
        router.push(`/projects/${slug}`);
        setIsDiscovering(false);
      }, 400);
    } else {
      setIsDiscovering(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRandomDiscovery}
      disabled={isDiscovering}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 text-white text-xs font-semibold shadow-card hover:shadow-hover transform hover:-translate-y-0.5 transition-all disabled:opacity-75"
    >
      <Dices className={`w-4 h-4 text-secondary ${isDiscovering ? "animate-spin" : ""}`} />
      <span>{isDiscovering ? "전시작품 탐색 중..." : "🎲 우연히 만나는 프로젝트"}</span>
    </button>
  );
};
