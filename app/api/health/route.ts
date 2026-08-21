import { NextResponse } from "next/server";
import { DATA_KEY } from "@/lib/publicdata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 컨테이너 HEALTHCHECK용 liveness + 외부 API 연동 모드 확인. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    publicdata: DATA_KEY ? "live" : "mock",
  });
}
