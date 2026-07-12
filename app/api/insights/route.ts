import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { loadMountains } from "@/lib/mountains-loader";
import { HIDDEN_MOUNTAINS } from "@/data/hidden";

export const runtime = "nodejs";

/**
 * GET /api/insights — 지자체 대시보드용 방문 데이터 집계 (전체 사용자 스탬프).
 * 과제 10: 방문 데이터를 지역 관광 기획 근거로 환류.
 * 도별 분포·월별 추이·인기 산·숨은명산 발굴률 — 전부 실제 스탬프에서 산출.
 */
export async function GET() {
  const [stamps, { items: mountains }] = await Promise.all([
    getStore().listAllStamps(),
    loadMountains(),
  ]);
  const byKo = new Map(mountains.map((m) => [m.ko, m]));

  const totalVisits = stamps.length;
  const hikers = new Set(stamps.map((s) => s.userId)).size;
  const hiddenFound = new Set(
    stamps.filter((s) => HIDDEN_MOUNTAINS.has(s.mountainKo)).map((s) => s.mountainKo)
  ).size;

  const provCount = new Map<string, number>();
  const monthCount = new Map<string, number>();
  const mtnCount = new Map<string, number>();

  for (const s of stamps) {
    const m = byKo.get(s.mountainKo);
    if (m?.prov) provCount.set(m.prov, (provCount.get(m.prov) ?? 0) + 1);
    const ym = s.stampedAt.slice(0, 7);
    monthCount.set(ym, (monthCount.get(ym) ?? 0) + 1);
    mtnCount.set(s.mountainKo, (mtnCount.get(s.mountainKo) ?? 0) + 1);
  }

  const byProvince = [...provCount.entries()]
    .map(([prov, count]) => ({ prov, count }))
    .sort((a, b) => b.count - a.count);
  const byMonth = [...monthCount.entries()]
    .map(([ym, count]) => ({ ym, count }))
    .sort((a, b) => a.ym.localeCompare(b.ym));
  const topMountains = [...mtnCount.entries()]
    .map(([ko, count]) => ({ ko, en: byKo.get(ko)?.en ?? ko, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return NextResponse.json({
    totalVisits,
    hikers,
    hiddenFound,
    provincesCovered: byProvince.length,
    byProvince,
    byMonth,
    topMountains,
  });
}
