import { describe, expect, it } from "vitest";
import { looksMocked, type GeoSample } from "@/lib/mock-gps";

const s = (lat: number, lng: number, acc: number): GeoSample => ({ lat, lng, acc });

describe("looksMocked", () => {
  it("표본 3개 미만 → 판단 불가, 통과", () => {
    expect(looksMocked([])).toBe(false);
    expect(looksMocked([s(37.5, 127.0, 10), s(37.5, 127.0, 10)])).toBe(false);
  });

  it("좌표·정확도 전부 동일 → 모의 위치 의심", () => {
    expect(looksMocked([s(37.5, 127.0, 10), s(37.5, 127.0, 10), s(37.5, 127.0, 10)])).toBe(true);
  });

  it("좌표가 미세하게라도 흔들리면 → 실제 GPS로 판단", () => {
    expect(
      looksMocked([s(37.5, 127.0, 10), s(37.5000001, 127.0, 10), s(37.5, 127.0, 10)])
    ).toBe(false);
  });

  it("좌표 동일해도 정확도가 변하면 → 실제 GPS로 판단", () => {
    expect(looksMocked([s(37.5, 127.0, 10), s(37.5, 127.0, 12), s(37.5, 127.0, 10)])).toBe(false);
  });
});
