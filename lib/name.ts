import type { Lang, Mountain } from "@/lib/types";

/**
 * 산 이름 표기 규칙:
 * - 한국어 선택 → 항상 한국어
 * - 그 외 → 해당 언어, 없으면(라이브 82산은 ja/zh가 한글 플레이스홀더) 2순위 영어
 */
export function mountainName(m: Pick<Mountain, "ko" | "en" | "ja" | "zh">, lang: Lang): string {
  if (lang === "ko") return m.ko || m.en;
  if (lang === "en") return m.en || m.ko;
  const v = m[lang];
  // 실제 번역이 있으면(한글과 다르면) 사용, 아니면 영어
  return v && v !== m.ko ? v : m.en || m.ko;
}

/**
 * 외국어 선택 시 병기할 한국어 표기.
 * 외국인이 표지판·지도·택시와 대조할 수 있도록 고유명사에 한글 병기.
 * 한국어 선택이거나 표시명이 이미 한글이면 빈 문자열.
 */
export function koSubtitle(
  m: Pick<Mountain, "ko" | "en" | "ja" | "zh">,
  lang: Lang
): string {
  if (lang === "ko") return "";
  return mountainName(m, lang) === m.ko ? "" : m.ko;
}
