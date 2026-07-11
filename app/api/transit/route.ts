import { NextResponse } from "next/server";
import {
  fetchTrainCityCodes,
  fetchTrainStations,
  fetchTrainSchedule,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ko = searchParams.get("m") ?? "";
  const hub = TRANSIT_HUBS[ko];
  if (!hub) return NextResponse.json({ trains: [], source: "static" });

  try {
    const [depId, arrId] = await Promise.all([
      resolveStationId(SEOUL_STATION.city, SEOUL_STATION.station),
      resolveStationId(hub.city, hub.station),
    ]);
    if (!depId || !arrId) return NextResponse.json({ trains: [], source: "static" });

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
      source: trains.length ? "live" : "static",
    });
  } catch {
    return NextResponse.json({ trains: [], source: "static" });
  }
}
