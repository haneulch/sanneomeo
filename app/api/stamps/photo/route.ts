import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/auth";

// 파일시스템(CSV 어댑터) 읽기 → Node 런타임 필요
export const runtime = "nodejs";

/** GET /api/stamps/photo?id={stampId} — 현재 사용자의 정상 인증 사진(JPEG) */
export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const user = await getCurrentUser();
  const base64 = await getStore().getStampPhoto(user.id, id);
  if (!base64) return NextResponse.json({ error: "not found" }, { status: 404 });

  return new NextResponse(Buffer.from(base64, "base64"), {
    headers: {
      "Content-Type": "image/jpeg",
      // 본인 전용 + 재방문 시 교체 가능 → 공유 캐시 금지
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
