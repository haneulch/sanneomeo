import { MOUNTAINS } from "@/data/mountains";
import { fetchTop100 } from "@/lib/publicdata";
import { romanize } from "@/lib/romanize";
import { normalizeProv } from "@/lib/provinces";
import type { Difficulty, Mountain, Region } from "@/lib/types";

// 100대명산 목록 로더 — 라이브(산림청) + 큐레이션 병합. /api/mountains, /api/challenges 공용.

function toRegion(sido: string): Region {
  if (/서울|경기|인천/.test(sido)) return "seoul";
  if (/강원/.test(sido)) return "gangwon";
  if (/충청|충북|충남|대전|세종/.test(sido)) return "chungcheong";
  if (/전라|전북|전남|광주/.test(sido)) return "jeolla";
  if (/경상|경북|경남|대구|울산|부산/.test(sido)) return "gyeongsang";
  if (/제주/.test(sido)) return "jeju";
  return "gyeongsang";
}
function toDifficulty(elev: number): Difficulty {
  if (elev >= 1300) return "hard";
  if (elev >= 600) return "mod";
  return "easy";
}
function estHours(elev: number): number {
  if (elev < 500) return 2.5;
  if (elev < 800) return 3.5;
  if (elev < 1200) return 4.5;
  if (elev < 1600) return 6;
  return 8;
}
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export async function loadMountains(): Promise<{ items: Mountain[]; source: "live" | "static" }> {
  const raw = await fetchTop100();
  if (!raw.length) return { items: MOUNTAINS, source: "static" };

  const curated = new Map(MOUNTAINS.map((m) => [m.ko, m]));
  const items = raw
    .map((r): Mountain => {
      const ko = str(r.frtrlNm ?? r.mtnNm ?? r.mntnnm).replace(/\s/g, "");
      const hit = curated.get(ko);
      if (hit) return hit;

      const elev = Math.round(num(r.aslAltide ?? r.mntheight ?? r.hg));
      const sido = str(r.ctpvNm ?? r.addrNm ?? r.areanm);
      return {
        en: romanize(ko),
        ko,
        ja: ko,
        zh: ko,
        r: toRegion(sido),
        prov: normalizeProv(sido),
        d: toDifficulty(elev),
        elev,
        h: estHours(elev),
        temple: false,
        got: false,
        lat: num(r.lat ?? r.latitude),
        lng: num(r.lot ?? r.lon ?? r.longitude),
      };
    })
    .filter((m) => m.ko);

  return items.length >= 50 ? { items, source: "live" } : { items: MOUNTAINS, source: "static" };
}
