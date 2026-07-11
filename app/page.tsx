"use client";

import { useEffect, useState } from "react";
import type { Lang, Mountain } from "@/lib/types";
import Onboarding from "@/components/Onboarding";
import Discover from "@/components/Discover";
import Detail from "@/components/Detail";
import MountainList from "@/components/MountainList";
import Passport from "@/components/Passport";
import TabBar from "@/components/TabBar";

export type Screen = "onboard" | "home" | "detail" | "list" | "pass";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [screen, setScreen] = useState<Screen>("onboard");
  const [mountains, setMountains] = useState<Mountain[]>([]);

  useEffect(() => {
    fetch("/api/mountains")
      .then((r) => r.json())
      .then((d) => setMountains(d.items))
      .catch(() => setMountains([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div className={`phone${screen === "onboard" ? " ob" : ""}`}>
      {screen === "onboard" && (
        <Onboarding lang={lang} setLang={setLang} onDone={() => setScreen("home")} />
      )}
      {screen === "home" && (
        <Discover
          lang={lang}
          setLang={setLang}
          onOpenDetail={() => setScreen("detail")}
          onOpenPassport={() => setScreen("pass")}
        />
      )}
      {screen === "detail" && (
        <Detail lang={lang} onBack={() => setScreen("home")} onStamp={() => setScreen("pass")} />
      )}
      {screen === "list" && (
        <MountainList lang={lang} mountains={mountains} onOpenDetail={() => setScreen("detail")} />
      )}
      {screen === "pass" && <Passport lang={lang} />}
      {screen !== "onboard" && <TabBar lang={lang} screen={screen} onGo={setScreen} />}
    </div>
  );
}
