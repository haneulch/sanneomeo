import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// DATA_STORE_DIR은 모듈 로드 시점에 읽히므로 import보다 먼저 설정해야 한다.
const dir = mkdtempSync(join(tmpdir(), "sanneomeo-store-"));
process.env.DATA_STORE_DIR = dir;

const { CsvStore } = await import("@/lib/store/csv-adapter");

describe("CsvStore (임시 디렉터리)", () => {
  const store = new CsvStore();

  beforeAll(async () => {
    await store.upsertUser({
      id: "u1",
      provider: "demo",
      providerId: "demo",
      email: "u1@example.com",
      name: "U1",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("getUser: 없는 사용자 → null", async () => {
    expect(await store.getUser("nope")).toBeNull();
  });

  it("upsertUser: 같은 id 갱신 시 중복 생성 없음", async () => {
    await store.upsertUser({
      id: "u1",
      provider: "demo",
      providerId: "demo",
      email: "changed@example.com",
      name: "U1v2",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    const u = await store.getUser("u1");
    expect(u?.email).toBe("changed@example.com");
  });

  it("addStamp: 신규 적립 → id/시각 채워짐", async () => {
    const s = await store.addStamp("u1", { mountainKo: "대둔산", mountainEn: "Daedunsan", kind: "peak" });
    expect(s.id).toBeTruthy();
    expect(s.userId).toBe("u1");
  });

  it("addStamp: 같은 산 중복 → 기존 스탬프 반환 (개수 불변)", async () => {
    const first = await store.listStamps("u1");
    const dup = await store.addStamp("u1", { mountainKo: "대둔산", mountainEn: "Daedunsan", kind: "peak" });
    const after = await store.listStamps("u1");
    expect(after.length).toBe(first.length);
    expect(dup.id).toBe(first[0].id);
  });

  it("hasStamp 일치", async () => {
    expect(await store.hasStamp("u1", "대둔산")).toBe(true);
    expect(await store.hasStamp("u1", "선운산")).toBe(false);
  });

  it("listStamps: 다른 사용자와 격리", async () => {
    expect(await store.listStamps("u2")).toEqual([]);
  });
});
