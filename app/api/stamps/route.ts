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

// 클라이언트가 1280px JPEG로 리사이즈해 보내므로 보통 수백 KB. 상한은 방어용.
const MAX_PHOTO_BASE64 = 4 * 1024 * 1024;

/** POST /api/stamps { mountainKo, mountainEn, kind, photo? } — 스탬프 적립(중복 무시).
 *  photo: 카메라 캡쳐 JPEG의 data URL 또는 base64. 재적립 시 사진만 갱신된다. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = (await request.json().catch(() => ({}))) as {
    mountainKo?: string;
    mountainEn?: string;
    kind?: StampKind;
    photo?: string;
  };
  if (!body.mountainKo || !body.mountainEn) {
    return NextResponse.json({ error: "mountainKo and mountainEn required" }, { status: 400 });
  }
  const stamp = await getStore().addStamp(user.id, {
    mountainKo: body.mountainKo,
    mountainEn: body.mountainEn,
    kind: body.kind === "temple" ? "temple" : "peak",
  });
  if (typeof body.photo === "string" && body.photo) {
    const base64 = body.photo.replace(/^data:image\/jpeg;base64,/, "");
    if (base64.length <= MAX_PHOTO_BASE64 && /^[A-Za-z0-9+/=]+$/.test(base64)) {
      await getStore().setStampPhoto(user.id, stamp.id, base64);
    }
  }
  const stamps = await getStore().listStamps(user.id);
  return NextResponse.json({ stamp, stamps });
}
