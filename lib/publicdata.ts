// 공공데이터포털 공용 클라이언트.
// 단일 인증키(DATA_GO_KR_KEY)로 승인받은 모든 API 호출.
// 키 없거나 호출 실패 시 각 라우트가 정적 데이터로 폴백한다.

export const DATA_KEY = process.env.DATA_GO_KR_KEY ?? "";

/** 언어 → TourAPI 서비스명 (국문/영문/일문/중문 간체) */
export const TOUR_SERVICE: Record<string, string> = {
  ko: "KorService2",
  en: "EngService2",
  ja: "JpnService2",
  zh: "ChsService2",
};

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

/** 한국관광공사 TourAPI — 진행 중 축제 (좌표 포함, 언어별 서비스) */
export async function fetchFestivals(
  fromYmd: string,
  lang = "en"
): Promise<Record<string, unknown>[]> {
  const service = TOUR_SERVICE[lang] ?? "EngService2";
  const json = await fetchApi(
    `https://apis.data.go.kr/B551011/${service}/searchFestival2`,
    {
      MobileOS: "ETC",
      MobileApp: "SanNeomeo",
      _type: "json",
      eventStartDate: fromYmd,
      arrange: "A",
      numOfRows: "100",
      pageNo: "1",
    },
    21600 // 6시간 캐시
  );
  return extractItems(json);
}

/** TAGO 열차정보 — 도시코드/역목록/출도착 시간표 (1613000/TrainInfo/Get*) */
export async function fetchTrainCityCodes(): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/1613000/TrainInfo/GetCtyCodeList",
    { _type: "json", numOfRows: "50", pageNo: "1" }
  );
  return extractItems(json);
}

export async function fetchTrainStations(cityCode: string): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/1613000/TrainInfo/GetCtyAcctoTrainSttnList",
    { _type: "json", cityCode, numOfRows: "200", pageNo: "1" }
  );
  return extractItems(json);
}

export async function fetchTrainSchedule(
  depPlaceId: string,
  arrPlaceId: string,
  ymd: string
): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/1613000/TrainInfo/GetStrtpntAlocFndTrainInfo",
    {
      _type: "json",
      depPlaceId,
      arrPlaceId,
      depPlandTime: ymd,
      numOfRows: "8",
      pageNo: "1",
    },
    3600
  );
  return extractItems(json);
}

/**
 * 한국등산트레킹지원센터 100대명산 POI 계열 (B553662).
 * srchFrtrlNm = 산명. 승인 전에는 게이트웨이가 "Forbidden" 반환 → [] 폴백.
 */
async function fetchKomountPoi(
  service: string,
  op: string,
  frtrlNm: string
): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(`https://apis.data.go.kr/B553662/${service}/${op}`, {
    type: "json",
    _type: "json",
    numOfRows: "30",
    pageNo: "1",
    srchFrtrlNm: frtrlNm,
  });
  return extractItems(json);
}

/** 100대명산 교통시설POI — 등산로 입구 버스정류장·터미널 등 */
export function fetchTransitPoi(frtrlNm: string) {
  return fetchKomountPoi("trnspPoiInfoService", "getTrnspPoiInfoList", frtrlNm);
}

/** 100대명산 봉우리POI */
export function fetchPeakPoi(frtrlNm: string) {
  return fetchKomountPoi("peakPoiInfoService", "getPeakPoiInfoList", frtrlNm);
}

/** 100대명산 숲길POI (약수터·표지판·쉼터 등 16종) */
export function fetchTrailPoi(frtrlNm: string) {
  return fetchKomountPoi("fmmtnFrtrlPoiInfoService", "getFmmtnFrtrlPoiInfoList", frtrlNm);
}

/** 국립산림과학원 산악기상 관측소 목록·실황 (1400377/mtweather) */
export async function fetchMtWeather(): Promise<Record<string, unknown>[]> {
  const json = await fetchApi(
    "https://apis.data.go.kr/1400377/mtweather/mountListSearch",
    { _type: "json", numOfRows: "200", pageNo: "1" },
    1800
  );
  return extractItems(json);
}

/** 한국관광공사 TourAPI — 좌표 기반 주변 관광지 (언어별 서비스) */
export async function fetchNearbyTour(
  lng: number,
  lat: number,
  lang = "en",
  radius = 15000
): Promise<Record<string, unknown>[]> {
  const service = TOUR_SERVICE[lang] ?? "EngService2";
  const json = await fetchApi(
    `https://apis.data.go.kr/B551011/${service}/locationBasedList2`,
    {
      MobileOS: "ETC",
      MobileApp: "SanNeomeo",
      _type: "json",
      mapX: String(lng),
      mapY: String(lat),
      radius: String(radius),
      numOfRows: "10",
      pageNo: "1",
    },
    3600
  );
  return extractItems(json);
}
