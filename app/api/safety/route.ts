import { NextResponse } from "next/server";
import { sunsetKST } from "@/lib/sun";

/**
 * GET /api/safety?lat=36.122&lng=127.322
 *
 * 공공데이터 연동 지점 (로드맵):
 * - 기상청 기상특보 조회서비스: process.env.KMA_API_KEY — alert 필드 대체
 * - 산림청 입산통제 정보: process.env.FOREST_API_KEY — access 필드 대체
 * 현재 alert/access는 데모 값, sunset은 좌표 기반 실계산.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? 36.122);
  const lng = Number(searchParams.get("lng") ?? 127.322);

  return NextResponse.json({
    sunset: sunsetKST(lat, lng),
    // 데모: 7월 폭염주의보 시나리오. 실연동 시 기상청 특보 API로 교체.
    alert: { level: "advisory", type: "heat" } as
      | { level: "advisory" | "warning"; type: string }
      | null,
    // 데모: 개방. 실연동 시 산림청 입산통제 데이터로 교체.
    access: "open" as "open" | "partial" | "closed",
  });
}
