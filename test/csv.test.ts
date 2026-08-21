import { describe, expect, it } from "vitest";
import { parseCsv, toCsv } from "@/lib/store/csv";

const COLS = ["id", "name", "note"];

describe("CSV 직렬화/파싱", () => {
  it("왕복 보존: 쉼표·따옴표·개행 포함 필드", () => {
    const rows = [
      { id: "1", name: "쉼표, 포함", note: '따옴표 "인용" 포함' },
      { id: "2", name: "개행\n포함", note: "" },
      { id: "3", name: "plain", note: "ascii" },
    ];
    const parsed = parseCsv(toCsv(COLS, rows));
    expect(parsed).toEqual(rows);
  });

  it("빈 입력 → 빈 배열", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("헤더만 있으면 데이터 0건", () => {
    expect(parseCsv("id,name,note\n")).toEqual([]);
  });

  it("CRLF 개행 처리", () => {
    const parsed = parseCsv("id,name\r\n1,a\r\n2,b\r\n");
    expect(parsed).toEqual([
      { id: "1", name: "a" },
      { id: "2", name: "b" },
    ]);
  });

  it("누락 컬럼은 빈 문자열로 채움", () => {
    const out = toCsv(COLS, [{ id: "1" } as Record<string, string>]);
    expect(parseCsv(out)).toEqual([{ id: "1", name: "", note: "" }]);
  });
});
