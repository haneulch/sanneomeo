"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { MOUNTAINS } from "@/data/mountains";
import { provName } from "@/lib/provinces";

interface Props {
  lang: Lang;
}

interface Challenge {
  id: "first" | "temple" | "grand" | "prov";
  prov?: string;
  done: number;
  total: number;
  complete: boolean;
}
interface Badge {
  id: "first" | "hidden" | "pilgrim" | "grand" | "prov";
  prov?: string;
  emoji: string;
  earned: boolean;
  date: string;
}
interface Mystery {
  hint: Record<Lang, string>;
}
const CH_TITLE_KEY: Record<string, string> = {
  first: "ch0Title",
  temple: "ch2Title",
  grand: "ch3Title",
};
const BADGE_KEY: Record<string, string> = {
  first: "bdg1",
  hidden: "bdg2",
  pilgrim: "bdgPilgrim",
  grand: "bdg4",
};

interface Stamp {
  id: string;
  mountainKo: string;
  mountainEn: string;
  kind: "peak" | "temple";
  stampedAt: string;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
}
function localizeName(s: Stamp, lang: Lang): string {
  const m = MOUNTAINS.find((x) => x.ko === s.mountainKo);
  if (m) return m[lang];
  return lang === "en" ? s.mountainEn : s.mountainKo;
}

interface ShareInfo {
  total: number;
  emojis: string;
  names: string;
}

function drawShareCard(canvas: HTMLCanvasElement, t: (k: string) => string, info: ShareInfo) {
  const W = 720, H = 900;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 배경
  ctx.fillStyle = "#2F5E2A";
  ctx.fillRect(0, 0, W, H);

  // 능선 실루엣
  ctx.fillStyle = "rgba(60,122,52,.7)";
  ctx.beginPath();
  ctx.moveTo(0, 780);
  [[110, 640], [200, 720], [320, 600], [430, 700], [560, 630], [720, 710]].forEach(([x, y]) =>
    ctx.lineTo(x, y)
  );
  ctx.lineTo(720, 900); ctx.lineTo(0, 900); ctx.closePath(); ctx.fill();

  ctx.fillStyle = "rgba(143,203,106,.45)";
  ctx.beginPath();
  ctx.moveTo(0, 900);
  [[90, 760], [220, 830], [360, 740], [500, 820], [640, 770], [720, 800]].forEach(([x, y]) =>
    ctx.lineTo(x, y)
  );
  ctx.lineTo(720, 900); ctx.closePath(); ctx.fill();

  // 해
  ctx.fillStyle = "#F2C94C";
  ctx.beginPath(); ctx.arc(600, 150, 42, 0, Math.PI * 2); ctx.fill();

  const center = (txt: string, y: number, font: string, color = "#F2F5EF") => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(txt, W / 2, y);
  };

  center("산너머", 130, "800 64px sans-serif");
  center("S A N N E O M E O", 172, "600 20px sans-serif", "rgba(242,245,239,.7)");

  center(t("ppTitle"), 260, "700 32px sans-serif", "#E4E9E2");

  center(`${info.total} / 100`, 400, "800 110px sans-serif", "#F2C94C");
  center(t("h100Title"), 450, "600 24px sans-serif", "rgba(242,245,239,.85)");

  center(info.emojis || "⛰", 540, "48px sans-serif");
  center(info.names, 585, "500 22px sans-serif", "#CBD8CC");

  center(`🥾 ${t("bdg1")}   💎 ${t("bdg2")}`, 650, "600 26px sans-serif", "#F4E7CF");

  center(t("tagline"), 850, "500 20px sans-serif", "rgba(242,245,239,.65)");
}

export default function Passport({ lang }: Props) {
  const t = makeT(lang);
  const [shareOpen, setShareOpen] = useState(false);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/api/stamps")
      .then((r) => r.json())
      .then((d) => setStamps(d.stamps ?? []))
      .catch(() => setStamps([]));
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => {
        setChallenges(d.challenges ?? []);
        setBadges(d.badges ?? []);
        setMysteries(d.mysteries ?? []);
      })
      .catch(() => {});
  }, []);

  const chTitle = (c: Challenge) =>
    c.id === "prov" ? `${provName(c.prov!, lang)} ${t("chCircuit")}` : t(CH_TITLE_KEY[c.id]);
  const badgeLabel = (b: Badge) =>
    b.id === "prov" ? `${provName(b.prov!, lang)} ${t("chCircuit")}` : t(BADGE_KEY[b.id]);
  const coreBadges = badges.filter((b) => b.id !== "prov");
  const provBadges = badges.filter((b) => b.id === "prov" && b.earned);

  const peaks = stamps.filter((s) => s.kind === "peak").length;
  const temples = stamps.filter((s) => s.kind === "temple").length;
  const total = stamps.length;

  const shareInfo: ShareInfo = {
    total,
    emojis: stamps.slice(0, 6).map((s) => (s.kind === "temple" ? "🏯" : "⛰")).join(" "),
    names: stamps.slice(0, 4).map((s) => localizeName(s, lang)).join(" · "),
  };

  useEffect(() => {
    if (shareOpen && canvasRef.current) drawShareCard(canvasRef.current, t, shareInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareOpen, lang, stamps]);

  const savePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "sanneomeo-passport.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <section className="screen active" id="scr-pass">
      <div className="pass-head">
        <span className="eyebrow">{t("ppEyebrow")}</span>
        <div className="pass-title">
          <h1>{t("ppTitle")}</h1>
          <button className="sharebtn" onClick={() => setShareOpen(true)}>
            📤 {t("shareBtn")}
          </button>
        </div>
        <p>
          <span className="num">⛰ {peaks}</span> · <span className="num">🏯 {temples}</span>
        </p>
      </div>

      {shareOpen && (
        <div className="sheetwrap" onClick={() => setShareOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <b className="sheettitle">{t("shareTitle")}</b>
            <canvas ref={canvasRef} className="sharecanvas" />
            <div className="sheetbtns">
              <button className="primary" onClick={savePng}>
                {t("shareSave")}
              </button>
              <button onClick={() => setShareOpen(false)}>{t("shareClose")}</button>
            </div>
          </div>
        </div>
      )}

      <div className="hundred">
        <div className="top">
          <b className="t">{t("h100Title")}</b>
          <span className="cnt num">{total} / 100</span>
        </div>
        <div className="bar gold">
          <i style={{ width: `${Math.min(total, 100)}%` }} />
        </div>
        <p>{t("h100Desc")}</p>
      </div>

      <div className="stampgrid">
        {stamps.map((s) => (
          <div key={s.id} className="stamp got">
            <span className="pk">{s.kind === "temple" ? "🏯" : "⛰"}</span>
            <b>{localizeName(s, lang)}</b>
            <small>{fmtDate(s.stampedAt)}</small>
          </div>
        ))}
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
        {coreBadges.map((b) => (
          <div key={b.id} className={`bdg ${b.earned ? "earned" : "locked"}`}>
            <span className="medal">{b.earned ? b.emoji : "🔒"}</span>
            <b>{badgeLabel(b)}</b>
            <small>{b.earned && b.date ? fmtDate(b.date) : t("bdgLocked")}</small>
          </div>
        ))}
        {provBadges.map((b) => (
          <div key={"prov-" + b.prov} className="bdg earned">
            <span className="medal">{b.emoji}</span>
            <b>{badgeLabel(b)}</b>
            <small>{t("chDone")}</small>
          </div>
        ))}
        {mysteries.map((m, i) => (
          <button
            key={i}
            className="bdg mystery"
            onClick={() => setHint(m.hint[lang])}
          >
            <span className="medal">?</span>
            <b>???</b>
            <small>{t("bdgHintTap")}</small>
          </button>
        ))}
      </div>

      {hint && (
        <div className="sheetwrap" onClick={() => setHint(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <b className="sheettitle">🔮 {t("hintTitle")}</b>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)" }}>{hint}</p>
            <div className="sheetbtns">
              <button className="primary" onClick={() => setHint(null)}>
                {t("shareClose")}
              </button>
            </div>
          </div>
        </div>
      )}

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

      {challenges.map((c) => {
        const pct = Math.min(100, Math.round((c.done / c.total) * 100));
        const gold = c.id === "grand";
        const emoji =
          c.id === "first" ? "🥾" : c.id === "temple" ? "🏯" : c.id === "grand" ? "👑" : "🏅";
        return (
          <div
            key={c.id + (c.prov ?? "")}
            className={`challenge${c.complete ? " done" : ""}`}
            style={{ marginTop: 14 }}
          >
            <div className="top">
              <b>{chTitle(c)}</b>
              {c.complete ? (
                <span className="donechip">{t("chDone")}</span>
              ) : (
                <span className="cnt num">
                  {c.done} / {c.total}
                </span>
              )}
            </div>
            <div className={`bar${gold ? " gold" : ""}`}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="reward">
              <span>{emoji}</span>
              <span>
                {t("chReward")}: {chTitle(c)} {t("bdgWord")}
              </span>
            </div>
          </div>
        );
      })}

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
