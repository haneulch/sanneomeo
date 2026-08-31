// Fake GPS(모의 위치) 휴리스틱 탐지 (클라이언트 전용).
// 실제 GPS는 정지 상태에서도 좌표·정확도가 미세하게 흔들리지만,
// 모의 위치 앱은 완전히 동일한 좌표를 일정 간격으로 반복 보고하는 경우가 많다.
// 웹에는 네이티브의 isFromMockProvider 같은 플래그가 없어 완화책일 뿐 확정 판별은 아님.

export interface GeoSample {
  lat: number;
  lng: number;
  acc: number; // accuracy (m)
}

const MIN_SAMPLES = 3;
const MAX_SAMPLES = 6;

/** 표본이 충분한데 좌표·정확도가 전부 완전 동일하면 모의 위치로 의심. */
export function looksMocked(samples: GeoSample[]): boolean {
  if (samples.length < MIN_SAMPLES) return false; // 판단 불가 → 오탐 방지 위해 통과
  const [f] = samples;
  return samples.every((s) => s.lat === f.lat && s.lng === f.lng && s.acc === f.acc);
}

/** watchPosition으로 durationMs 동안(또는 MAX_SAMPLES까지) 위치 표본 수집.
 *  권한 거부·미지원·타임아웃이면 그때까지 모인 표본만 반환. */
export function watchSamples(durationMs = 4000): Promise<GeoSample[]> {
  return new Promise((resolve) => {
    const samples: GeoSample[] = [];
    let watchId = -1;
    const finish = () => {
      clearTimeout(timer);
      if (watchId !== -1) navigator.geolocation.clearWatch(watchId);
      resolve(samples);
    };
    const timer = setTimeout(finish, durationMs);
    watchId = navigator.geolocation.watchPosition(
      (p) => {
        samples.push({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          acc: p.coords.accuracy,
        });
        if (samples.length >= MAX_SAMPLES) finish();
      },
      finish, // 거부/오류 → 지금까지 표본으로 종료
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  });
}
