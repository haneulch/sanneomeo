// 산 → 인근 철도 허브역 매핑 (서울 출발 기준).
// 역 ID(NAT 노드코드)는 하드코딩하지 않고 TAGO 도시코드/역목록 API로
// 런타임 해석한다 (data/transit 캐시 24h). 목록에 없는 산은 열차 패널 숨김.
export interface TransitHub {
  city: string; // TAGO 도시명 부분 일치 (예: "대전")
  station: string; // 역명 부분 일치 (예: "대전")
  stationEn: string;
}

export const TRANSIT_HUBS: Record<string, TransitHub> = {
  대둔산: { city: "대전", station: "대전", stationEn: "Daejeon" },
  계룡산: { city: "대전", station: "대전", stationEn: "Daejeon" },
  내장산: { city: "전라북도", station: "정읍", stationEn: "Jeongeup" },
  백암산: { city: "전라북도", station: "정읍", stationEn: "Jeongeup" },
  선운산: { city: "전라북도", station: "정읍", stationEn: "Jeongeup" },
  모악산: { city: "전라북도", station: "전주", stationEn: "Jeonju" },
  지리산: { city: "전라남도", station: "구례구", stationEn: "Guryegu" },
  무등산: { city: "광주", station: "광주송정", stationEn: "Gwangju-Songjeong" },
  팔공산: { city: "대구", station: "동대구", stationEn: "Dongdaegu" },
  가야산: { city: "대구", station: "동대구", stationEn: "Dongdaegu" },
  치악산: { city: "강원도", station: "원주", stationEn: "Wonju" },
  오대산: { city: "강원도", station: "진부", stationEn: "Jinbu (Odaesan)" },
  설악산: { city: "강원도", station: "강릉", stationEn: "Gangneung" },
};

export const SEOUL_STATION = { city: "서울", station: "서울", stationEn: "Seoul" };
