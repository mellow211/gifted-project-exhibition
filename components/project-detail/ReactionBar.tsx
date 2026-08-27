"use client";

import React, { useState, useEffect } from "react";
import { ReactionType, ReactionCounts } from "@/types/project";
import { getProjectReactions, addProjectReaction } from "@/lib/project-service";
import { Sparkles, MessageCircleHeart } from "lucide-react";

interface ReactionBarProps {
  projectId: string;
}

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "clap", emoji: "👏", label: "멋져요" },
  { type: "idea", emoji: "💡", label: "아이디어가 좋아요" },
  { type: "rocket", emoji: "🚀", label: "발전이 기대돼요" },
  { type: "heart", emoji: "❤️", label: "응원해요" },
];

export const ReactionBar: React.FC<ReactionBarProps> = ({ projectId }) => {
  const [counts, setCounts] = useState<ReactionCounts>({
    clap: 0,
    idea: 0,
    rocket: 0,
    heart: 0,
  });
  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getProjectReactions(projectId).then(setCounts);
  }, [projectId]);

  const handleReact = async (type: ReactionType) => {
    setActiveReaction(type);

    // Optimistic UI update
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    const result = await addProjectReaction(projectId, type);
    setCounts(result.counts);

    if (result.alreadyVoted) {
      setMessage("잠시 후 다시 반응을 남길 수 있습니다.");
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage("학생 연구자에게 따뜻한 응원을 전했습니다!");
      setTimeout(() => setMessage(null), 3000);
    }

    setTimeout(() => setActiveReaction(null), 600);
  };

  return (
    <section className="py-12 border-b border-surface-border">
      <div className="bg-white rounded-2xl p-7 sm:p-9 border border-surface-border shadow-card text-center space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary uppercase">
            <MessageCircleHeart className="w-4 h-4" />
            <span>VISITOR REACTION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy">
            학생들의 열정과 탐구에 공감의 메시지를 남겨주세요
          </h2>
          <p className="text-xs text-navy-500 max-w-md mx-auto">
            개인정보 수집 없이 따뜻한 응원과 피드백을 전달할 수 있습니다.
          </p>
        </div>

        {/* Reaction Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {REACTIONS.map((item) => {
            const isSelected = activeReaction === item.type;
            const count = counts[item.type] || 0;

            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleReact(item.type)}
                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 group ${
                  isSelected
                    ? "border-primary bg-primary-light scale-105"
                    : "border-surface-border bg-surface hover:bg-white hover:border-primary/40 hover:shadow-subtle"
                }`}
              >
                <span className="text-2xl transform transition-transform group-hover:scale-125">
                  {item.emoji}
                </span>
                <span className="text-xs font-bold text-navy group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-surface-border text-navy-600">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toast / Message */}
        {message && (
          <p className="text-xs font-semibold text-primary animate-fade-up">
            ✨ {message}
          </p>
        )}
      </div>
    </section>
  );
};
