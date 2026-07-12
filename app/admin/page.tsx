"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { LANGS } from "@/lib/i18n";
import Insights from "@/components/Insights";

// 지자체용 어드민 대시보드 — 관광객 앱(/)과 분리된 별도 진입점.
export default function AdminPage() {
  const [lang, setLang] = useState<Lang>("ko");

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          <b>산너머</b>
          <span>Admin · Regional Dashboard</span>
        </div>
        <div className="admin-lang">
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
      </header>
      <div className="admin-body">
        <Insights lang={lang} />
      </div>
    </div>
  );
}
