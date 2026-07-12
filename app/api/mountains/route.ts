import { NextResponse } from "next/server";
import { loadMountains } from "@/lib/mountains-loader";

/**
 * GET /api/mountains?region=jeolla&difficulty=easy
 * 데이터: 산림청 100대명산(라이브) + 큐레이션 병합 (lib/mountains-loader).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");
  const difficulty = searchParams.get("difficulty");

  const { items: all, source } = await loadMountains();

  let items = all;
  if (region && region !== "all") items = items.filter((m) => m.r === region);
  if (difficulty && difficulty !== "all") items = items.filter((m) => m.d === difficulty);

  return NextResponse.json({ items, source });
}
