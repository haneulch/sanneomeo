// 행정안전부 전통사찰 CSV → data/temples.json 변환
// 사용: node scripts/build-temples.mjs
// 입력: data/raw/traditional-temples.csv (UTF-8 변환본)
// 출력: 영업/정상 사찰만, 프로토타입에 필요한 필드만 추출

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "data/raw/traditional-temples.csv");
const out = join(root, "data/temples.json");

// 따옴표 필드(쉼표·개행 포함) 지원하는 최소 CSV 파서
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field); field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCSV(readFileSync(src, "utf-8"));
const header = rows[0];
const col = (name) => header.indexOf(name);

const iStatus = col("영업상태명");
const iName = col("전통사찰명");
const iBizName = col("사업장명");
const iRoad = col("도로명주소");
const iJibun = col("지번주소");
const iPhone = col("전화번호");
const iHistory = col("유래연혁");
const iFounded = col("창립연대");

const temples = rows
  .slice(1)
  .filter((r) => r[iStatus] === "영업/정상")
  .map((r) => {
    const name = (r[iName] || r[iBizName] || "").trim();
    const addr = (r[iJibun] || r[iRoad] || "").trim();
    const history = (r[iHistory] || "").trim().replace(/\s+/g, " ");
    return {
      name,
      addr,
      phone: (r[iPhone] || "").trim(),
      founded: (r[iFounded] || "").trim(),
      // 스토리텔링용 유래·연혁 — 프로토타입은 400자로 절단
      history: history.length > 400 ? history.slice(0, 400) + "…" : history,
    };
  })
  .filter((t) => t.name);

writeFileSync(out, JSON.stringify(temples, null, 1), "utf-8");
console.log(`temples: ${temples.length} → ${out}`);
