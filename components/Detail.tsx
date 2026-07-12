"use client";

import { useEffect, useState } from "react";
import type { Lang, Mountain } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { mapUrl, distKm } from "@/lib/geo";
import { mountainName, koSubtitle } from "@/lib/name";
import { romanize } from "@/lib/romanize";
import { TEMPLE_QUERY } from "@/data/temple-map";

interface Props {
  lang: Lang;
  mountain: Mountain;
  onBack: () => void;
  onStamp: () => void;
}

interface Temple {
  name: string;
  addr: string;
  founded: string;
  history: string;
}

interface Safety {
  sunset: string;
  weather: { tempC: number | null; rainMm: number | null } | null;
  alert: { level: "advisory" | "warning"; type: string } | null;
  access: "open" | "partial" | "closed";
  accessReason: "spring" | "fall" | null;
}

interface Nearby {
  title: string;
  addr: string;
  distM: number;
}

interface Transit {
  hub?: { ko: string; en: string };
  trains: { dep: string; arr: string; type: string; fare: number }[];
  poi?: { name: string; type: string }[];
}

interface Festival {
  title: string;
  start: string;
  end: string;
  distKm: number;
}

interface Poi {
  peaks: { name: string; elev: string }[];
  features: { name: string; type: string }[];
}
const fmtMd = (ymd: string) => (ymd.length === 8 ? `${ymd.slice(4, 6)}.${ymd.slice(6, 8)}` : "");

const YDS: Record<Mountain["d"], string> = {
  easy: "YDS Class 1",
  mod: "YDS Class 2",
  hard: "YDS Class 3",
};

export default function Detail({ lang, mountain: m, onBack, onStamp }: Props) {
  const t = makeT(lang);
  const [temple, setTemple] = useState<Temple | null>(null);
  const [safety, setSafety] = useState<Safety | null>(null);
  const [nearby, setNearby] = useState<Nearby[]>([]);
  const [food, setFood] = useState<Nearby[]>([]);
  const [transit, setTransit] = useState<Transit | null>(null);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [poi, setPoi] = useState<Poi>({ peaks: [], features: [] });
  const [photo, setPhoto] = useState<{ image: string; copyright: string } | null>(null);

  useEffect(() => {
    setSafety(null);
    setNearby([]);
    setFood([]);
    setTemple(null);
    setTransit(null);
    setFestivals([]);
    setPoi({ peaks: [], features: [] });
    setPhoto(null);

    fetch(`/api/photo?m=${encodeURIComponent(m.ko)}`)
      .then((r) => r.json())
      .then((d) => setPhoto(d.image ? { image: d.image, copyright: d.copyright ?? "" } : null))
      .catch(() => setPhoto(null));

    fetch(`/api/poi?m=${encodeURIComponent(m.ko)}`)
      .then((r) => r.json())
      .then((d) => setPoi({ peaks: d.peaks ?? [], features: d.features ?? [] }))
      .catch(() => setPoi({ peaks: [], features: [] }));

    fetch(`/api/transit?m=${encodeURIComponent(m.ko)}`)
      .then((r) => r.json())
      .then(setTransit)
      .catch(() => setTransit(null));

    if (!m.lat || !m.lng) return;

    fetch(`/api/safety?lat=${m.lat}&lng=${m.lng}`)
      .then((r) => r.json())
      .then(setSafety)
      .catch(() => setSafety(null));

    fetch(`/api/nearby?lat=${m.lat}&lng=${m.lng}&lang=${lang}`)
      .then((r) => r.json())
      .then((d) => {
        setNearby(d.items ?? []);
        setFood(d.food ?? []);
      })
      .catch(() => {
        setNearby([]);
        setFood([]);
      });

    fetch(`/api/festivals?lat=${m.lat}&lng=${m.lng}&lang=${lang}`)
      .then((r) => r.json())
      .then((d) => setFestivals(d.items ?? []))
      .catch(() => setFestivals([]));

    const tq = TEMPLE_QUERY[m.ko];
    if (tq) {
      fetch(`/api/temples?q=${encodeURIComponent(tq.q)}&addr=${encodeURIComponent(tq.addr)}`)
        .then((r) => r.json())
        .then((d) => {
          const items: Temple[] = d.items ?? [];
          const best = items.slice().sort((a, b) => b.history.length - a.history.length)[0];
          setTemple(best ?? null);
        })
        .catch(() => setTemple(null));
    }
  }, [m, lang]);

  const [stamping, setStamping] = useState(false);

  const doStamp = async () => {
    try {
      await fetch("/api/stamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mountainKo: m.ko, mountainEn: m.en, kind: "peak" }),
      });
    } catch {
      /* 폴백: 저장 실패해도 패스포트로 이동 */
    }
    onStamp();
  };

  // GPS 인증: 산 반경 5km 이내에서만 스탬프. 위치 거부/미지원 시 데모 허용.
  const GEOFENCE_KM = 5;
  const collectStamp = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation || !m.lat || !m.lng) {
      doStamp();
      return;
    }
    setStamping(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setStamping(false);
        const d = distKm({ lat: p.coords.latitude, lng: p.coords.longitude }, m);
        if (d <= GEOFENCE_KM) doStamp();
        else if (confirm(t("stampTooFar").replace("{km}", String(Math.round(d))))) doStamp();
      },
      () => {
        setStamping(false);
        doStamp(); // 위치 거부 → 데모 허용
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  const koSub = koSubtitle(m, lang);
  const title = lang === "ko" ? m.ko : `${mountainName(m, lang)}${koSub ? ` ${koSub}` : ""}`;
  const distKmRT = (m.h * 2).toFixed(1);

  // 한국어만 있는 고유명사(사찰·봉우리·POI): ko 그대로, 외국어면 로마자 + 한글 병기
  const place = (ko: string) =>
    lang === "ko" ? (
      <>{ko}</>
    ) : (
      <>
        {romanize(ko)}
        <span className="kosub">{ko}</span>
      </>
    );

  return (
    <section className="screen active" id="scr-detail">
      <button className="back" onClick={onBack}>
        {t("back")}
      </button>
      <div className="detail-hero">
        {photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-photo" src={photo.image} alt="" />
            <div className="hero-overlay" />
            <span className="photo-credit">{t("photoCredit")}</span>
          </>
        ) : (
          <svg viewBox="0 0 414 170" preserveAspectRatio="none" aria-hidden="true">
            <rect width="414" height="170" fill="#4E9F44" />
            <path
              d="M0,170 L80,40 L150,120 L225,22 L295,104 L360,58 L414,110 L414,170 Z"
              fill="#3C7A34"
            />
            <path
              d="M0,170 L60,116 L160,152 L245,100 L330,148 L414,118 L414,170 Z"
              fill="#2A5422"
            />
            <circle cx="345" cy="34" r="12" fill="#F2C94C" />
            <rect x="0" y="0" width="414" height="170" fill="url(#g1)" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset=".45" stopColor="rgba(0,0,0,0)" />
                <stop offset="1" stopColor="rgba(10,20,14,.55)" />
              </linearGradient>
            </defs>
          </svg>
        )}
        <div className="title">
          <b>{title}</b>
          <span>
            {t(`rg_${m.r}`)} · {m.elev.toLocaleString()} m
          </span>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{t(`df_${m.d}`)}</b>
          <span>{m.est ? t("estimated") : YDS[m.d]}</span>
        </div>
        <div className="stat">
          <b className="num">
            {m.est ? "≈ " : ""}
            {m.h} h
          </b>
          <span>{t("stRound")}</span>
        </div>
        <div className="stat">
          <b className="num">≈ {distKmRT} km</b>
          <span>{t("stDist")}</span>
        </div>
      </div>

      <a className="dmap" href={mapUrl(m)} target="_blank" rel="noopener noreferrer">
        <span>📍</span>
        <span>{t("dMap")}</span>
      </a>

      <div className="panel safety">
        <h3>🛟 {t("pnSafety")}</h3>
        <div className="safegrid">
          <div className="safeitem">
            <span className="k">🌇 {t("sfSunset")}</span>
            <b className="num">{safety?.sunset ?? "–"}</b>
            <small>{t("sfSunsetNote")}</small>
          </div>
          <div className="safeitem">
            <span className="k">⚠️ {t("sfAlert")}</span>
            {safety?.alert ? (
              <b className="warn">
                {t(safety.alert.type === "rain" ? "sfAlertRain" : "sfAlertHeat")}
              </b>
            ) : (
              <b className="ok">{t("sfNone")}</b>
            )}
            <small>
              {safety?.weather?.tempC != null ? `${safety.weather.tempC}°C · ` : ""}
              {t("sfAlertNote")}
            </small>
          </div>
          <div className="safeitem">
            <span className="k">🚧 {t("sfAccess")}</span>
            <b className={safety?.access === "open" ? "ok" : "warn"}>
              {t(
                safety?.access === "open"
                  ? "sfOpen"
                  : safety?.access === "partial"
                    ? "sfPartial"
                    : "sfClosed"
              )}
            </b>
            <small>
              {safety?.accessReason
                ? t(safety.accessReason === "spring" ? "sfSpring" : "sfFall")
                : t("sfAccessNote")}
            </small>
          </div>
          <div className="safeitem">
            <span className="k">🚨 {t("sfEmg")}</span>
            <b>119</b>
            <small>{t("sfEmgDesc")}</small>
          </div>
        </div>
      </div>

      {poi.peaks.length > 0 && (
        <div className="panel">
          <h3>⛰ {t("pnPeaks")}</h3>
          {poi.peaks.map((p, i) => (
            <div key={p.name + i} className="step">
              <span className="ico">🏔</span>
              <div>
                <b>{place(p.name)}</b>
                {p.elev && <small>{p.elev}</small>}
              </div>
            </div>
          ))}
          <p className="datasrc">{t("poiSrc")}</p>
        </div>
      )}

      {poi.features.length > 0 && (
        <div className="panel">
          <h3>🌿 {t("pnTrailPoi")}</h3>
          {poi.features.map((f, i) => (
            <div key={f.name + i} className="step">
              <span className="ico">💧</span>
              <div>
                <b>{place(f.name)}</b>
                {f.type && <small>{f.type}</small>}
              </div>
            </div>
          ))}
          <p className="datasrc">{t("poiSrc")}</p>
        </div>
      )}

      {((transit?.trains.length ?? 0) > 0 || (transit?.poi?.length ?? 0) > 0) && (
        <div className="panel">
          <h3>{t("pnTransit")}</h3>
          {(transit?.trains.length ?? 0) > 0 && transit?.hub && (
            <>
              <div className="step">
                <span className="ico">🚄</span>
                <div>
                  <b>
                    Seoul → {lang === "ko" ? transit.hub.ko : transit.hub.en}
                  </b>
                  <small>{t("tzTrains")}</small>
                </div>
              </div>
              {transit.trains.map((tr, i) => (
                <div key={tr.dep + tr.type + i} className="step">
                  <span className="ico">🎫</span>
                  <div>
                    <b className="num">
                      {tr.dep} → {tr.arr}
                    </b>
                    <small>{tr.type}{tr.fare ? ` · ₩${tr.fare.toLocaleString()}` : ""}</small>
                  </div>
                </div>
              ))}
              <p className="datasrc">{t("tagoSrc")}</p>
            </>
          )}
          {(transit?.poi?.length ?? 0) > 0 && (
            <>
              {transit?.poi?.map((p, i) => (
                <div key={p.name + i} className="step">
                  <span className="ico">🚏</span>
                  <div>
                    <b>{place(p.name)}</b>
                    <small>{t("poiTitle")}{p.type ? ` · ${p.type}` : ""}</small>
                  </div>
                </div>
              ))}
              <p className="datasrc">{t("poiSrc")}</p>
            </>
          )}
        </div>
      )}

      {food.length > 0 && (
        <div className="panel">
          <h3>{t("pnAfter")}</h3>
          {temple && temple.history && (
            <div className="step">
              <span className="ico">🏯</span>
              <div>
                <b>{place(temple.name)}</b>
                <small>{t("afterTemple")}</small>
              </div>
            </div>
          )}
          {food.map((f, i) => (
            <div key={f.title + i} className="step">
              <span className="ico">🍜</span>
              <div>
                <b>{f.title}</b>
                <small>
                  {f.distM > 0 ? `${(f.distM / 1000).toFixed(1)} km · ` : ""}
                  {f.addr}
                </small>
              </div>
            </div>
          ))}
          <p className="datasrc">{t("nearbySrc")}</p>
        </div>
      )}

      {festivals.length > 0 && (
        <div className="panel">
          <h3>🎪 {t("pnFestival")}</h3>
          {festivals.map((f, i) => (
            <div key={f.title + i} className="step">
              <span className="ico">🎉</span>
              <div>
                <b>{f.title}</b>
                <small>
                  {fmtMd(f.start)}–{fmtMd(f.end)} · {f.distKm} km
                </small>
              </div>
            </div>
          ))}
          <p className="datasrc">{t("festSrc")}</p>
        </div>
      )}

      {nearby.length > 0 && (
        <div className="panel">
          <h3>{t("pnNearby")}</h3>
          {nearby.map((n, i) => (
            <div key={n.title + i} className="step">
              <span className="ico">🧭</span>
              <div>
                <b>{n.title}</b>
                <small>
                  {n.distM > 0 ? `${(n.distM / 1000).toFixed(1)} km · ` : ""}
                  {n.addr}
                </small>
              </div>
            </div>
          ))}
          <p className="datasrc">{t("nearbySrc")}</p>
        </div>
      )}

      {temple && temple.history && (
        <div className="panel">
          <h3>{t("pnStory")}</h3>
          <div className="step">
            <span className="ico">📜</span>
            <div>
              <b>
                {place(temple.name)}
                {temple.founded ? ` · ${temple.founded}` : ""}
              </b>
              <small>{temple.history}</small>
            </div>
          </div>
          <p className="datasrc">{t("storySrc")}</p>
        </div>
      )}

      <div className="local-note" dangerouslySetInnerHTML={{ __html: t("localNote") }} />

      <button className="cta" onClick={collectStamp} disabled={stamping}>
        {stamping ? t("stampChecking") : t("cta")}
      </button>
    </section>
  );
}
