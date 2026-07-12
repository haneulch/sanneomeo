// 숨은 보석 — 100대 명산 중 외국인에게 덜 알려진 7좌.
// 유명 5산과 안 겹치고 도 분산. 히든 뱃지 대상.
// hint: 이름은 밝히지 않는 수수께끼형 힌트 (? 뱃지 탭 시 노출).
export interface HiddenMountain {
  ko: string;
  hint: { en: string; ko: string; ja: string; zh: string };
}

export const HIDDEN: HiddenMountain[] = [
  {
    ko: "명지산", // 경기 가평
    hint: {
      en: "A high peak an hour from Seoul, ringed by pine-nut forests beside a ridge named for lovers.",
      ko: "서울에서 한 시간, 잣나무 숲에 둘러싸인 고봉 — 옆 능선의 이름은 '연인'.",
      ja: "ソウルから1時間、松の実の森に囲まれた高峰。隣の稜線の名は「恋人」。",
      zh: "距首尔一小时的高峰，被松子林环绕，旁边的山脊以「恋人」为名。",
    },
  },
  {
    ko: "방태산", // 강원 인제
    hint: {
      en: "Deep primeval forest and cold valley pools, folded into Inje — one of Korea's least-trodden big peaks.",
      ko: "인제 깊은 곳, 원시림과 차가운 계곡 소(沼). 한국에서 가장 발길 뜸한 큰 산 중 하나.",
      ja: "麟蹄の奥深く、原生林と冷たい渓谷の淵。韓国で最も人が入らない大きな山の一つ。",
      zh: "麟蹄深处的原始林与清凉溪潭，是韩国人迹最罕至的大山之一。",
    },
  },
  {
    ko: "민주지산", // 충북 영동
    hint: {
      en: "Three provinces meet at one summit here; winter dresses it in frost-flowers.",
      ko: "한 봉우리에서 세 개 도가 만나는 곳. 겨울엔 상고대가 뒤덮는다.",
      ja: "一つの頂で三つの道が出会う場所。冬は霧氷に覆われる。",
      zh: "三道交汇于一峰之巅，冬日满山雾凇。",
    },
  },
  {
    ko: "팔영산", // 전남 고흥
    hint: {
      en: "Eight rocky crowns above the southern archipelago — count the peaks as you cross.",
      ko: "남해 다도해 위로 솟은 여덟 개의 바위 봉우리 — 건너며 세어 보라.",
      ja: "南海の多島海の上にそびえる八つの岩峰 — 越えながら数えてみて。",
      zh: "南海多岛海之上的八座岩峰 — 边走边数。",
    },
  },
  {
    ko: "재약산", // 경남 밀양
    hint: {
      en: "A vast silver-grass plateau in the sky above Miryang, blazing in autumn.",
      ko: "밀양 하늘 위 드넓은 억새 고원 — 가을이면 은빛으로 타오른다.",
      ja: "密陽の空高くに広がるススキの高原 — 秋には銀色に燃える。",
      zh: "密阳高空之上辽阔的芒草高原 — 秋来银浪如焰。",
    },
  },
  {
    ko: "대야산", // 경북 문경
    hint: {
      en: "A granite spine on the Baekdu-daegan, guarding a heart-shaped emerald pool.",
      ko: "백두대간의 화강암 능선, 하트 모양 옥빛 소(沼)를 품은 산.",
      ja: "白頭大幹の花崗岩の稜線、ハート形のエメラルドの淵を抱く山。",
      zh: "白头大干上的花岗岩山脊，藏着一泓心形碧潭。",
    },
  },
  {
    ko: "응봉산", // 강원 삼척
    hint: {
      en: "End the trail soaking in a wild hot spring, deep in Samcheok's eastern valleys.",
      ko: "삼척 동쪽 깊은 계곡, 산행 끝에 만나는 노천 온천 원탕.",
      ja: "三陟東部の深い渓谷、山行の果てに湧く露天の温泉。",
      zh: "三陟东部深谷，登山尽头涌出的野溪温泉。",
    },
  },
];

export const HIDDEN_MOUNTAINS = new Set<string>(HIDDEN.map((h) => h.ko));
