// 시도(도) canonical 라벨 + 다국어 표기.
// TAGO/TourAPI/산림청 ctpvNm 문자열을 짧은 canonical 라벨로 정규화.

export const PROV_LABEL: Record<string, { en: string; ja: string; zh: string }> = {
  서울: { en: "Seoul", ja: "ソウル", zh: "首尔" },
  인천: { en: "Incheon", ja: "仁川", zh: "仁川" },
  경기: { en: "Gyeonggi", ja: "京畿", zh: "京畿" },
  강원: { en: "Gangwon", ja: "江原", zh: "江原" },
  충북: { en: "Chungbuk", ja: "忠北", zh: "忠北" },
  충남: { en: "Chungnam", ja: "忠南", zh: "忠南" },
  대전: { en: "Daejeon", ja: "大田", zh: "大田" },
  세종: { en: "Sejong", ja: "世宗", zh: "世宗" },
  전북: { en: "Jeonbuk", ja: "全北", zh: "全北" },
  전남: { en: "Jeonnam", ja: "全南", zh: "全南" },
  광주: { en: "Gwangju", ja: "光州", zh: "光州" },
  경북: { en: "Gyeongbuk", ja: "慶北", zh: "庆北" },
  경남: { en: "Gyeongnam", ja: "慶南", zh: "庆南" },
  대구: { en: "Daegu", ja: "大邱", zh: "大邱" },
  울산: { en: "Ulsan", ja: "蔚山", zh: "蔚山" },
  부산: { en: "Busan", ja: "釜山", zh: "釜山" },
  제주: { en: "Jeju", ja: "済州", zh: "济州" },
};

export function normalizeProv(ctpvNm: string): string {
  const s = (ctpvNm || "").replace(/\s/g, "");
  if (/서울/.test(s)) return "서울";
  if (/인천/.test(s)) return "인천";
  if (/경기/.test(s)) return "경기";
  if (/강원/.test(s)) return "강원";
  if (/충청북|충북/.test(s)) return "충북";
  if (/충청남|충남/.test(s)) return "충남";
  if (/대전/.test(s)) return "대전";
  if (/세종/.test(s)) return "세종";
  if (/전라북|전북/.test(s)) return "전북";
  if (/전라남|전남/.test(s)) return "전남";
  if (/광주/.test(s)) return "광주";
  if (/경상북|경북/.test(s)) return "경북";
  if (/경상남|경남/.test(s)) return "경남";
  if (/대구/.test(s)) return "대구";
  if (/울산/.test(s)) return "울산";
  if (/부산/.test(s)) return "부산";
  if (/제주/.test(s)) return "제주";
  return "";
}

export function provName(prov: string, lang: "en" | "ko" | "ja" | "zh"): string {
  if (lang === "ko") return prov;
  return PROV_LABEL[prov]?.[lang] ?? prov;
}
