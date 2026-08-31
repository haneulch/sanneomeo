// CSV 파일 기반 StoreAdapter 구현 (개발/데모용).
// 파일: {DATA_STORE_DIR}/users.csv, stamps.csv (기본 data/store).
// 주의: 서버리스(Vercel 등)에서는 파일시스템이 휘발성 — 프로덕션은 DB 어댑터로 교체.
// 동시성: 단일 프로세스 데모 기준 read-modify-write. 다중 쓰기 보장 안 함.

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { parseCsv, toCsv } from "@/lib/store/csv";
import type { NewStamp, Stamp, StoreAdapter, User } from "@/lib/store/types";

const DIR = process.env.DATA_STORE_DIR ?? join(process.cwd(), "data", "store");
const USERS = join(DIR, "users.csv");
const STAMPS = join(DIR, "stamps.csv");
const PHOTOS = join(DIR, "photos"); // {stampId}.jpg — 정상 인증 사진

const USER_COLS = ["id", "provider", "providerId", "email", "name", "createdAt"];
const STAMP_COLS = ["id", "userId", "mountainKo", "mountainEn", "kind", "stampedAt"];

async function readRows(path: string): Promise<Record<string, string>[]> {
  try {
    return parseCsv(await readFile(path, "utf-8"));
  } catch {
    return [];
  }
}

async function writeRows(path: string, cols: string[], rows: Record<string, string>[]) {
  await mkdir(DIR, { recursive: true });
  await writeFile(path, toCsv(cols, rows), "utf-8");
}

export class CsvStore implements StoreAdapter {
  async getUser(id: string): Promise<User | null> {
    const row = (await readRows(USERS)).find((r) => r.id === id);
    return row ? (row as unknown as User) : null;
  }

  async upsertUser(user: User): Promise<User> {
    const rows = await readRows(USERS);
    const idx = rows.findIndex((r) => r.id === user.id);
    const record = user as unknown as Record<string, string>;
    if (idx >= 0) rows[idx] = record;
    else rows.push(record);
    await writeRows(USERS, USER_COLS, rows);
    return user;
  }

  async listStamps(userId: string): Promise<Stamp[]> {
    const photoIds = await this.photoStampIds();
    return (await readRows(STAMPS))
      .filter((r) => r.userId === userId)
      .map((r) => ({ ...(r as unknown as Stamp), hasPhoto: photoIds.has(r.id) }))
      .sort((a, b) => a.stampedAt.localeCompare(b.stampedAt));
  }

  async listAllStamps(): Promise<Stamp[]> {
    return (await readRows(STAMPS)).map((r) => r as unknown as Stamp);
  }

  async hasStamp(userId: string, mountainKo: string): Promise<boolean> {
    return (await readRows(STAMPS)).some(
      (r) => r.userId === userId && r.mountainKo === mountainKo
    );
  }

  async addStamp(userId: string, stamp: NewStamp): Promise<Stamp> {
    const rows = await readRows(STAMPS);
    const existing = rows.find(
      (r) => r.userId === userId && r.mountainKo === stamp.mountainKo
    );
    if (existing) return existing as unknown as Stamp;

    const record: Stamp = {
      id: randomUUID(),
      userId,
      mountainKo: stamp.mountainKo,
      mountainEn: stamp.mountainEn,
      kind: stamp.kind,
      stampedAt: new Date().toISOString(),
    };
    rows.push(record as unknown as Record<string, string>);
    await writeRows(STAMPS, STAMP_COLS, rows);
    return record;
  }

  private async photoStampIds(): Promise<Set<string>> {
    try {
      const files = await readdir(PHOTOS);
      return new Set(files.filter((f) => f.endsWith(".jpg")).map((f) => f.slice(0, -4)));
    } catch {
      return new Set();
    }
  }

  private async ownsStamp(userId: string, stampId: string): Promise<boolean> {
    return (await readRows(STAMPS)).some((r) => r.id === stampId && r.userId === userId);
  }

  async setStampPhoto(userId: string, stampId: string, jpegBase64: string): Promise<void> {
    if (!(await this.ownsStamp(userId, stampId))) return;
    await mkdir(PHOTOS, { recursive: true });
    await writeFile(join(PHOTOS, `${stampId}.jpg`), Buffer.from(jpegBase64, "base64"));
  }

  async getStampPhoto(userId: string, stampId: string): Promise<string | null> {
    if (!(await this.ownsStamp(userId, stampId))) return null;
    try {
      return (await readFile(join(PHOTOS, `${stampId}.jpg`))).toString("base64");
    } catch {
      return null;
    }
  }
}
