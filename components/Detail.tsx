"use client";

import { useEffect, useState } from "react";
import type { Lang, Mountain } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { mapUrl } from "@/lib/geo";
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
}

interface Nearby {
  title: string;
  addr: string;
  distM: number;
}

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

  useEffect(() => {
    setSafety(null);
    setNearby([]);
    setTemple(null);
    if (!m.lat || !m.lng) return;

    fetch(`/api/safety?lat=${m.lat}&lng=${m.lng}`)
      .then((r) => r.json())
      .then(setSafety)
      .catch(() => setSafety(null));

    fetch(`/api/nearby?lat=${m.lat}&lng=${m.lng}`)
      .then((r) => r.json())
      .then((d) => setNearby(d.items ?? []))
      .catch(() => setNearby([]));

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
  }, [m]);

  const isDaedunsan = m.ko === "대둔산";
  const title = lang === "en" ? `${m.en} ${m.ko}` : m[lang];
  const distKmRT = (m.h * 2).toFixed(1);

  const transit = [
    { ico: "🚄", title: "t1", sub: "t1s" },
    { ico: "🚌", title: "t2", sub: "t2s" },
    { ico: "⚠️", title: "t3", sub: "t3s" },
  ];
  const after = [
    { ico: "🏯", title: "a1", sub: "a1s" },
    { ico: "🍜", title: "a2", sub: "a2s" },
    { ico: "♨️", title: "a3", sub: "a3s" },
  ];

  return (
    <section className="screen active" id="scr-detail">
      <button className="back" onClick={onBack}>
        {t("back")}
      </button>
      <div className="detail-hero">
        <svg viewBox="0 0 414 170" preserveAspectRatio="none" aria-hidden="true">
          <rect width="414" height="170" fill="#3E6B52" />
          <path
            d="M0,170 L80,40 L150,120 L225,22 L295,104 L360,58 L414,110 L414,170 Z"
            fill="#2C5140"
          />
          <path
            d="M0,170 L60,116 L160,152 L245,100 L330,148 L414,118 L414,170 Z"
            fill="#1E3F30"
          />
          <circle cx="345" cy="34" r="12" fill="#E8C87D" />
          <rect x="0" y="0" width="414" height="170" fill="url(#g1)" />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".45" stopColor="rgba(0,0,0,0)" />
              <stop offset="1" stopColor="rgba(10,20,14,.55)" />
            </linearGradient>
          </defs>
        </svg>
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
          <span>{YDS[m.d]}</span>
        </div>
        <div className="stat">
          <b className="num">{m.h} h</b>
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
              {t(safety?.access === "open" ? "sfOpen" : "sfClosed")}
            </b>
            <small>{t("sfAccessNote")}</small>
          </div>
          <div className="safeitem">
            <span className="k">🚨 {t("sfEmg")}</span>
            <b>119</b>
            <small>{t("sfEmgDesc")}</small>
          </div>
        </div>
      </div>

      {isDaedunsan && (
        <div className="panel">
          <h3>{t("pnTransit")}</h3>
          {transit.map((s) => (
            <div key={s.title} className="step">
              <span className="ico">{s.ico}</span>
              <div>
                <b>{t(s.title)}</b>
                <small>{t(s.sub)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDaedunsan && (
        <div className="panel">
          <h3>{t("pnAfter")}</h3>
          {after.map((s) => (
            <div key={s.title} className="step">
              <span className="ico">{s.ico}</span>
              <div>
                <b>{t(s.title)}</b>
                <small>{t(s.sub)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {nearby.length > 0 && (
        <div className="panel">
          <h3>{t("pnNearby")}</h3>
          {nearby.map((n) => (
            <div key={n.title} className="step">
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
                {temple.name}
                {temple.founded ? ` · ${temple.founded}` : ""}
              </b>
              <small>{temple.history}</small>
            </div>
          </div>
          <p className="datasrc">{t("storySrc")}</p>
        </div>
      )}

      <div className="local-note" dangerouslySetInnerHTML={{ __html: t("localNote") }} />

      <button className="cta" onClick={onStamp}>
        {t("cta")}
      </button>
    </section>
  );
}
