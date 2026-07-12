import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import { loadMountains } from "@/lib/mountains-loader";
import { HIDDEN, HIDDEN_MOUNTAINS } from "@/data/hidden";

export const runtime = "nodejs";

/**
 * GET /api/challenges — 현재 사용자 스탬프 기반 챌린지·뱃지 진행도.
 * 도별(시도) 챌린지 + 특수 챌린지(첫산행/천년고찰/100대명산) + 히든 뱃지 모두 계산.
 */
export async function GET() {
  const user = await getCurrentUser();
  const [stamps, { items: mountains }] = await Promise.all([
    getStore().listStamps(user.id),
    loadMountains(),
  ]);

  const byKo = new Map(mountains.map((m) => [m.ko, m]));
  const total = stamps.length;
  const templeCount = stamps.filter((s) => s.kind === "temple").length;
  const hiddenStamp = stamps.find((s) => HIDDEN_MOUNTAINS.has(s.mountainKo));
  const firstStamp = stamps[0];

  // 도별 집계: 로드된 산 목록에서 prov별 총계, 스탬프에서 방문 수
  const provTotal = new Map<string, number>();
  for (const m of mountains) {
    if (m.prov) provTotal.set(m.prov, (provTotal.get(m.prov) ?? 0) + 1);
  }
  const provDone = new Map<string, number>();
  for (const s of stamps) {
    const m = byKo.get(s.mountainKo);
    if (m?.prov) provDone.set(m.prov, (provDone.get(m.prov) ?? 0) + 1);
  }

  const provinces = [...provTotal.entries()]
    .map(([prov, tot]) => {
      const done = provDone.get(prov) ?? 0;
      return { prov, done, total: tot, complete: done >= tot && tot > 0 };
    })
    .sort(
      (a, b) =>
        Number(b.complete) - Number(a.complete) ||
        b.done / b.total - a.done / a.total ||
        b.total - a.total
    );

  const challenges = [
    { id: "first", done: Math.min(total, 1), total: 1, complete: total >= 1 },
    { id: "temple", done: templeCount, total: 3, complete: templeCount >= 3 },
    { id: "grand", done: total, total: 100, complete: total >= 100 },
    ...provinces.map((p) => ({
      id: "prov",
      prov: p.prov,
      done: p.done,
      total: p.total,
      complete: p.complete,
    })),
  ];

  const badges = [
    { id: "first", emoji: "🥾", earned: total >= 1, date: firstStamp?.stampedAt ?? "" },
    { id: "hidden", emoji: "💎", earned: !!hiddenStamp, date: hiddenStamp?.stampedAt ?? "" },
    { id: "pilgrim", emoji: "🏯", earned: templeCount >= 3, date: "" },
    { id: "grand", emoji: "👑", earned: total >= 100, date: "" },
    ...provinces
      .filter((p) => p.complete)
      .map((p) => ({ id: "prov", prov: p.prov, emoji: "🏅", earned: true, date: "" })),
  ];

  // 아직 못 찾은 히든 산 — 이름 없이 힌트만 (? 뱃지 탭 시 노출)
  const stampedKo = new Set(stamps.map((s) => s.mountainKo));
  const mysteries = HIDDEN.filter((h) => !stampedKo.has(h.ko)).map((h) => ({ hint: h.hint }));

  return NextResponse.json({ total, challenges, badges, mysteries });
}
