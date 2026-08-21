import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** GET /auth/callback?code=... — Google OAuth 리다이렉트 처리 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  if (code) {
    const supabase = await createAuthClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  // 절대 URL 금지: 터널/프록시 뒤에서는 request.url 의 host가 원본 도메인이 아니라
  // 컨테이너 바인딩 주소(0.0.0.0:3000)로 보인다. 상대 Location 은 브라우저가
  // 현재 주소(https://mtn.<도메인>/auth/callback) 기준으로 해석하므로 항상 안전.
  return new NextResponse(null, { status: 302, headers: { Location: "/" } });
}
