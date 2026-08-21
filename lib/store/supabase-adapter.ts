// Supabase(Postgres) StoreAdapter 구현.
// service role 키 사용 — 서버 전용(RLS 우회). 브라우저 번들에 절대 노출 금지.
// 스키마: supabase/migrations/0001_sanneomeo.sql
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NewStamp, Stamp, StoreAdapter, User } from "@/lib/store/types";

interface UserRow {
  id: string;
  provider: string;
  provider_id: string;
  email: string;
  name: string;
  created_at: string;
}

interface StampRow {
  id: string;
  user_id: string;
  mountain_ko: string;
  mountain_en: string;
  kind: string;
  stamped_at: string;
}

const toUser = (r: UserRow): User => ({
  id: r.id,
  provider: r.provider as User["provider"],
  providerId: r.provider_id,
  email: r.email,
  name: r.name,
  createdAt: r.created_at,
});

const toStamp = (r: StampRow): Stamp => ({
  id: r.id,
  userId: r.user_id,
  mountainKo: r.mountain_ko,
  mountainEn: r.mountain_en,
  kind: r.kind as Stamp["kind"],
  stampedAt: r.stamped_at,
});

export class SupabaseStore implements StoreAdapter {
  private db: SupabaseClient;

  constructor() {
    this.db = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }

  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.db
      .from("sanneomeo_users")
      .select("*")
      .eq("id", id)
      .maybeSingle<UserRow>();
    if (error) throw new Error(`getUser: ${error.message}`);
    return data ? toUser(data) : null;
  }

  async upsertUser(user: User): Promise<User> {
    const { data, error } = await this.db
      .from("sanneomeo_users")
      .upsert(
        {
          id: user.id,
          provider: user.provider,
          provider_id: user.providerId,
          email: user.email,
          name: user.name,
          created_at: user.createdAt,
        },
        { onConflict: "id" }
      )
      .select()
      .single<UserRow>();
    if (error) throw new Error(`upsertUser: ${error.message}`);
    return toUser(data);
  }

  async listStamps(userId: string): Promise<Stamp[]> {
    const { data, error } = await this.db
      .from("sanneomeo_stamps")
      .select("*")
      .eq("user_id", userId)
      .order("stamped_at", { ascending: true })
      .returns<StampRow[]>();
    if (error) throw new Error(`listStamps: ${error.message}`);
    return (data ?? []).map(toStamp);
  }

  async listAllStamps(): Promise<Stamp[]> {
    const { data, error } = await this.db
      .from("sanneomeo_stamps")
      .select("*")
      .returns<StampRow[]>();
    if (error) throw new Error(`listAllStamps: ${error.message}`);
    return (data ?? []).map(toStamp);
  }

  async hasStamp(userId: string, mountainKo: string): Promise<boolean> {
    const { count, error } = await this.db
      .from("sanneomeo_stamps")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("mountain_ko", mountainKo);
    if (error) throw new Error(`hasStamp: ${error.message}`);
    return (count ?? 0) > 0;
  }

  async addStamp(userId: string, stamp: NewStamp): Promise<Stamp> {
    // CSV 어댑터와 동일 시맨틱: 이미 있으면 기존 스탬프 반환.
    // unique(user_id, mountain_ko) 제약 + ignoreDuplicates 로 경합도 안전.
    const { error } = await this.db.from("sanneomeo_stamps").upsert(
      {
        user_id: userId,
        mountain_ko: stamp.mountainKo,
        mountain_en: stamp.mountainEn,
        kind: stamp.kind,
      },
      { onConflict: "user_id,mountain_ko", ignoreDuplicates: true }
    );
    if (error) throw new Error(`addStamp: ${error.message}`);

    const { data, error: selErr } = await this.db
      .from("sanneomeo_stamps")
      .select("*")
      .eq("user_id", userId)
      .eq("mountain_ko", stamp.mountainKo)
      .single<StampRow>();
    if (selErr) throw new Error(`addStamp(select): ${selErr.message}`);
    return toStamp(data);
  }
}
