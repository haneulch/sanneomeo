// 공공데이터포털 공용 클라이언트.
// 단일 인증키(DATA_GO_KR_KEY)로 승인받은 모든 API 호출.
// 키 없거나 호출 실패 시 각 라우트가 정적 데이터로 폴백한다.

export const DATA_KEY = process.env.DATA_GO_KR_KEY ?? "";

export async function fetchApi(
  base: string,
  params: Record<string, string>,
  revalidateSec = 86400
): Promise<unknown | null> {
  if (!DATA_KEY) return null;
  const qs = new URLSearchParams({ serviceKey: DATA_KEY, ...params });
  try {
    const res = await fetch(`${base}?${qs}`, {
      next: { revalidate: revalidateSec },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    // 인증 오류 등은 XML로 내려옴 — JSON 파싱 실패 시 null
    try {
      return JSON.parse(text);
    } catch {
      console.error("[publicdata] non-JSON response:", text.slice(0, 200));
      return null;
    }
  } catch (e) {
    console.error("[publicdata] fetch failed:", base, e);
    return null;
  }
}

/** 응답 구조에서 body.items.item 배열을 방어적으로 추출 */
export function extractItems(json: unknown): Record<string, unknown>[] {
  if (!json || typeof json !== "object") return [];
  const body = (json as { response?: { body?: { items?: { item?: unknown } } } })
    .response?.body?.items?.item;
  if (Array.isArray(body)) return body as Record<string, unknown>[];
  if (body && typeof body === "object") return [body as Record<string, unknown>];
  return [];
}

/** 한국등산트레킹지원센터_100대명산 목록정보 */
export async function fetchTop100(): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/B553662/top100FamtListBasiInfoService/getTop100FamtListBasiInfoList",
    { numOfRows: "100", pageNo: "1", type: "json", _type: "json" }
  );
  return extractItems(json);
}

/** 한국관광공사 TourAPI 영문 — 좌표 기반 주변 관광지 */
export async function fetchNearbyTour(
  lng: number,
  lat: number,
  radius = 15000
): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/B551011/EngService1/locationBasedList1",
    {
      MobileOS: "ETC",
      MobileApp: "SanNeomeo",
      _type: "json",
      mapX: String(lng),
      mapY: String(lat),
      radius: String(radius),
      arrange: "S", // 거리순+이미지
      numOfRows: "6",
      pageNo: "1",
    },
    3600
  );
  return extractItems(json);
}
