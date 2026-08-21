import { describe, expect, it } from "vitest";
import { distKm, mapUrl, SEOUL } from "@/lib/geo";
import type { Mountain } from "@/lib/types";

describe("distKm (하버사인)", () => {
  it("같은 점은 0", () => {
    expect(distKm(SEOUL, SEOUL)).toBe(0);
  });

  it("서울→부산 ≈ 325km (±5km)", () => {
    const busan = { lat: 35.1796, lng: 129.0756 };
    expect(distKm(SEOUL, busan)).toBeGreaterThan(320);
    expect(distKm(SEOUL, busan)).toBeLessThan(330);
  });

  it("대칭: d(a,b) = d(b,a)", () => {
    const a = { lat: 36.0, lng: 127.0 };
    const b = { lat: 37.7, lng: 128.9 };
    expect(distKm(a, b)).toBeCloseTo(distKm(b, a), 10);
  });

  it("5km 지오펜스 경계: 위도 0.05도 ≈ 5.56km", () => {
    const a = { lat: 36.0, lng: 127.0 };
    const b = { lat: 36.05, lng: 127.0 };
    const d = distKm(a, b);
    expect(d).toBeGreaterThan(5.5);
    expect(d).toBeLessThan(5.6);
  });
});

describe("mapUrl", () => {
  it("한글 산명 인코딩 + 국가 컨텍스트 포함", () => {
    const m = { ko: "대둔산", en: "Daedunsan" } as Mountain;
    const url = mapUrl(m);
    expect(url).toContain("google.com/maps/search");
    expect(url).toContain(encodeURIComponent("대둔산 Daedunsan South Korea"));
  });
});
