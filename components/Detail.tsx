"use client";

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

export default function Detail({ lang, onBack, onStamp }: Props) {
  const t = makeT(lang);

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

      <div className="local-note" dangerouslySetInnerHTML={{ __html: t("localNote") }} />

      <button className="cta" onClick={onStamp}>
        {t("cta")}
      </button>
    </section>
  );
}
