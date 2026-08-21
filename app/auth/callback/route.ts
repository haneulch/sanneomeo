import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** GET /auth/callback?code=... — Google OAuth 리다이렉트 처리 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createAuthClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  // 터널/프록시 뒤에서는 origin이 http로 보인다 — x-forwarded-proto 존중.
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return NextResponse.redirect(`${proto}://${url.host}/`);
}
