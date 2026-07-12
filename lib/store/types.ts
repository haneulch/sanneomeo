// 저장 계층 도메인 타입 + 어댑터 인터페이스.
// 지금은 CSV 어댑터, 나중에 동일 인터페이스로 Prisma/DB 어댑터 교체.
// (lib/store/index.ts의 getStore() 한 곳만 바꾸면 됨)

export type AuthProvider = "demo" | "google";
export type StampKind = "peak" | "temple";

export interface User {
  id: string;
  provider: AuthProvider;
  providerId: string; // 구글 sub 등. demo는 "demo".
  email: string;
  name: string;
  createdAt: string; // ISO
}

export interface Stamp {
  id: string;
  userId: string;
  mountainKo: string;
  mountainEn: string;
  kind: StampKind;
  stampedAt: string; // ISO
}

export interface NewStamp {
  mountainKo: string;
  mountainEn: string;
  kind: StampKind;
}

/**
 * 영속 저장 어댑터. CSV·DB 공통 계약.
 * 사용자 인증(구글 로그인)이 붙으면 upsertUser로 세션 사용자를 동기화한다.
 */
export interface StoreAdapter {
  getUser(id: string): Promise<User | null>;
  upsertUser(user: User): Promise<User>;
  listStamps(userId: string): Promise<Stamp[]>;
  listAllStamps(): Promise<Stamp[]>; // 대시보드 집계용 (전체 사용자)
  hasStamp(userId: string, mountainKo: string): Promise<boolean>;
  addStamp(userId: string, stamp: NewStamp): Promise<Stamp>;
}
