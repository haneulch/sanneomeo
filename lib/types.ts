export type Lang = "en" | "ko" | "ja" | "zh";

export type Region =
  | "seoul"
  | "gangwon"
  | "chungcheong"
  | "jeolla"
  | "gyeongsang"
  | "jeju";

export type Difficulty = "easy" | "mod" | "hard";

export interface Mountain {
  en: string;
  ko: string;
  ja: string;
  zh: string;
  r: Region;
  prov?: string; // 시도 canonical 짧은 라벨 (예: "전북") — 도별 챌린지용
  d: Difficulty;
  elev: number;
  h: number;
  temple: boolean;
  got: boolean;
  lat: number;
  lng: number;
}
