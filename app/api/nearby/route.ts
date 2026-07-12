import { NextResponse } from "next/server";
import { fetchNearbyTour } from "@/lib/publicdata";

/**
 * GET /api/nearby?lat=&lng=&lang=
 * 주변 관광지(items) + 하산 후 먹거리(food, contentTypeId=39) — 언어별, 없으면 영어 폴백.
 */
function mapItems(raw: Record<string, unknown>[]) {
  return raw
    .map((r) => ({
      title: String(r.title ?? ""),
      addr: String(r.addr1 ?? ""),
      distM: Math.round(Number(r.dist ?? 0)),
    }))
    .filter((i) => i.title)
    .sort((a, b) => a.distM - b.distM)
    .slice(0, 4);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? 36.122);
  const lng = Number(searchParams.get("lng") ?? 127.322);
  const lang = searchParams.get("lang") ?? "en";

  // 폴백 체인: 선택언어 → 영어 → 한국어(데이터 최다). 식당 등 영문 서비스가 희소해서 ko까지 내려감.
  const withFallback = async (contentTypeId: string) => {
    let raw = await fetchNearbyTour(lng, lat, lang, contentTypeId);
    if (!raw.length && lang !== "en") raw = await fetchNearbyTour(lng, lat, "en", contentTypeId);
    if (!raw.length && lang !== "ko") raw = await fetchNearbyTour(lng, lat, "ko", contentTypeId);
    return mapItems(raw);
  };

  const [items, food] = await Promise.all([
    withFallback(""), // 관광지 등 혼합
    withFallback("39"), // 음식점
  ]);

  return NextResponse.json({ items, food, source: items.length || food.length ? "live" : "static" });
}
