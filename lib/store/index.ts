import type { StoreAdapter } from "@/lib/store/types";
import { CsvStore } from "@/lib/store/csv-adapter";

// ── 저장소 교체 지점 ──────────────────────────────────────────
// 지금: CSV 파일. 나중에 DB 붙이면 이 한 줄만 PrismaStore 등으로 교체.
//   const store: StoreAdapter = new PrismaStore();
// API 라우트·컴포넌트는 StoreAdapter 인터페이스에만 의존하므로 무영향.
// ─────────────────────────────────────────────────────────────
let store: StoreAdapter | null = null;

export function getStore(): StoreAdapter {
  if (!store) store = new CsvStore();
  return store;
}

export type { StoreAdapter } from "@/lib/store/types";
