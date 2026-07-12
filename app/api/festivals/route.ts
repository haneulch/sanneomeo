import { NextResponse } from "next/server";
import { fetchFestivals } from "@/lib/publicdata";
import { distKm } from "@/lib/geo";

/**
 * GET /api/festivals?lat=36.1&lng=127.3&lang=ko
 * 산 좌표 40km 이내 진행 중 축제 (TourAPI searchFestival2, 언어별).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const lang = searchParams.get("lang") ?? "en";
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ items: [], source: "static" });
  }

  const ymd = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" })
    .format(new Date())
    .replaceAll("-", "");
  const monthStart = ymd.slice(0, 6) + "01";
  const raw = await fetchFestivals(monthStart, lang);

  const items = raw
    .map((f) => {
      const flat = Number(f.mapy), flng = Number(f.mapx);
      const dist = Number.isFinite(flat) && Number.isFinite(flng)
        ? distKm({ lat, lng }, { lat: flat, lng: flng })
        : Infinity;
      return {
        title: String(f.title ?? "").replace(/\s*\(.*?\)\s*$/, ""),
        start: String(f.eventstartdate ?? ""),
        end: String(f.eventenddate ?? ""),
        dist,
      };
    })
    .filter((f) => f.title && f.dist <= 40 && (!f.end || f.end >= ymd))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4)
    .map(({ title, start, end, dist }) => ({ title, start, end, distKm: Math.round(dist) }));

  return NextResponse.json({ items, source: items.length ? "live" : "static" });
}
