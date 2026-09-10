import { createClient } from "@supabase/supabase-js";

// 환경변수에 유효한 Supabase 설정이 있을 때만 Supabase 클라이언트를 초기화합니다.
// (비어있거나 무효한 기본값으로 인한 DNS 에러 및 요청 지연 방지)
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isPlaceholder = !rawUrl || rawUrl.includes("rhgofzciaomexnhrtogt") || rawUrl.trim() === "";

export const isSupabaseConfigured = Boolean(!isPlaceholder && rawUrl && rawKey);

export const supabase = isSupabaseConfigured && rawUrl && rawKey
  ? createClient(rawUrl, rawKey)
  : null;

