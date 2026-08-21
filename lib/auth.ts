import { getStore } from "@/lib/store";
import type { User } from "@/lib/store/types";
import { createAuthClient, isSupabaseAuthConfigured } from "@/lib/supabase/server";

// ── 인증 ──────────────────────────────────────────────────────
// Supabase Auth(Google) 세션이 있으면 그 사용자, 없으면 데모 사용자 폴백.
// 로그아웃 상태에서도 앱이 동작해야 하므로(데모·심사) 폴백을 유지한다.
// ─────────────────────────────────────────────────────────────

export const DEMO_USER: User = {
  id: "demo-user",
  provider: "demo",
  providerId: "demo",
  email: "emma@example.com",
  name: "Emma",
  createdAt: "2026-06-01T00:00:00.000Z",
};

export async function getCurrentUser(): Promise<User> {
  if (isSupabaseAuthConfigured()) {
    const supabase = await createAuthClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const store = getStore();
      const existing = await store.getUser(user.id);
      if (existing) return existing;
      return store.upsertUser({
        id: user.id,
        provider: "google",
        providerId:
          (user.user_metadata?.provider_id as string) ??
          (user.user_metadata?.sub as string) ??
          user.id,
        email: user.email ?? "",
        name:
          (user.user_metadata?.full_name as string) ??
          (user.user_metadata?.name as string) ??
          user.email ??
          "Hiker",
        createdAt: user.created_at,
      });
    }
  }
  const store = getStore();
  const existing = await store.getUser(DEMO_USER.id);
  if (existing) return existing;
  return store.upsertUser(DEMO_USER);
}
