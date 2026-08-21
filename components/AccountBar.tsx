"use client";

// 로그인 상태 표시 + Google 로그인/로그아웃.
// Supabase env가 빌드에 없으면(로컬 CSV 데모) 아무것도 렌더하지 않는다.
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { makeT } from "@/lib/i18n";
import { createBrowserSupabase, isSupabaseAuthConfigured } from "@/lib/supabase/browser";

interface Me {
  id: string;
  provider: "demo" | "google";
  name: string;
}

export default function AccountBar({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  const [me, setMe] = useState<Me | null>(null);
  const [busy, setBusy] = useState(false);
  const enabled = isSupabaseAuthConfigured();

  useEffect(() => {
    if (!enabled) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null))
      .catch(() => {});
  }, [enabled]);

  if (!enabled || !me) return null;

  const signIn = async () => {
    setBusy(true);
    const supabase = createBrowserSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    setBusy(true);
    const supabase = createBrowserSupabase();
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="accountbar">
      {me.provider === "google" ? (
        <>
          <span className="accountname">
            {t("signedInAs").replace("{name}", me.name)}
          </span>
          <button className="accountbtn" onClick={signOut} disabled={busy}>
            {t("signOut")}
          </button>
        </>
      ) : (
        <>
          <span className="accountname">{t("demoAccount")}</span>
          <button className="accountbtn" onClick={signIn} disabled={busy}>
            {t("signIn")}
          </button>
        </>
      )}
    </div>
  );
}
