import { NextResponse } from "next/server";
import { fetchPeakPoi, fetchTrailPoi } from "@/lib/publicdata";

export const runtime = "nodejs";

/**
 * GET /api/poi?m=지리산
 * 100대명산 봉우리POI + 숲길POI (한국등산트레킹지원센터 B553662).
 * 응답 필드명이 명세에 없어 후보 키를 순서대로 시도(교통POI와 동일 방식).
 * komount 백엔드 불안정 시 빈 배열 → 프론트 패널 숨김.
 */
const str = (v: unknown) => (v == null ? "" : String(v));
function poiName(r: Record<string, unknown>): string {
  return str(r.poiNm ?? r.placeNm ?? r.frtrlNm ?? r.name ?? r.title ?? r.peakNm);
}
function poiType(r: Record<string, unknown>): string {
  return str(r.placeTpeNm ?? r.placeTpeCd ?? r.type ?? "");
}
function elev(r: Record<string, unknown>): string {
  const n = Number(r.aslAltide ?? r.elev ?? r.hg);
  return Number.isFinite(n) && n > 0 ? `${Math.round(n)} m` : "";
}

export async function GET(request: Request) {
  const ko = new URL(request.url).searchParams.get("m") ?? "";
  if (!ko) return NextResponse.json({ peaks: [], features: [], source: "static" });

  const [peakRaw, trailRaw] = await Promise.all([
    fetchPeakPoi(ko).catch(() => []),
    fetchTrailPoi(ko).catch(() => []),
  ]);

  const peaks = peakRaw
    .map((r) => ({ name: poiName(r), elev: elev(r) }))
    .filter((p) => p.name)
    .slice(0, 6);

  const features = trailRaw
    .map((r) => ({ name: poiName(r), type: poiType(r) }))
    .filter((f) => f.name)
    .slice(0, 6);

  const source = peaks.length || features.length ? "live" : "static";
  return NextResponse.json({ peaks, features, source });
}
