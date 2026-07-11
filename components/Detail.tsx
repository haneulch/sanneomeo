"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onBack: () => void;
  onStamp: () => void;
}

const DAEDUNSAN_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("대둔산 Daedunsan South Korea");

interface Temple {
  name: string;
  addr: string;
  founded: string;
  history: string;
}

interface Safety {
  sunset: string;
  alert: { level: "advisory" | "warning"; type: string } | null;
  access: "open" | "partial" | "closed";
}

export default function Detail({ lang, onBack, onStamp }: Props) {
  const t = makeT(lang);
  const [temple, setTemple] = useState<Temple | null>(null);
  const [safety, setSafety] = useState<Safety | null>(null);

  useEffect(() => {
    // 대둔산 좌표 기반 일몰·특보·입산통제 (기상청/산림청 연동 지점)
    fetch("/api/safety?lat=36.122&lng=127.322")
      .then((r) => r.json())
      .then(setSafety)
      .catch(() => setSafety(null));
  }, []);

  useEffect(() => {
    // 대둔산 태고사(충남 금산 진산면) 유래·연혁 — 행안부 전통사찰 데이터
    fetch("/api/temples?q=태고사&addr=금산군")
      .then((r) => r.json())
      .then((d) => {
        const items: Temple[] = d.items ?? [];
        const best = items
          .slice()
          .sort((a, b) => b.history.length - a.history.length)[0];
        setTemple(best ?? null);
      })
      .catch(() => setTemple(null));
  }, []);

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
          <b>{t("m1Name")}</b>
          <span>{t("dSub")}</span>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <b>{t("diffMod")}</b>
          <span>YDS Class 2</span>
        </div>
        <div className="stat">
          <b className="num">3.5 h</b>
          <span>{t("stRound")}</span>
        </div>
        <div className="stat">
          <b className="num">7.1 km</b>
          <span>{t("stDist")}</span>
        </div>
      </div>

      <a className="dmap" href={DAEDUNSAN_MAP_URL} target="_blank" rel="noopener noreferrer">
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
              <b className="warn">{t("sfAlertHeat")}</b>
            ) : (
              <b className="ok">{t("sfNone")}</b>
            )}
            <small>{t("sfAlertNote")}</small>
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
