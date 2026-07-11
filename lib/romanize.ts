// 한글 → 국어의 로마자 표기법(RR) 단순 변환.
// 음운 동화 미적용 — 산 이름 표기용 근사치 (예: 대둔산 → Daedunsan).
// 공식 표기가 필요한 산은 data/mountains.ts 큐레이션 항목이 우선한다.

const CHO = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const JUNG = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
const JONG = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];

export function romanize(hangul: string): string {
  let out = "";
  for (const ch of hangul) {
    const code = ch.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) {
      out += ch;
      continue;
    }
    const idx = code - 0xac00;
    const cho = Math.floor(idx / 588);
    const jung = Math.floor((idx % 588) / 28);
    const jong = idx % 28;
    out += CHO[cho] + JUNG[jung] + JONG[jong];
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}
