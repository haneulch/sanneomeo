"use client";

import { useMemo, useState } from "react";
import type { Difficulty, Lang, Mountain, Region } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { SEOUL, distKm, mapUrl } from "@/lib/geo";

interface Props {
  lang: Lang;
  mountains: Mountain[];
  onOpenDetail: (m: Mountain) => void;
}

type RegionFilter = Region | "all";
type DiffFilter = Difficulty | "all";
type Sort = "rec" | "dist" | "elev";
type LocSrc = "you" | "seoul" | null;

const REGIONS: RegionFilter[] = [
  "all",
  "seoul",
  "gangwon",
  "chungcheong",
  "jeolla",
  "gyeongsang",
  "jeju",
];
const DIFFS: DiffFilter[] = ["all", "easy", "mod", "hard"];
const SORTS: Sort[] = ["rec", "dist", "elev"];
const SORT_KEY: Record<Sort, string> = { rec: "srtRec", dist: "srtDist", elev: "srtElev" };

export default function MountainList({ lang, mountains, onOpenDetail }: Props) {
  const t = makeT(lang);
  const [region, setRegion] = useState<RegionFilter>("all");
  const [diff, setDiff] = useState<DiffFilter>("all");
  const [sort, setSort] = useState<Sort>("rec");
  const [query, setQuery] = useState("");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locSrc, setLocSrc] = useState<LocSrc>(null);

  const pickSort = (s: Sort) => {
    setSort(s);
    if (s === "dist" && !userLoc) {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => {
            setUserLoc({ lat: p.coords.latitude, lng: p.coords.longitude });
            setLocSrc("you");
          },
          () => {
            setUserLoc(SEOUL);
            setLocSrc("seoul");
          },
          { timeout: 4000 }
        );
      } else {
        setUserLoc(SEOUL);
        setLocSrc("seoul");
      }
    }
  };

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mountains.filter(
      (m) =>
        (region === "all" || m.r === region) &&
        (diff === "all" || m.d === diff) &&
        (!q ||
          m.ko.toLowerCase().includes(q) ||
          m.en.toLowerCase().includes(q) ||
          m.ja.toLowerCase().includes(q) ||
          m.zh.toLowerCase().includes(q))
    );
    if (sort === "dist" && userLoc) {
      list = [...list].sort((a, b) => distKm(userLoc, a) - distKm(userLoc, b));
    } else if (sort === "elev") {
      list = [...list].sort((a, b) => b.elev - a.elev);
    }
    return list;
  }, [mountains, region, diff, sort, userLoc, query]);

  let countLine = `${items.length} ${t("cntSuffix")}`;
  if (sort === "dist" && locSrc) {
    countLine += ` · 📍 ${locSrc === "you" ? t("locYou") : t("locSeoul")}`;
  }

  return (
    <section className="screen active" id="scr-list">
      <div className="list-head">
        <span className="eyebrow">{t("lsEyebrow")}</span>
        <h1>{t("lsTitle")}</h1>
        <p className="cnt num">{countLine}</p>
      </div>
      <div className="searchbox">
        <span>🔍</span>
        <input
          type="text"
          value={query}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clr" onClick={() => setQuery("")} aria-label="clear">
            ✕
          </button>
        )}
      </div>
      <div className="fltwrap">
        <div className="fltrow">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`chip${region === r ? " on" : ""}`}
              onClick={() => setRegion(r)}
            >
              {t(r === "all" ? "rg_all" : `rg_${r}`)}
            </button>
          ))}
        </div>
        <div className="fltrow">
          {DIFFS.map((d) => (
            <button
              key={d}
              className={`chip${diff === d ? " on" : ""}`}
              onClick={() => setDiff(d)}
            >
              {t(d === "all" ? "rg_all" : `df_${d}`)}
            </button>
          ))}
        </div>
        <div className="fltrow">
          {SORTS.map((s) => (
            <button
              key={s}
              className={`chip${sort === s ? " on" : ""}`}
              onClick={() => pickSort(s)}
            >
              {t(SORT_KEY[s])}
            </button>
          ))}
        </div>
      </div>
      <div className="mlist">
        {items.map((m) => (
          <div
            key={m.en}
            className={`mrow${m.got ? " got" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => onOpenDetail(m)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onOpenDetail(m);
            }}
          >
            <span className="dot">⛰</span>
            <span className="info">
              <b>{m[lang]}</b>
              <small>
                {sort === "dist" && userLoc && (
                  <>
                    <b className="num" style={{ color: "var(--pine)" }}>
                      {Math.round(distKm(userLoc, m))} km
                    </b>
                    {" · "}
                  </>
                )}
                {t(`rg_${m.r}`)} · <span className="num">{m.elev.toLocaleString()} m</span> ·{" "}
                {m.h} h{m.temple ? " · 🏯" : ""}
              </small>
            </span>
            <span className="right">
              <span className={`pill ${m.d}`}>{t(`df_${m.d}`)}</span>
              {m.got && <span className="gotchip">{t("stamped")}</span>}
            </span>
            <a
              className="mapbtn"
              href={mapUrl(m)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps"
              onClick={(e) => e.stopPropagation()}
            >
              📍
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
