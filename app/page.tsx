"use client";

import { useEffect, useState } from "react";
import type { Lang, Mountain, Taste } from "@/lib/types";
import { MOUNTAINS } from "@/data/mountains";
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
  const [selected, setSelected] = useState<Mountain>(MOUNTAINS[7]); // 대둔산 기본
  const [taste, setTaste] = useState<Taste>({ diff: "mod", dur: 1, interests: ["chipGranite", "chipTemple"] });
  const [onboarded, setOnboarded] = useState(false); // 최초 온보딩 완료 여부

  useEffect(() => {
    fetch("/api/mountains")
      .then((r) => r.json())
      .then((d) => setMountains(d.items))
      .catch(() => setMountains(MOUNTAINS));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const openDetail = (m: Mountain) => {
    setSelected(m);
    setScreen("detail");
  };

  // 한글명(큐레이션 카드) 또는 영문명(계절 추천) 어느 쪽으로도 조회
  const openDetailByName = (name: string) => {
    const match = (x: Mountain) => x.ko === name || x.en === name;
    const m = mountains.find(match) ?? MOUNTAINS.find(match);
    if (m) openDetail(m);
  };

  return (
    <div className={`phone${screen === "onboard" ? " ob" : ""}`}>
      {screen === "onboard" && (
        <Onboarding
          lang={lang}
          setLang={setLang}
          initial={onboarded ? taste : undefined}
          editing={onboarded}
          onDone={(t) => {
            setTaste(t);
            setOnboarded(true);
            setScreen("home");
          }}
        />
      )}
      {screen === "home" && (
        <Discover
          lang={lang}
          setLang={setLang}
          taste={taste}
          onEditTaste={() => setScreen("onboard")}
          onOpenMountain={openDetailByName}
          onOpenPassport={() => setScreen("pass")}
        />
      )}
      {screen === "detail" && (
        <Detail
          lang={lang}
          mountain={selected}
          onBack={() => setScreen("home")}
          onStamp={() => setScreen("pass")}
        />
      )}
      {screen === "list" && (
        <MountainList lang={lang} mountains={mountains} onOpenDetail={openDetail} />
      )}
      {screen === "pass" && <Passport lang={lang} />}
      {screen !== "onboard" && <TabBar lang={lang} screen={screen} onGo={setScreen} />}
    </div>
  );
}
