import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://rhgofzciaomexnhrtogt.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZ29memNpYW9tZXhuaHJ0b2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMzg4NDEsImV4cCI6MjEwMzcxNDg0MX0.kOnzI0xjW158OX6MPxayzvLrP9iueV1TwNnhhqjAqdw";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
