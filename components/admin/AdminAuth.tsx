"use client";

import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Shield, Lock, UserCheck } from "lucide-react";

interface AdminAuthProps {
  onAuthenticated: (user: any) => void;
}

// 환경변수가 없을 때 사용할 기본 관리자 계정 (필요시 .env.local 또는 배포 환경변수에서 덮어쓰기 가능)
const DEFAULT_ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "gifted2026!";

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const inputUser = username.trim();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      // 1. Supabase Auth가 연동되어 있을 경우 Supabase 이메일 로그인 시도
      if (isSupabaseConfigured && supabase && inputUser.includes("@")) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: inputUser,
          password: inputPass,
        });

        if (error) {
          setErrorMsg(error.message || "인증에 실패했습니다.");
        } else if (data.user) {
          onAuthenticated(data.user);
          return;
        }
      }

      // 2. 지정된 관리자 계정(ID / PW) 일치 검증
      if (
        (inputUser === DEFAULT_ADMIN_USERNAME || inputUser === "admin@gifted.edu") &&
        inputPass === DEFAULT_ADMIN_PASSWORD
      ) {
        onAuthenticated({
          email: `${inputUser}@gifted-exhibition.edu`,
          name: "전시관 최고관리자",
          role: "admin",
          authenticatedAt: new Date().toISOString(),
        });
      } else {
        setErrorMsg("관리자 아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-surface-border p-8 shadow-card space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-navy text-secondary flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <span className="text-[11px] font-bold text-primary tracking-wide">
          대전교육정보원정보영재교육원
        </span>
        <h2 className="text-xl font-bold text-navy">2026 개인주제탐구발표대회 관리자 인증</h2>
        <p className="text-xs text-navy-500">
          인가된 관리자 계정으로 로그인해야만 프로젝트 관리 콘솔에 접근할 수 있습니다.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-navy-700 mb-1">
            관리자 아이디 (또는 이메일)
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="관리자 아이디 입력"
            autoComplete="username"
            required
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-surface-border rounded-lg text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
            autoComplete="current-password"
            required
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-surface-border rounded-lg text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Lock className="w-3.5 h-3.5 text-secondary" />
          <span>{loading ? "인증 확인 중..." : "관리자 콘솔 로그인"}</span>
        </button>
      </form>

      <div className="pt-3 text-center border-t border-surface-border">
        <p className="text-[11px] text-navy-400">
          🔒 비인가자의 무단 접근 및 조작 시도는 제한됩니다.
        </p>
      </div>
    </div>
  );
};

