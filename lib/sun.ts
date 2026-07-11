// NOAA 근사식 기반 일몰 시각 계산 (±수 분 오차, 프로토타입 용도로 충분)
export function sunsetKST(lat: number, lng: number, date = new Date()): string {
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 86400000);

  const decl = 23.45 * Math.sin(rad * ((360 / 365) * (284 + day)));
  const cosHa = -Math.tan(lat * rad) * Math.tan(decl * rad);
  if (cosHa < -1 || cosHa > 1) return "--:--"; // 극야/백야

  const ha = Math.acos(cosHa) / rad; // 시간각(도)
  const solarNoonUTC = 12 - lng / 15;
  const sunsetUTC = solarNoonUTC + ha / 15;
  const kst = (sunsetUTC + 9 + 24) % 24;

  const hh = Math.floor(kst);
  const mm = Math.round((kst - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm % 60).padStart(2, "0")}`;
}
