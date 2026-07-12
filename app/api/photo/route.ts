import { NextResponse } from "next/server";
import { fetchKeywordSpots } from "@/lib/publicdata";

export const runtime = "nodejs";

/**
 * GET /api/photo?m=대둔산
 * 산명으로 TourAPI 관광지 검색 → 대표 사진 URL. 산명 포함 + 이미지 있는 것 우선.
 * 없으면 image:null → 프론트가 SVG 폴백.
 */
const str = (v: unknown) => (v == null ? "" : String(v));

export async function GET(request: Request) {
  const ko = new URL(request.url).searchParams.get("m") ?? "";
  if (!ko) return NextResponse.json({ image: null, source: "static" });

  const spots = await fetchKeywordSpots(ko).catch(() => []);
  const withImg = spots.filter((s) => str(s.firstimage));

  // 산·공원 본체 우선, 부대시설(마을·캠핑·펜션·카페 등) 감점
  const PREFER = /(국립공원|도립공원|군립공원|자연휴양림|산$)/;
  const AVOID = /(촌|캠핑|펜션|카페|모텔|호텔|온천|맛집|리조트|스키|골프)/;
  const score = (title: string) => {
    let s = 0;
    if (title.includes(ko)) s += 5;
    if (PREFER.test(title)) s += 6;
    if (AVOID.test(title)) s -= 6;
    return s;
  };
  const best = withImg
    .slice()
    .sort((a, b) => score(str(b.title)) - score(str(a.title)))[0];

  if (!best) return NextResponse.json({ image: null, source: "static" });
  return NextResponse.json({
    image: str(best.firstimage),
    title: str(best.title),
    copyright: str(best.cpyrhtDivCd), // Type1/Type3 등 이용범위
    source: "live",
  });
}
