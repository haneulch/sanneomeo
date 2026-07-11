import { NextResponse } from "next/server";
import temples from "@/data/temples.json";

interface Temple {
  name: string;
  addr: string;
  phone: string;
  founded: string;
  history: string;
}

/**
 * GET /api/temples?q=태고사&addr=완주
 * 데이터 출처: 행정안전부_문화_전통사찰 (공공데이터포털, CSV → data/temples.json)
 * - q: 사찰명 (부분 일치)
 * - addr: 주소 필터 (부분 일치) — 동명 사찰 구분용
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const addr = searchParams.get("addr")?.trim();

  let items = temples as Temple[];
  if (q) items = items.filter((t) => t.name.includes(q));
  if (addr) items = items.filter((t) => t.addr.includes(addr));

  return NextResponse.json({ items: items.slice(0, 50) });
}
