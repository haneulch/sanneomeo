export type Lang = "en" | "ko" | "ja" | "zh";

export type Region =
  | "seoul"
  | "gangwon"
  | "chungcheong"
  | "jeolla"
  | "gyeongsang"
  | "jeju";

export type Difficulty = "easy" | "mod" | "hard";

export interface Taste {
  diff: Difficulty;
  dur: number; // 0 반나절, 1 하루, 2 1박2일
  interests: string[]; // chipGranite, chipTemple, ...
}

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
  est?: boolean; // 난이도·소요시간이 고도 기반 추정치인지 (라이브 82산). curated는 false/undefined
}
