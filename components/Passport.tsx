"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

function drawShareCard(canvas: HTMLCanvasElement, t: (k: string) => string) {
  const W = 720, H = 900;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 배경
  ctx.fillStyle = "#1E3F30";
  ctx.fillRect(0, 0, W, H);

  // 능선 실루엣
  ctx.fillStyle = "rgba(44,89,67,.7)";
  ctx.beginPath();
  ctx.moveTo(0, 780);
  [[110, 640], [200, 720], [320, 600], [430, 700], [560, 630], [720, 710]].forEach(([x, y]) =>
    ctx.lineTo(x, y)
  );
  ctx.lineTo(720, 900); ctx.lineTo(0, 900); ctx.closePath(); ctx.fill();

  ctx.fillStyle = "rgba(143,174,147,.45)";
  ctx.beginPath();
  ctx.moveTo(0, 900);
  [[90, 760], [220, 830], [360, 740], [500, 820], [640, 770], [720, 800]].forEach(([x, y]) =>
    ctx.lineTo(x, y)
  );
  ctx.lineTo(720, 900); ctx.closePath(); ctx.fill();

  // 해
  ctx.fillStyle = "#D99A3D";
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

  center("4 / 100", 400, "800 110px sans-serif", "#D99A3D");
  center(t("h100Title"), 450, "600 24px sans-serif", "rgba(242,245,239,.85)");

  center("⛰ ⛰ ⛰ ⛰", 540, "48px sans-serif");
  center(`${t("sDaedun")} · ${t("sSeonun")} · ${t("sMoak")} · ${t("sNaejang")}`, 585, "500 22px sans-serif", "#CBD8CC");

  center(`🥾 ${t("bdg1")}   💎 ${t("bdg2")}`, 650, "600 26px sans-serif", "#F4E7CF");

  center(t("tagline"), 850, "500 20px sans-serif", "rgba(242,245,239,.65)");
}

export default function Passport({ lang }: Props) {
  const t = makeT(lang);
  const [shareOpen, setShareOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (shareOpen && canvasRef.current) drawShareCard(canvasRef.current, t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareOpen, lang]);

  const savePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "sanneomeo-passport.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

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
        <div className="pass-title">
          <h1>{t("ppTitle")}</h1>
          <button className="sharebtn" onClick={() => setShareOpen(true)}>
            📤 {t("shareBtn")}
          </button>
        </div>
        <p>{t("ppSummary")}</p>
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
