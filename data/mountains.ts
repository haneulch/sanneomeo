import type { Mountain } from "@/lib/types";

// 산림청 100대 명산 중 프로토타입 수록분.
// 실서비스에서는 산림청 공공데이터 API로 대체 (app/api/mountains/route.ts 참고).
export const MOUNTAINS: Mountain[] = [
  { en: "Bukhansan",   ko: "북한산", ja: "北漢山", zh: "北汉山", r: "seoul", prov: "서울",       d: "mod",  elev: 836,  h: 4,   temple: false, got: false, lat: 37.658, lng: 126.977 },
  { en: "Dobongsan",   ko: "도봉산", ja: "道峰山", zh: "道峰山", r: "seoul", prov: "서울",       d: "mod",  elev: 740,  h: 3.5, temple: false, got: false, lat: 37.697, lng: 127.014 },
  { en: "Seoraksan",   ko: "설악산", ja: "雪岳山", zh: "雪岳山", r: "gangwon", prov: "강원",     d: "hard", elev: 1708, h: 7,   temple: true,  got: false, lat: 38.119, lng: 128.465 },
  { en: "Odaesan",     ko: "오대산", ja: "五台山", zh: "五台山", r: "gangwon", prov: "강원",     d: "mod",  elev: 1563, h: 5,   temple: true,  got: false, lat: 37.798, lng: 128.543 },
  { en: "Chiaksan",    ko: "치악산", ja: "雉岳山", zh: "雉岳山", r: "gangwon", prov: "강원",     d: "hard", elev: 1288, h: 5.5, temple: false, got: false, lat: 37.371, lng: 128.050 },
  { en: "Songnisan",   ko: "속리산", ja: "俗離山", zh: "俗离山", r: "chungcheong", prov: "충북", d: "mod",  elev: 1058, h: 5,   temple: true,  got: false, lat: 36.543, lng: 127.870 },
  { en: "Gyeryongsan", ko: "계룡산", ja: "鶏龍山", zh: "鸡龙山", r: "chungcheong", prov: "충남", d: "mod",  elev: 845,  h: 4,   temple: true,  got: false, lat: 36.342, lng: 127.206 },
  { en: "Daedunsan",   ko: "대둔산", ja: "大芚山", zh: "大芚山", r: "jeolla", prov: "전북",      d: "mod",  elev: 878,  h: 3.5, temple: true,  got: true,  lat: 36.122, lng: 127.322 },
  { en: "Seonunsan",   ko: "선운산", ja: "禅雲山", zh: "禅云山", r: "jeolla", prov: "전북",      d: "easy", elev: 336,  h: 3,   temple: true,  got: true,  lat: 35.503, lng: 126.552 },
  { en: "Moaksan",     ko: "모악산", ja: "母岳山", zh: "母岳山", r: "jeolla", prov: "전북",      d: "mod",  elev: 794,  h: 4,   temple: true,  got: true,  lat: 35.762, lng: 127.084 },
  { en: "Naejangsan",  ko: "내장산", ja: "内蔵山", zh: "内藏山", r: "jeolla", prov: "전북",      d: "mod",  elev: 763,  h: 4,   temple: true,  got: true,  lat: 35.478, lng: 126.889 },
  { en: "Baegamsan",   ko: "백암산", ja: "白岩山", zh: "白岩山", r: "jeolla", prov: "전남",      d: "mod",  elev: 741,  h: 4,   temple: true,  got: false, lat: 35.435, lng: 126.918 },
  { en: "Duryunsan",   ko: "두륜산", ja: "頭輪山", zh: "头轮山", r: "jeolla", prov: "전남",      d: "easy", elev: 703,  h: 3.5, temple: true,  got: false, lat: 34.481, lng: 126.619 },
  { en: "Mudeungsan",  ko: "무등산", ja: "無等山", zh: "无等山", r: "jeolla", prov: "광주",      d: "easy", elev: 1187, h: 4,   temple: false, got: false, lat: 35.134, lng: 126.989 },
  { en: "Jirisan",     ko: "지리산", ja: "智異山", zh: "智异山", r: "gyeongsang", prov: "경남",  d: "hard", elev: 1915, h: 8,   temple: true,  got: false, lat: 35.337, lng: 127.731 },
  { en: "Gayasan",     ko: "가야산", ja: "伽倻山", zh: "伽倻山", r: "gyeongsang", prov: "경남",  d: "hard", elev: 1430, h: 5,   temple: true,  got: false, lat: 35.823, lng: 128.123 },
  { en: "Palgongsan",  ko: "팔공산", ja: "八公山", zh: "八公山", r: "gyeongsang", prov: "대구",  d: "mod",  elev: 1193, h: 4.5, temple: true,  got: false, lat: 35.980, lng: 128.694 },
  { en: "Hallasan",    ko: "한라산", ja: "漢拏山", zh: "汉拿山", r: "jeju", prov: "제주",        d: "hard", elev: 1947, h: 8,   temple: false, got: false, lat: 33.362, lng: 126.529 },
];
