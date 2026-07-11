import { NextResponse } from "next/server";
import { sunsetKST } from "@/lib/sun";
import { fetchKmaNow } from "@/lib/kma";

/**
 * GET /api/safety?lat=36.122&lng=127.322
 *
 * - sunset: 좌표 기반 실계산
 * - weather: 기상청 초단기실황 (DATA_GO_KR_KEY) — 기온·강수 실데이터
 * - alert: 실황 기반 판정 (기온 33°C↑ 폭염, 강수 감지 시 우천 주의).
 *   기상특보 API 승인 시 공식 특보로 교체 지점.
 * - access: 데모 값 — 산림청 입산통제 데이터 연동 지점.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat") ?? 36.122);
  const lng = Number(searchParams.get("lng") ?? 127.322);

  const kma = await fetchKmaNow(lat, lng);

  let alert: { level: "advisory" | "warning"; type: string } | null = null;
  if (kma?.tempC != null && kma.tempC >= 33) alert = { level: "advisory", type: "heat" };
  else if (kma?.rainMm != null && kma.rainMm > 0) alert = { level: "advisory", type: "rain" };

  return NextResponse.json({
    sunset: sunsetKST(lat, lng),
    weather: kma, // { tempC, rainMm } | null
    alert,
    access: "open" as const,
    source: kma ? "live" : "static",
  });
}
