// 기상청 단기예보(초단기실황) 연동.
// 위경도 → 기상청 격자(nx, ny) 변환은 기상청 공식 Lambert Conformal Conic 공식.

import { fetchApi, extractItems } from "@/lib/publicdata";

export function toGrid(lat: number, lng: number): { nx: number; ny: number } {
  const RE = 6371.00877, GRID = 5.0;
  const SLAT1 = 30.0, SLAT2 = 60.0, OLON = 126.0, OLAT = 38.0;
  const XO = 43, YO = 136;
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD, slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD, olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

/** KST 기준 초단기실황 base_date/base_time (매시 40분 이후 직전 정시 자료) */
function baseDateTime(): { base_date: string; base_time: string } {
  const now = new Date(Date.now() + 9 * 3600 * 1000); // KST
  let h = now.getUTCHours();
  let d = new Date(now);
  if (now.getUTCMinutes() < 45) {
    h -= 1;
    if (h < 0) {
      h = 23;
      d = new Date(now.getTime() - 86400 * 1000);
    }
  }
  const ymd =
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, "0") +
    String(d.getUTCDate()).padStart(2, "0");
  return { base_date: ymd, base_time: String(h).padStart(2, "0") + "00" };
}

export interface KmaNow {
  tempC: number | null; // T1H 기온
  rainMm: number | null; // RN1 1시간 강수량
}

export async function fetchKmaNow(lat: number, lng: number): Promise<KmaNow | null> {
  const { nx, ny } = toGrid(lat, lng);
  const { base_date, base_time } = baseDateTime();
  const json = await fetchApi(
    "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst",
    {
      dataType: "JSON",
      numOfRows: "10",
      pageNo: "1",
      base_date,
      base_time,
      nx: String(nx),
      ny: String(ny),
    },
    600 // 10분 캐시
  );
  const items = extractItems(json);
  if (!items.length) return null;

  const val = (cat: string) => {
    const it = items.find((i) => i.category === cat);
    const n = it ? Number(it.obsrValue) : NaN;
    return Number.isFinite(n) ? n : null;
  };
  return { tempC: val("T1H"), rainMm: val("RN1") };
}
