"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { LANGS, LANG_LABEL, makeT } from "@/lib/i18n";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onOpenDetail: () => void;
  onOpenPassport: () => void;
}

const CARDS = [
  {
    match: "match96",
    name: "m1Name",
    loc: "m1Loc",
    diff: "diffMod",
    dur: "3.5 h",
    temple: "m1Temple",
    why: "m1Why",
    art: (
      <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true">
        <rect width="380" height="96" fill="#3E6B52" />
        <path d="M0,96 L70,26 L130,70 L200,14 L260,62 L330,34 L380,68 L380,96 Z" fill="#2C5140" />
        <path d="M0,96 L55,66 L140,88 L215,58 L300,86 L380,64 L380,96 Z" fill="#1E3F30" />
        <circle cx="318" cy="22" r="9" fill="#E8C87D" />
      </svg>
    ),
  },
  {
    match: "match92",
    name: "m2Name",
    loc: "m2Loc",
    diff: "diffEasy",
    dur: "3 h",
    temple: "m2Temple",
    why: "m2Why",
    art: (
      <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true">
        <rect width="380" height="96" fill="#5F7F5E" />
        <path d="M0,96 Q95,18 190,58 T380,40 L380,96 Z" fill="#40634A" />
        <path d="M0,96 Q120,58 240,80 T380,70 L380,96 Z" fill="#28483A" />
        <circle cx="60" cy="24" r="8" fill="#E8C87D" />
      </svg>
    ),
  },
  {
    match: "match89",
    name: "m3Name",
    loc: "m3Loc",
    diff: "diffMod",
    dur: "4 h",
    temple: "m3Temple",
    why: "m3Why",
    art: (
      <svg viewBox="0 0 380 96" preserveAspectRatio="none" aria-hidden="true">
        <rect width="380" height="96" fill="#476B58" />
        <path d="M0,96 L90,20 L165,64 L240,30 L320,72 L380,48 L380,96 Z" fill="#31543F" />
        <path d="M0,96 L80,70 L180,90 L260,66 L380,88 L380,96 Z" fill="#1E3D2E" />
        <circle cx="200" cy="18" r="8" fill="#E8C87D" />
      </svg>
    ),
  },
];

const TASTE_CHIPS: { key: string; on: boolean }[] = [
  { key: "chipGranite", on: true },
  { key: "chipTemple", on: true },
  { key: "chipFoliage", on: false },
  { key: "chipSea", on: false },
  { key: "chipEasy", on: false },
];

export default function Discover({ lang, setLang, onOpenDetail, onOpenPassport }: Props) {
  const t = makeT(lang);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

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
            fill="#2C5943"
            opacity=".55"
          />
          <path
            d="M0,110 L45,78 L105,96 L160,62 L230,94 L300,66 L360,92 L414,74 L414,110 Z"
            fill="#8FAE93"
            opacity=".8"
          />
          <circle cx="330" cy="26" r="11" fill="#D99A3D" opacity=".9" />
        </svg>
      </header>

      <div className="taste">
        <div className="q">{t("tasteQ")}</div>
        <div className="row">
          {TASTE_CHIPS.map((c) => (
            <span key={c.key} className={`chip${c.on ? " on" : ""}`}>
              {t(c.key)}
            </span>
          ))}
        </div>
      </div>

      <button className="banner100" onClick={onOpenPassport}>
        <span className="pk">⛰</span>
        <span>
          <b>{t("b100Title")}</b>
          <small>{t("b100Sub")}</small>
        </span>
        <span className="go">›</span>
      </button>

      <div className="pad" style={{ marginTop: 24 }}>
        <span className="eyebrow">{t("curated")}</span>
        <h2 className="sec" dangerouslySetInnerHTML={{ __html: t("secTitle") }} />
      </div>

      <div className="cards pad">
        {CARDS.map((c) => (
          <button key={c.name} className="mcard" onClick={onOpenDetail}>
            <div className="art">
              {c.art}
              <span className="badge">{t(c.match)}</span>
              <span className="m100">{t("tag100")}</span>
            </div>
            <div className="body">
              <div className="name">
                <b>{t(c.name)}</b>
                <span>{t(c.loc)}</span>
              </div>
              <div className="meta">
                <span>
                  {t("lblDiff")} <i>{t(c.diff)}</i>
                </span>
                <span>
                  {t("lblDur")} <i className="num">{c.dur}</i>
                </span>
                <span>
                  {t("lblTemple")} <i>{t(c.temple)}</i>
                </span>
              </div>
              <p className="why">{t(c.why)}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
