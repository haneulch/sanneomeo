import { NextResponse } from "next/server";
import { fetchNearbyTour } from "@/lib/publicdata";

/**
 * GET /api/nearby?lat=36.122&lng=127.322
 * 한국관광공사 TourAPI 영문 위치기반 관광정보 (DATA_GO_KR_KEY).
 * 키 없거나 실패 시 빈 배열 — 프론트는 섹션 자체를 숨긴다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? 36.122);
  const lng = Number(searchParams.get("lng") ?? 127.322);

  const raw = await fetchNearbyTour(lng, lat);
  const items = raw
    .map((r) => ({
      title: String(r.title ?? ""),
      addr: String(r.addr1 ?? ""),
      distM: Math.round(Number(r.dist ?? 0)),
      image: String(r.firstimage2 ?? r.firstimage ?? ""),
    }))
    .filter((i) => i.title)
    .sort((a, b) => a.distM - b.distM)
    .slice(0, 4);

  return NextResponse.json({ items, source: items.length ? "live" : "static" });
}
