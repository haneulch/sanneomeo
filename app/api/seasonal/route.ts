import { NextResponse } from "next/server";
import { SEASONAL, SEASONAL_DEFAULT } from "@/data/seasonal";

/**
 * GET /api/seasonal — 이번 달 "지금 이 산" 추천.
 * 공공데이터 연동 지점: TourAPI 축제·행사 정보(TOUR_API_KEY)로
 * 실제 개화·축제 일정 기반 D-day 계산으로 교체 예정.
 */
export async function GET() {
  const month = Number(
    new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", month: "numeric" }).format(new Date())
  );
  const items = SEASONAL[month] ?? SEASONAL_DEFAULT;
  return NextResponse.json({ month, items });
}
