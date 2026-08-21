import type { StoreAdapter } from "@/lib/store/types";
import { CsvStore } from "@/lib/store/csv-adapter";
import { SupabaseStore } from "@/lib/store/supabase-adapter";

// ── 저장소 선택 ───────────────────────────────────────────────
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 가 있으면 Supabase(Postgres),
// 없으면 CSV 파일 폴백 (로컬 개발·데모). API 라우트는 인터페이스에만 의존.
// ─────────────────────────────────────────────────────────────
let store: StoreAdapter | null = null;

export function getStore(): StoreAdapter {
  if (!store) {
    const useSupabase =
      !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    store = useSupabase ? new SupabaseStore() : new CsvStore();
  }
  return store;
}

export type { StoreAdapter } from "@/lib/store/types";
