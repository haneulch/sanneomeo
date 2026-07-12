import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";
import type { StampKind } from "@/lib/store/types";

// CSV 파일 쓰기 → Node 런타임 필요
export const runtime = "nodejs";

/** GET /api/stamps — 현재 사용자의 스탬프 목록 */
export async function GET() {
  const user = await getCurrentUser();
  const stamps = await getStore().listStamps(user.id);
  return NextResponse.json({ stamps });
}

/** POST /api/stamps { mountainKo, mountainEn, kind } — 스탬프 적립(중복 무시) */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = (await request.json().catch(() => ({}))) as {
    mountainKo?: string;
    mountainEn?: string;
    kind?: StampKind;
  };
  if (!body.mountainKo || !body.mountainEn) {
    return NextResponse.json({ error: "mountainKo and mountainEn required" }, { status: 400 });
  }
  const stamp = await getStore().addStamp(user.id, {
    mountainKo: body.mountainKo,
    mountainEn: body.mountainEn,
    kind: body.kind === "temple" ? "temple" : "peak",
  });
  const stamps = await getStore().listStamps(user.id);
  return NextResponse.json({ stamp, stamps });
}
