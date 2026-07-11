import { NextResponse } from "next/server";
import {
  fetchTrainCityCodes,
  fetchTrainStations,
  fetchTrainSchedule,
  fetchTransitPoi,
} from "@/lib/publicdata";
import { TRANSIT_HUBS, SEOUL_STATION } from "@/data/transit-hubs";

/**
 * GET /api/transit?m=대둔산
 * 서울 → 산 인근 허브역 오늘 열차 시간표 (TAGO 열차정보).
 * 도시코드·역 ID는 런타임 해석. 서비스 미승인/실패 시 빈 결과 → 프론트 숨김.
 */

const str = (v: unknown) => (v == null ? "" : String(v));

async function resolveStationId(cityName: string, stationName: string): Promise<string | null> {
  const cities = await fetchTrainCityCodes();
  const city = cities.find((c) => str(c.cityname).includes(cityName));
  if (!city) return null;
  const stations = await fetchTrainStations(str(city.citycode));
  const st = stations.find((s) => str(s.nodename).includes(stationName));
  return st ? str(st.nodeid) : null;
}

function hhmm(v: unknown): string {
  // TAGO depplandtime: YYYYMMDDHHMMSS 또는 YYYYMMDDHHMM
  const s = str(v);
  return s.length >= 12 ? `${s.slice(8, 10)}:${s.slice(10, 12)}` : s;
}

/** 교통시설POI 응답 필드명이 확정 전이라 후보 키를 순서대로 시도 */
function poiName(r: Record<string, unknown>): string {
  return str(r.poiNm ?? r.placeNm ?? r.frtrlNm ?? r.name ?? r.title);
}
function poiType(r: Record<string, unknown>): string {
  return str(r.placeTpeCd ?? r.placeTpeNm ?? r.type ?? "");
}

async function loadTransitPoi(ko: string) {
  try {
    const raw = await fetchTransitPoi(ko);
    return raw
      .map((r) => ({ name: poiName(r), type: poiType(r) }))
      .filter((p) => p.name)
      .slice(0, 5);
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ko = searchParams.get("m") ?? "";
  const hub = TRANSIT_HUBS[ko];

  // 100대명산 교통시설POI (승인 전 빈 배열) — 허브 매핑 없는 산도 시도
  const poiPromise = ko ? loadTransitPoi(ko) : Promise.resolve([]);

  if (!hub) {
    return NextResponse.json({ trains: [], poi: await poiPromise, source: "static" });
  }

  try {
    const [depId, arrId] = await Promise.all([
      resolveStationId(SEOUL_STATION.city, SEOUL_STATION.station),
      resolveStationId(hub.city, hub.station),
    ]);
    if (!depId || !arrId) {
      return NextResponse.json({ trains: [], poi: await poiPromise, source: "static" });
    }

    const ymd = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" })
      .format(new Date())
      .replaceAll("-", "");
    const raw = await fetchTrainSchedule(depId, arrId, ymd);

    const trains = raw
      .map((r) => ({
        dep: hhmm(r.depplandtime),
        arr: hhmm(r.arrplandtime),
        type: str(r.traingradename),
        fare: Number(r.adultcharge) || 0,
      }))
      .filter((t) => t.dep)
      .slice(0, 5);

    return NextResponse.json({
      hub: { ko: hub.station, en: hub.stationEn },
      trains,
      poi: await poiPromise,
      source: trains.length ? "live" : "static",
    });
  } catch {
    return NextResponse.json({ trains: [], poi: await poiPromise, source: "static" });
  }
}
