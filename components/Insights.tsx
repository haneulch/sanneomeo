"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { provName } from "@/lib/provinces";
import { mountainName } from "@/lib/name";
import { MOUNTAINS } from "@/data/mountains";

interface Props {
  lang: Lang;
}

interface Insights {
  totalVisits: number;
  hikers: number;
  hiddenFound: number;
  provincesCovered: number;
  byProvince: { prov: string; count: number }[];
  byMonth: { ym: string; count: number }[];
  topMountains: { ko: string; en: string; count: number }[];
}

const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function mtnName(ko: string, en: string, lang: Lang): string {
  const m = MOUNTAINS.find((x) => x.ko === ko);
  if (m) return mountainName(m, lang);
  return lang === "ko" ? ko : en || ko;
}

export default function Insights({ lang }: Props) {
  const t = makeT(lang);
  const [d, setD] = useState<Insights | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then(setD)
      .catch(() => setD(null));
  }, []);

  const provMax = Math.max(1, ...(d?.byProvince.map((p) => p.count) ?? [1]));
  const monMax = Math.max(1, ...(d?.byMonth.map((m) => m.count) ?? [1]));
  const topMax = Math.max(1, ...(d?.topMountains.map((m) => m.count) ?? [1]));

  return (
    <section className="screen active" id="scr-insights">
      <div className="ins-head">
        <span className="eyebrow">{t("insEyebrow")}</span>
        <h1>{t("insTitle")}</h1>
        <p>{t("insSub")}</p>
      </div>

      <div className="kpirow">
        <div className="kpi">
          <b className="num">{d?.totalVisits ?? "–"}</b>
          <span>{t("insVisits")}</span>
        </div>
        <div className="kpi">
          <b className="num">{d?.hikers ?? "–"}</b>
          <span>{t("insHikers")}</span>
        </div>
        <div className="kpi">
          <b className="num">{d?.provincesCovered ?? "–"}</b>
          <span>{t("insProvinces")}</span>
        </div>
        <div className="kpi">
          <b className="num">{d?.hiddenFound ?? "–"}</b>
          <span>{t("insHidden")}</span>
        </div>
      </div>

      <div className="ins-card">
        <h3>{t("insByProvince")}</h3>
        {d?.byProvince.map((p) => (
          <div key={p.prov} className="barrow">
            <span className="bl">{provName(p.prov, lang)}</span>
            <span className="bt">
              <i style={{ width: `${(p.count / provMax) * 100}%` }} />
            </span>
            <span className="bv num">{p.count}</span>
          </div>
        ))}
      </div>

      <div className="ins-card">
        <h3>{t("insByMonth")}</h3>
        <div className="monthbars">
          {d?.byMonth.map((m) => {
            const mo = Number(m.ym.slice(5, 7));
            return (
              <div key={m.ym} className="mb">
                <span className="mbbar" style={{ height: `${(m.count / monMax) * 100}%` }} />
                <span className="mbv num">{m.count}</span>
                <span className="mbl">{MONTHS[mo]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ins-card">
        <h3>{t("insTop")}</h3>
        {d?.topMountains.map((m, i) => (
          <div key={m.ko} className="barrow">
            <span className="bl">
              {i + 1}. {mtnName(m.ko, m.en, lang)}
            </span>
            <span className="bt">
              <i className="amber" style={{ width: `${(m.count / topMax) * 100}%` }} />
            </span>
            <span className="bv num">{m.count}</span>
          </div>
        ))}
      </div>

      <div className="ins-note">{t("insNote")}</div>
    </section>
  );
}
