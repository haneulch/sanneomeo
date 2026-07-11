// 월별 "지금 이 산" 계절 이벤트.
// 실서비스에서는 TourAPI 축제·행사 데이터(TOUR_API_KEY)로 대체/보강.
export interface SeasonalPick {
  mountain: string; // MOUNTAINS의 en 키
  emoji: string;
  title: { en: string; ko: string; ja: string; zh: string };
  tag: { en: string; ko: string; ja: string; zh: string }; // "만개", "D-5" 등
}

export const SEASONAL: Record<number, SeasonalPick[]> = {
  3: [
    {
      mountain: "Seonunsan", emoji: "🌺",
      title: { en: "Camellia forest in full bloom", ko: "선운사 동백 만개", ja: "禅雲寺の椿が満開", zh: "禅云寺山茶花盛开" },
      tag: { en: "Peak bloom", ko: "만개", ja: "見頃", zh: "盛开" },
    },
    {
      mountain: "Duryunsan", emoji: "🌸",
      title: { en: "Early spring temple valley", ko: "대흥사 이른 봄 계곡", ja: "大興寺の早春の渓谷", zh: "大兴寺早春溪谷" },
      tag: { en: "Quiet season", ko: "한적", ja: "静か", zh: "清静" },
    },
  ],
  4: [
    {
      mountain: "Gyeryongsan", emoji: "🌸",
      title: { en: "Cherry blossom trail to Donghak-sa", ko: "동학사 벚꽃길", ja: "東鶴寺の桜道", zh: "东鹤寺樱花路" },
      tag: { en: "Peak bloom", ko: "절정", ja: "見頃", zh: "盛开" },
    },
    {
      mountain: "Palgongsan", emoji: "🌸",
      title: { en: "Palgongsan cherry blossoms", ko: "팔공산 벚꽃 터널", ja: "八公山の桜トンネル", zh: "八公山樱花隧道" },
      tag: { en: "This week", ko: "이번 주", ja: "今週", zh: "本周" },
    },
  ],
  5: [
    {
      mountain: "Gayasan", emoji: "🌺",
      title: { en: "Royal azalea ridges", ko: "가야산 철쭉 능선", ja: "伽倻山のツツジ稜線", zh: "伽倻山杜鹃山脊" },
      tag: { en: "Peak bloom", ko: "절정", ja: "見頃", zh: "盛开" },
    },
    {
      mountain: "Jirisan", emoji: "🌺",
      title: { en: "Barae-bong azalea sea", ko: "지리산 바래봉 철쭉", ja: "智異山バレボンのツツジ", zh: "智异山铁杜鹃花海" },
      tag: { en: "D-5", ko: "D-5", ja: "D-5", zh: "D-5" },
    },
  ],
  7: [
    {
      mountain: "Jirisan", emoji: "🌼",
      title: { en: "Daylily meadows on Nogodan", ko: "노고단 원추리 만개", ja: "老姑壇のワスレグサ満開", zh: "老姑坛萱草盛开" },
      tag: { en: "Peak bloom", ko: "만개", ja: "見頃", zh: "盛开" },
    },
    {
      mountain: "Odaesan", emoji: "🌲",
      title: { en: "Cool fir forest walk at Woljeong-sa", ko: "월정사 전나무숲 피서", ja: "月精寺モミの森で涼む", zh: "月精寺冷杉林避暑" },
      tag: { en: "Beat the heat", ko: "피서 명소", ja: "避暑", zh: "避暑" },
    },
    {
      mountain: "Chiaksan", emoji: "💧",
      title: { en: "Valley streams of Chiaksan", ko: "치악산 계곡 트레킹", ja: "雉岳山の渓谷トレッキング", zh: "雉岳山溪谷徒步" },
      tag: { en: "This week", ko: "이번 주", ja: "今週", zh: "本周" },
    },
  ],
  10: [
    {
      mountain: "Seoraksan", emoji: "🍁",
      title: { en: "First autumn foliage of Korea", ko: "설악산 첫 단풍", ja: "雪岳山の初紅葉", zh: "雪岳山初红叶" },
      tag: { en: "D-5", ko: "D-5", ja: "D-5", zh: "D-5" },
    },
    {
      mountain: "Odaesan", emoji: "🍁",
      title: { en: "Golden fir forest road", ko: "오대산 단풍 절정", ja: "五台山の紅葉見頃", zh: "五台山红叶最佳期" },
      tag: { en: "Peak color", ko: "절정", ja: "見頃", zh: "最佳" },
    },
  ],
  11: [
    {
      mountain: "Naejangsan", emoji: "🍁",
      title: { en: "Naejangsan maple tunnel at its peak", ko: "내장산 단풍 터널 절정", ja: "内蔵山の紅葉トンネル見頃", zh: "内藏山枫叶隧道最佳期" },
      tag: { en: "Peak color", ko: "절정", ja: "見頃", zh: "最佳" },
    },
    {
      mountain: "Baegamsan", emoji: "🍂",
      title: { en: "Baby maples of Baegyang-sa", ko: "백양사 애기단풍", ja: "白羊寺の小さな紅葉", zh: "白羊寺小枫叶" },
      tag: { en: "This week", ko: "이번 주", ja: "今週", zh: "本周" },
    },
  ],
};

export const SEASONAL_DEFAULT: SeasonalPick[] = [
  {
    mountain: "Hallasan", emoji: "⛰",
    title: { en: "Hallasan crater lake trek", ko: "한라산 백록담 트레킹", ja: "漢拏山・白鹿潭トレッキング", zh: "汉拿山白鹿潭徒步" },
    tag: { en: "Anytime", ko: "상시", ja: "通年", zh: "全年" },
  },
  {
    mountain: "Seonunsan", emoji: "🏯",
    title: { en: "Temple-stay at Seonun-sa", ko: "선운사 템플스테이", ja: "禅雲寺テンプルステイ", zh: "禅云寺寺院寄宿" },
    tag: { en: "Anytime", ko: "상시", ja: "通年", zh: "全年" },
  },
];
