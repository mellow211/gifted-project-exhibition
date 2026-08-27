"use client";

import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Shield, Lock, Sparkles, KeyRound } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: (user: any) => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      // Fallback demo mode login
      onAuthenticated({ email: email || "admin@gifted.edu", role: "admin" });
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        onAuthenticated(data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onAuthenticated({ email: "curator@gifted-exhibition.edu", role: "admin", name: "수석 큐레이터" });
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-surface-border p-8 shadow-card space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-navy text-secondary flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-navy">전시관 관리자 콘솔</h2>
        <p className="text-xs text-navy-500">
          영재 프로젝트 등록, 큐레이션 설정 및 전시 상태를 관리합니다.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSupabaseLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-navy-700 mb-1">
            관리자 이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gifted.edu"
            className="w-full px-3.5 py-2 text-sm bg-white border border-surface-border rounded-lg text-navy focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2 text-sm bg-white border border-surface-border rounded-lg text-navy focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "인증 중..." : "Supabase 계정으로 로그인"}
        </button>
      </form>

      {/* Demo access toggle for immediate preview */}
      <div className="pt-4 border-t border-surface-border space-y-3">
        <div className="flex items-center justify-between text-xs text-navy-400">
          <span>개발 및 시연 모드</span>
          <span className="font-mono text-[11px] bg-secondary-light text-secondary-dark px-1.5 py-0.5 rounded">
            DEMO MODE
          </span>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 bg-primary-light hover:bg-primary/20 text-primary font-semibold text-xs rounded-lg border border-primary/30 transition-colors flex items-center justify-center gap-1.5"
        >
          <KeyRound className="w-4 h-4" />
          <span>데모 관리자 원클릭 입장</span>
        </button>
      </div>
    </div>
  );
};
