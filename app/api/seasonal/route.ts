import { NextResponse } from "next/server";
import { SEASONAL, SEASONAL_DEFAULT, type SeasonalPick } from "@/data/seasonal";
import { fetchFestivals } from "@/lib/publicdata";
import { MOUNTAINS } from "@/data/mountains";
import { distKm } from "@/lib/geo";

/**
 * GET /api/seasonal — 이번 달 "지금 이 산" 추천.
 * 정적 계절 픽 + TourAPI 진행 중 축제(라이브)를 산 30km 이내로 매칭해 병합.
 */

const FESTIVAL_TAG = { en: "Festival", ko: "축제", ja: "祭り", zh: "庆典" };

function kstToday(): { ymd: string; monthStartYmd: string; month: number } {
  const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" });
  const ymd = fmt.format(new Date()).replaceAll("-", "");
  return { ymd, monthStartYmd: ymd.slice(0, 6) + "01", month: Number(ymd.slice(4, 6)) };
}

async function liveFestivalPicks(lang: string): Promise<SeasonalPick[]> {
  const { ymd, monthStartYmd } = kstToday();
  let raw = await fetchFestivals(monthStartYmd, lang);
  if (!raw.length && lang !== "en") raw = await fetchFestivals(monthStartYmd, "en"); // 2순위 영어

  const picks: SeasonalPick[] = [];
  const usedMountains = new Set<string>();

  for (const f of raw) {
    const end = String(f.eventenddate ?? "");
    if (end && end < ymd) continue; // 종료된 축제 제외
    const lat = Number(f.mapy), lng = Number(f.mapx);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    // 30km 이내 가장 가까운 산 매칭
    let best: (typeof MOUNTAINS)[number] | null = null;
    let bestD = 30;
    for (const m of MOUNTAINS) {
      const d = distKm({ lat, lng }, m);
      if (d < bestD) { bestD = d; best = m; }
    }
    if (!best || usedMountains.has(best.en)) continue;
    usedMountains.add(best.en);

    const title = String(f.title ?? "").replace(/\s*\(.*?\)\s*$/, ""); // 괄호 한글 병기 제거
    if (!title) continue;

    picks.push({
      mountain: best.en,
      emoji: "🎪",
      title: { en: title, ko: title, ja: title, zh: title },
      tag: FESTIVAL_TAG,
    });
    if (picks.length >= 3) break;
  }
  return picks;
}

export async function GET(request: Request) {
  const lang = new URL(request.url).searchParams.get("lang") ?? "en";
  const { month } = kstToday();
  const staticPicks = SEASONAL[month] ?? SEASONAL_DEFAULT;
  const festivals = await liveFestivalPicks(lang);

  return NextResponse.json({
    month,
    items: [...staticPicks, ...festivals],
    source: festivals.length ? "live" : "static",
  });
}
