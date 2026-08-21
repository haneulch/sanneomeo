import { describe, expect, it } from "vitest";
import { toGrid } from "@/lib/kma";

describe("기상청 격자 변환 (Lambert Conformal Conic)", () => {
  // 기상청 공식 문서의 대표 지점 격자값
  it("서울(37.5665, 126.978) → nx 60, ny 127", () => {
    expect(toGrid(37.5665, 126.978)).toEqual({ nx: 60, ny: 127 });
  });

  it("부산(35.1796, 129.0756) → nx 98, ny 76", () => {
    expect(toGrid(35.1796, 129.0756)).toEqual({ nx: 98, ny: 76 });
  });
});
