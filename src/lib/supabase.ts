import { createClient } from "@supabase/supabase-js";
import type { ValueChainData } from "@/components/valuechain/IndustryValueChain";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
  id: string;
  title: string;
  industry: string | null;
  source_url: string | null;
  summary: string;
  insight: string;
  value_chain: ValueChainData | null;
  created_at: string;
};

export const INDUSTRIES = [
  "금융 / 핀테크",
  "테크 / IT",
  "헬스케어 / 바이오",
  "소비재 / 리테일",
  "에너지 / 환경",
  "제조 / 산업",
  "부동산 / 인프라",
  "미디어 / 엔터테인먼트",
  "글로벌 매크로 / 경제",
  "기타",
] as const;
