// Supabase Auth 세션 토큰 갱신 (@supabase/ssr 표준 패턴).
// NEXT_PUBLIC_* env 없으면(로컬 CSV 데모) 아무것도 하지 않는다.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
  // getUser()가 만료 토큰을 갱신하고 setAll로 새 쿠키를 응답에 싣는다.
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // /api 제외: 라우트 핸들러의 서버 클라이언트가 스스로 토큰을 갱신할 수 있어
  // 여기서 요청마다 getUser() 네트워크 콜을 중복할 필요가 없다.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
