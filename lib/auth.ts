import { getStore } from "@/lib/store";
import type { User } from "@/lib/store/types";

// ── 인증 교체 지점 ────────────────────────────────────────────
// 지금: 로그인 없음 — 고정 데모 사용자.
// 나중에 구글 로그인(NextAuth 등) 붙이면 getCurrentUser를 세션 기반으로 교체:
//   const session = await getServerSession(authOptions);
//   const u = { id: session.user.id, provider: "google",
//               providerId: session.user.sub, email, name, ... };
//   await getStore().upsertUser(u); return u;
// 나머지 코드는 getCurrentUser()에만 의존하므로 무영향.
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
  const store = getStore();
  const existing = await store.getUser(DEMO_USER.id);
  if (existing) return existing;
  return store.upsertUser(DEMO_USER);
}
