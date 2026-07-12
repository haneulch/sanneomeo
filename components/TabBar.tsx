"use client";

import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import type { Screen } from "@/app/page";

interface Props {
  lang: Lang;
  screen: Screen;
  onGo: (s: Screen) => void;
}

const TABS: { screen: Screen; glyph: string; label: string; activeOn: Screen[] }[] = [
  { screen: "home", glyph: "⛰", label: "tbDiscover", activeOn: ["home", "detail"] },
  { screen: "list", glyph: "🗺", label: "tbList", activeOn: ["list"] },
  { screen: "pass", glyph: "📖", label: "tbPassport", activeOn: ["pass"] },
];

export default function TabBar({ lang, screen, onGo }: Props) {
  const t = makeT(lang);
  return (
    <nav className="tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.screen}
          className={tab.activeOn.includes(screen) ? "on" : ""}
          onClick={() => onGo(tab.screen)}
        >
          <span className="glyph">{tab.glyph}</span>
          <span>{t(tab.label)}</span>
        </button>
      ))}
    </nav>
  );
}
