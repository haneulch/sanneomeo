import { NextResponse } from "next/server";
import { MOUNTAINS } from "@/data/mountains";

/**
 * GET /api/mountains?region=jeolla&difficulty=easy
 *
 * 공공데이터 연동 지점 (로드맵):
 * - 산림청 100대 명산 / 등산로: process.env.FOREST_API_KEY
 * - 한국관광공사 TourAPI (다국어 관광정보·축제): process.env.TOUR_API_KEY
 * - 국토교통부 TAGO (버스·열차): process.env.TAGO_API_KEY
 * 현재는 data/mountains.ts 정적 데이터를 서빙하고,
 * 실 API 연동 시 이 라우트에서 fetch + 캐싱으로 교체한다.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const difficulty = searchParams.get("difficulty");

  let items = MOUNTAINS;
  if (region && region !== "all") items = items.filter((m) => m.r === region);
  if (difficulty && difficulty !== "all") items = items.filter((m) => m.d === difficulty);

  return NextResponse.json({ items });
}
