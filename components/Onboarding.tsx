"use client";

import { useState } from "react";
import type { Lang, Taste } from "@/lib/types";
import { LANGS, makeT } from "@/lib/i18n";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  onDone: (taste: Taste) => void;
}

const INTEREST_KEYS = ["chipGranite", "chipTemple", "chipFoliage", "chipSea", "chipSpring"];
const DIFF_BY_INDEX: Taste["diff"][] = ["easy", "mod", "hard"];

export default function Onboarding({ lang, setLang, onDone }: Props) {
  const t = makeT(lang);
  const [diff, setDiff] = useState(1);
  const [dur, setDur] = useState(1);
  const [interests, setInterests] = useState<Set<string>>(
    new Set(["chipGranite", "chipTemple"])
  );

  const toggleInterest = (k: string) =>
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });

  const diffOptions = [
    { em: "🌿", title: "obD1", sub: "obD1s" },
    { em: "⛰", title: "obD2", sub: "obD2s" },
    { em: "🧗", title: "obD3", sub: "obD3s" },
  ];

  const finish = () =>
    onDone({ diff: DIFF_BY_INDEX[diff], dur, interests: [...interests] });

  return (
    <section className="screen active" id="scr-onboard">
      <div className="ob-hero">
        <div className="brand">
          <span className="kr">산너머</span>
          <span className="en">SanNeomeo</span>
        </div>
        <h1>{t("obTitle")}</h1>
        <p>{t("obSub")}</p>
        <div className="oblang">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={lang === l.code ? "on" : ""}
              onClick={() => setLang(l.code)}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="ob-q">
        <h3>
          <span className="stepnum">1</span>
          <span>{t("obQ1")}</span>
        </h3>
        {diffOptions.map((o, i) => (
          <button
            key={o.title}
            className={`optcard${diff === i ? " on" : ""}`}
            onClick={() => setDiff(i)}
          >
            <span className="em">{o.em}</span>
            <span>
              <b>{t(o.title)}</b>
              <small>{t(o.sub)}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="ob-q">
        <h3>
          <span className="stepnum">2</span>
          <span>{t("obQ2")}</span>
        </h3>
        <div className="chiprow">
          {["obT1", "obT2", "obT3"].map((k, i) => (
            <button
              key={k}
              className={`chip${dur === i ? " on" : ""}`}
              onClick={() => setDur(i)}
            >
              {t(k)}
            </button>
          ))}
        </div>
      </div>

      <div className="ob-q">
        <h3>
          <span className="stepnum">3</span>
          <span>{t("obQ3")}</span>
        </h3>
        <div className="chiprow">
          {INTEREST_KEYS.map((k) => (
            <button
              key={k}
              className={`chip${interests.has(k) ? " on" : ""}`}
              onClick={() => toggleInterest(k)}
            >
              {t(k)}
            </button>
          ))}
        </div>
      </div>

      <button className="obcta" onClick={finish}>
        {t("obCta")}
      </button>
      <button className="obskip" onClick={finish}>
        {t("obSkip")}
      </button>
    </section>
  );
}
