"use client";

import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

export default function Passport({ lang }: Props) {
  const t = makeT(lang);

  const stamps = [
    { pk: "⛰", name: "sDaedun", date: "JUN 28" },
    { pk: "🏯", name: "sSeonun", date: "JUL 02" },
    { pk: "⛰", name: "sMoak", date: "JUL 05" },
    { pk: "⛰", name: "sNaejang", date: "JUL 09" },
  ];

  return (
    <section className="screen active" id="scr-pass">
      <div className="pass-head">
        <span className="eyebrow">{t("ppEyebrow")}</span>
        <h1>{t("ppTitle")}</h1>
        <p>{t("ppSummary")}</p>
      </div>

      <div className="hundred">
        <div className="top">
          <b className="t">{t("h100Title")}</b>
          <span className="cnt num">4 / 100</span>
        </div>
        <div className="bar gold">
          <i style={{ width: "4%" }} />
        </div>
        <p>{t("h100Desc")}</p>
      </div>

      <div className="stampgrid">
        {stamps.map((s) => (
          <div key={s.name} className="stamp got">
            <span className="pk">{s.pk}</span>
            <b>{t(s.name)}</b>
            <small>{s.date}</small>
          </div>
        ))}
        <div className="stamp empty">
          <span>{t("sBaegam")}</span>
        </div>
        <div className="stamp empty">
          <span>{t("sMore")}</span>
        </div>
      </div>

      <div className="sechead">
        <span className="eyebrow">{t("bdgEyebrow")}</span>
        <h2 className="sec" style={{ marginBottom: 0 }}>
          {t("bdgTitle")}
        </h2>
      </div>
      <div className="badgerow">
        <div className="bdg earned">
          <span className="medal">🥾</span>
          <b>{t("bdg1")}</b>
          <small>JUN 28</small>
        </div>
        <div className="bdg earned">
          <span className="medal">💎</span>
          <b>{t("bdg2")}</b>
          <small>JUL 05</small>
        </div>
        <div className="bdg locked">
          <span className="medal">🔒</span>
          <b>{t("bdg3")}</b>
          <small>{t("bdgLocked")}</small>
        </div>
        <div className="bdg locked">
          <span className="medal">🔒</span>
          <b>{t("bdg4")}</b>
          <small>{t("bdgLocked")}</small>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="bdg mystery">
            <span className="medal">?</span>
            <b>???</b>
            <small>{t("bdgHiddenTag")}</small>
          </div>
        ))}
      </div>

      <div className="hiddenhint">
        <span className="em">🔮</span>
        <span dangerouslySetInnerHTML={{ __html: t("hiddenHint") }} />
      </div>

      <div className="sechead">
        <span className="eyebrow">{t("chEyebrow")}</span>
        <h2 className="sec" style={{ marginBottom: 0 }}>
          {t("chSecTitle")}
        </h2>
      </div>

      <div className="challenge done" style={{ marginTop: 14 }}>
        <div className="top">
          <b>{t("ch0Title")}</b>
          <span className="donechip">{t("chDone")}</span>
        </div>
        <div className="bar">
          <i style={{ width: "100%" }} />
        </div>
        <div className="reward">
          <span>🥾</span>
          <span>{t("ch0Rw")}</span>
        </div>
      </div>

      <div className="challenge">
        <div className="top">
          <b>{t("chTitle")}</b>
          <span className="cnt num">4 / 5</span>
        </div>
        <div className="bar">
          <i style={{ width: "80%" }} />
        </div>
        <p>{t("chDesc")}</p>
        <div className="reward">
          <span>🏅</span>
          <span>{t("chRw")}</span>
        </div>
      </div>

      <div className="challenge">
        <div className="top">
          <b>{t("ch2Title")}</b>
          <span className="cnt num">2 / 3</span>
        </div>
        <div className="bar">
          <i style={{ width: "66%" }} />
        </div>
        <p>{t("ch2Desc")}</p>
        <div className="reward">
          <span>🏯</span>
          <span>{t("ch2Rw")}</span>
        </div>
      </div>

      <div className="challenge">
        <div className="top">
          <b>{t("ch3Title")}</b>
          <span className="cnt num">4 / 100</span>
        </div>
        <div className="bar gold">
          <i style={{ width: "4%" }} />
        </div>
        <p>{t("ch3Desc")}</p>
        <div className="reward">
          <span>👑</span>
          <span>{t("ch3Rw")}</span>
        </div>
      </div>

      <div className="coupon" style={{ marginTop: 20 }}>
        <span className="pct num">10%</span>
        <div>
          <b>{t("c1")}</b>
          <small>{t("c1s")}</small>
        </div>
      </div>
      <div className="coupon" style={{ marginBottom: 8 }}>
        <span className="pct num">15%</span>
        <div>
          <b>{t("c2")}</b>
          <small>{t("c2s")}</small>
        </div>
      </div>
    </section>
  );
}
