"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lang, Mountain, Taste } from "@/lib/types";
import { LANGS, LANG_LABEL, makeT } from "@/lib/i18n";
import { MOUNTAINS } from "@/data/mountains";
import { provName } from "@/lib/provinces";
import type { SeasonalPick } from "@/data/seasonal";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  taste: Taste;
  onOpenMountain: (name: string) => void;
  onOpenPassport: () => void;
}

// 유명 5산 — 추천에서 제외해 숨은 명산으로 분산 유도
const FAMOUS = new Set(["설악산", "북한산", "지리산", "한라산", "무등산"]);

const ART = [
  (
    <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true" key="a">
      <rect width="380" height="96" fill="#4E9F44" />
      <path d="M0,96 L70,26 L130,70 L200,14 L260,62 L330,34 L380,68 L380,96 Z" fill="#3C7A34" />
      <path d="M0,96 L55,66 L140,88 L215,58 L300,86 L380,64 L380,96 Z" fill="#2A5422" />
      <circle cx="318" cy="22" r="9" fill="#F2C94C" />
    </svg>
  ),
  (
    <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true" key="b">
      <rect width="380" height="96" fill="#6FB84E" />
      <path d="M0,96 Q95,18 190,58 T380,40 L380,96 Z" fill="#3C7A34" />
      <path d="M0,96 Q120,58 240,80 T380,70 L380,96 Z" fill="#2A5422" />
      <circle cx="60" cy="24" r="8" fill="#F2C94C" />
    </svg>
  ),
  (
    <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true" key="c">
      <rect width="380" height="96" fill="#4E9F44" />
      <path d="M0,96 L90,20 L165,64 L240,30 L320,72 L380,48 L380,96 Z" fill="#3C7A34" />
      <path d="M0,96 L80,70 L180,90 L260,66 L380,88 L380,96 Z" fill="#2A5422" />
      <circle cx="200" cy="18" r="8" fill="#F2C94C" />
    </svg>
  ),
];

const TASTE_CHIPS = ["chipGranite", "chipTemple", "chipFoliage", "chipSea", "chipSpring"];

function durBucket(h: number): number {
  return h <= 3.5 ? 0 : h <= 5 ? 1 : 2;
}
const DIFF_ADJ: Record<string, string[]> = { easy: ["mod"], mod: ["easy", "hard"], hard: ["mod"] };

interface Rec extends Mountain {
  match: number;
}

function recommend(list: Mountain[], taste: Taste): Rec[] {
  const wantTemple = taste.interests.includes("chipTemple");
  const scored = list
    .filter((m) => !FAMOUS.has(m.ko) && m.ko)
    .map((m) => {
      let s = 0;
      if (m.d === taste.diff) s += 40;
      else if (DIFF_ADJ[taste.diff]?.includes(m.d)) s += 15;
      if (wantTemple && m.temple) s += 25;
      if (durBucket(m.h) === taste.dur) s += 20;
      s += m.ko.charCodeAt(0) % 7; // 결정적 타이브레이크
      return { ...m, match: Math.min(97, 70 + Math.round(s / 3)) };
    })
    .sort((a, b) => b.match - a.match);
  return scored.slice(0, 3);
}

export default function Discover({ lang, setLang, taste, onOpenMountain, onOpenPassport }: Props) {
  const t = makeT(lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const [seasonal, setSeasonal] = useState<SeasonalPick[]>([]);
  const [stampCount, setStampCount] = useState(0);
  const [mountains, setMountains] = useState<Mountain[]>(MOUNTAINS);

  useEffect(() => {
    fetch("/api/mountains")
      .then((r) => r.json())
      .then((d) => setMountains(d.items?.length ? d.items : MOUNTAINS))
      .catch(() => setMountains(MOUNTAINS));
    fetch("/api/stamps")
      .then((r) => r.json())
      .then((d) => setStampCount((d.stamps ?? []).length))
      .catch(() => setStampCount(0));
  }, []);

  useEffect(() => {
    fetch(`/api/seasonal?lang=${lang}`)
      .then((r) => r.json())
      .then((d) => setSeasonal(d.items ?? []))
      .catch(() => setSeasonal([]));
  }, [lang]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  const recs = useMemo(() => recommend(mountains, taste), [mountains, taste]);

  return (
    <section className="screen active" id="scr-home">
      <header className="hero">
        <div className="brand">
          <span className="kr">산너머</span>
          <span className="en">SanNeomeo</span>
        </div>
        <p className="tag">{t("tagline")}</p>
        <div className="langbox" onClick={(e) => e.stopPropagation()}>
          <button className="langbtn" onClick={() => setMenuOpen((v) => !v)}>
            {LANG_LABEL[lang]} ▾
          </button>
          <div className={`langmenu${menuOpen ? " open" : ""}`}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={lang === l.code ? "on" : ""}
                onClick={() => {
                  setLang(l.code);
                  setMenuOpen(false);
                }}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
        <svg className="ridge" viewBox="0 0 414 110" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0,95 L60,52 L110,80 L170,30 L225,72 L285,42 L340,78 L414,50 L414,110 L0,110 Z"
            fill="#3C7A34"
            opacity=".55"
          />
          <path
            d="M0,110 L45,78 L105,96 L160,62 L230,94 L300,66 L360,92 L414,74 L414,110 Z"
            fill="#8FCB6A"
            opacity=".8"
          />
          <circle cx="330" cy="26" r="11" fill="#F2C94C" opacity=".9" />
        </svg>
      </header>

      <div className="taste">
        <div className="q">{t("tasteQ")}</div>
        <div className="row">
          {TASTE_CHIPS.map((k) => (
            <span
              key={k}
              className={`chip${taste.interests.includes(k) || (k === "chipGranite" && taste.diff === "hard") ? " on" : ""}`}
            >
              {t(k)}
            </span>
          ))}
        </div>
      </div>

      {seasonal.length > 0 && (
        <>
          <div className="pad" style={{ marginTop: 24 }}>
            <span className="eyebrow">{t("nowEyebrow")}</span>
            <h2 className="sec" style={{ marginBottom: 0 }}>
              {t("nowTitle")}
            </h2>
          </div>
          <div className="nowrow">
            {seasonal.map((s) => (
              <button
                key={s.mountain + s.emoji}
                className="nowcard"
                onClick={() => onOpenMountain(s.mountain)}
              >
                <span className="em">{s.emoji}</span>
                <b>{s.title[lang]}</b>
                <span className="nowtag">{s.tag[lang]}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <button className="banner100" onClick={onOpenPassport}>
        <span className="pk">⛰</span>
        <span>
          <b>{t("b100Title")}</b>
          <small>{t("b100Sub").replace("{n}", String(stampCount))}</small>
        </span>
        <span className="go">›</span>
      </button>

      <div className="pad" style={{ marginTop: 24 }}>
        <span className="eyebrow">{t("curated")}</span>
        <h2 className="sec">{t("recTitle")}</h2>
      </div>

      <div className="cards pad">
        {recs.map((m, i) => (
          <button key={m.ko} className="mcard" onClick={() => onOpenMountain(m.ko)}>
            <div className="art">
              {ART[i % ART.length]}
              <span className="badge">
                {m.match}% {t("matchWord")}
              </span>
              <span className="m100">{t("tag100")}</span>
            </div>
            <div className="body">
              <div className="name">
                <b>{lang === "en" ? m.en : m[lang]}</b>
                <span>{m.prov ? provName(m.prov, lang) : t(`rg_${m.r}`)}</span>
              </div>
              <div className="meta">
                <span>
                  {t("lblDiff")} <i>{t(`df_${m.d}`)}</i>
                </span>
                <span>
                  {t("lblDur")} <i className="num">{m.h} h</i>
                </span>
                {m.temple && (
                  <span>
                    <i>🏯 {t("chipTemple")}</i>
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
