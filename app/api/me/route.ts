import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

/** GET /api/me — 현재 로그인 사용자 (지금은 데모 사용자) */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
