import type { Mountain } from "@/lib/types";

export const SEOUL = { lat: 37.5665, lng: 126.978 };

export function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function mapUrl(m: Mountain) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${m.ko} ${m.en} South Korea`)
  );
}
