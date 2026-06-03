// 30 wedding invitation templates expressed as style presets.
// One renderer (InvitationRenderer) reads these tokens and draws a full,
// scrollable mobile invitation — so adding a template never needs new code.

export type TemplateCategory = "classic" | "magazine";

export type CoverLayout =
  | "centered"
  | "bottom"
  | "frame"
  | "split"
  | "arch"
  | "poster"
  | "editorial"
  | "overlay";

export type FontFamily = "serif" | "sans" | "display";

// CSS-driven cover motion concepts (see globals.css motion-* classes).
export type CoverMotion =
  | "zoom" // 잔잔한 켄번스 줌 (정통)
  | "reveal" // 타이틀 글자 라이즈 + 라인 드로잉
  | "parallax" // 사진 미세 부유 + 레이어 시차
  | "glow" // 빛 번짐 + 소프트 페이드 (시네마틱)
  | "grain" // 필름 그레인 플리커
  | "marquee" // 가로 흐르는 텍스트 띠 (매거진)
  | "glitch" // 타이포 글리치 (패션 매거진)
  | "still"; // 모션 없음

export interface TemplatePalette {
  ink: string;
  paper: string;
  accent: string;
  soft: string;
  line: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  tag: string;
  source: string;
  description: string;
  kicker: string;
  accentLabel: string;
  cover: CoverLayout;
  font: FontFamily;
  motion: CoverMotion;
  uppercase: boolean;
  grain: boolean;
  coverPhoto: string;
  palette: TemplatePalette;
}

const P = (name: string) => `/wedding-samples/${name}.jpg`;

// People-forward gallery order (covers + galleries use real human photos first).
export const weddingPhotos: string[] = [
  P("couple-05"),
  P("couple-06"),
  P("wedding-09"),
  P("couple-04"),
  P("wedding-13"),
  P("couple-09"),
  P("wedding-01"),
  P("couple-01"),
  P("wedding-11"),
  P("couple-11"),
  P("wedding-14"),
  P("couple-03"),
  P("wedding-07"),
  P("wedding-17"),
  P("couple-10"),
  P("wedding-10"),
  P("wedding-18"),
  P("wedding-02"),
];

// ── 정통 모바일 청첩장 15종 (vividvows 무드: 여백 · 세리프 · 절제) ──────────
const classic: Omit<Template, "id" | "category" | "tag">[] = [
  {
    name: "Pearl Arch", source: "Vivid Vows · Bojagi", cover: "arch", font: "serif", motion: "zoom",
    description: "아치형 사진 프레임과 진주빛 여백, 가장 사랑받는 정통 구성",
    kicker: "We're getting married", accentLabel: "ARCH", uppercase: false, grain: false,
    coverPhoto: P("wedding-01"),
    palette: { ink: "#2a2422", paper: "#f8f1ec", accent: "#c79a7d", soft: "#efe2d8", line: "rgba(42,36,34,.12)" },
  },
  {
    name: "Blush Letter", source: "Vivid Vows sample", cover: "frame", font: "serif", motion: "reveal",
    description: "핑크 베이스 카드 섹션과 부드러운 손편지 톤의 모시는 글",
    kicker: "Invitation", accentLabel: "LETTER", uppercase: false, grain: false,
    coverPhoto: P("couple-11"),
    palette: { ink: "#3a2a2d", paper: "#fdf3f4", accent: "#e3a0ad", soft: "#f8dfe3", line: "rgba(58,42,45,.12)" },
  },
  {
    name: "Garden Formal", source: "Vivid Vows sample", cover: "centered", font: "serif", motion: "zoom",
    description: "야외 가든 웨딩에 어울리는 정갈한 세이지 그린 정보형",
    kicker: "Save the date", accentLabel: "GARDEN", uppercase: false, grain: false,
    coverPhoto: P("couple-06"),
    palette: { ink: "#23291f", paper: "#f1f5ec", accent: "#7d9469", soft: "#e0e9d6", line: "rgba(35,41,31,.12)" },
  },
  {
    name: "Gold Venue", source: "Vivid Vows · Bojagi", cover: "bottom", font: "serif", motion: "glow",
    description: "금박 무드의 캘린더·지도·교통 안내가 또렷한 호텔 예식형",
    kicker: "The wedding day", accentLabel: "GOLD", uppercase: false, grain: false,
    coverPhoto: P("wedding-13"),
    palette: { ink: "#241f17", paper: "#fbf6ea", accent: "#bd9a4e", soft: "#efe4c8", line: "rgba(36,31,23,.14)" },
  },
  {
    name: "Clean Paper", source: "Vivid Vows sample", cover: "frame", font: "serif", motion: "reveal",
    description: "종이 청첩장처럼 차분한 여백과 세로 흐름의 본문형 초대글",
    kicker: "Our wedding", accentLabel: "PAPER", uppercase: false, grain: false,
    coverPhoto: P("wedding-09"),
    palette: { ink: "#22241f", paper: "#f7f7ef", accent: "#8a8c78", soft: "#e8e8de", line: "rgba(34,36,31,.12)" },
  },
  {
    name: "Family Honor", source: "Bojagi sample", cover: "centered", font: "serif", motion: "zoom",
    description: "양가 혼주와 가족 안내를 품격 있게 배치한 전통 톤",
    kicker: "With our families", accentLabel: "HONOR", uppercase: false, grain: false,
    coverPhoto: P("couple-01"),
    palette: { ink: "#2c1d1a", paper: "#fbf3ee", accent: "#a35d4c", soft: "#f0ddd5", line: "rgba(44,29,26,.13)" },
  },
  {
    name: "Calm Sage", source: "Vivid Vows sample", cover: "split", font: "sans", motion: "zoom",
    description: "톤다운된 세이지와 크림, 미니멀 라인의 차분한 안내",
    kicker: "Save the date", accentLabel: "SAGE", uppercase: true, grain: false,
    coverPhoto: P("couple-05"),
    palette: { ink: "#262a26", paper: "#f3f4ee", accent: "#6f8377", soft: "#e2e7df", line: "rgba(38,42,38,.12)" },
  },
  {
    name: "Blue Hour", source: "Vivid Vows sample", cover: "centered", font: "serif", motion: "glow",
    description: "푸른 시간의 무드, RSVP와 식사 안내를 빠르게 처리",
    kicker: "Invitation", accentLabel: "BLUE", uppercase: false, grain: false,
    coverPhoto: P("couple-04"),
    palette: { ink: "#1b212c", paper: "#f3f6fb", accent: "#5a7298", soft: "#dde6f2", line: "rgba(27,33,44,.12)" },
  },
  {
    name: "Warm Guestbook", source: "Bojagi sample", cover: "bottom", font: "serif", motion: "zoom",
    description: "방명록과 축하 메시지를 따뜻한 테라코타 톤으로 강조",
    kicker: "Leave a message", accentLabel: "WARM", uppercase: false, grain: false,
    coverPhoto: P("couple-09"),
    palette: { ink: "#2a1d18", paper: "#fcf3ec", accent: "#c2785a", soft: "#f3ddd0", line: "rgba(42,29,24,.13)" },
  },
  {
    name: "Day Album", source: "Bojagi sample", cover: "frame", font: "sans", motion: "reveal",
    description: "하루의 장면을 앨범처럼 넘기는 갤러리 중심 구성",
    kicker: "A day to remember", accentLabel: "ALBUM", uppercase: true, grain: false,
    coverPhoto: P("wedding-14"),
    palette: { ink: "#1e2426", paper: "#eef6f6", accent: "#5f8a8a", soft: "#d8eaea", line: "rgba(30,36,38,.12)" },
  },
  {
    name: "Mauve Gift", source: "To Our Guest flow", cover: "split", font: "serif", motion: "zoom",
    description: "계좌·마음 전하기를 부담 없이 노출하는 모브 핑크 톤",
    kicker: "Thank you", accentLabel: "GIFT", uppercase: false, grain: false,
    coverPhoto: P("couple-03"),
    palette: { ink: "#2c2329", paper: "#f9f1f5", accent: "#a87089", soft: "#eddbe5", line: "rgba(44,35,41,.12)" },
  },
  {
    name: "Linen Classic", source: "Vivid Vows sample", cover: "centered", font: "serif", motion: "reveal",
    description: "리넨 질감의 베이지와 세리프, 단정한 본문 위주 레이아웃",
    kicker: "Our wedding day", accentLabel: "LINEN", uppercase: false, grain: false,
    coverPhoto: P("wedding-11"),
    palette: { ink: "#28241d", paper: "#f6f1e7", accent: "#a98f6a", soft: "#ebe1cf", line: "rgba(40,36,29,.12)" },
  },
  {
    name: "Notice Clear", source: "To Our Guest flow", cover: "split", font: "sans", motion: "zoom",
    description: "공지와 피로연 안내를 실용적으로 정리한 라벤더 그레이",
    kicker: "Information", accentLabel: "NOTICE", uppercase: true, grain: false,
    coverPhoto: P("couple-02"),
    palette: { ink: "#23222b", paper: "#f4f3fa", accent: "#7a7898", soft: "#e3e1ef", line: "rgba(35,34,43,.12)" },
  },
  {
    name: "Flower Frame", source: "Vivid Vows sample", cover: "arch", font: "serif", motion: "zoom",
    description: "축하 화환과 선물받기 흐름을 자연스럽게 담은 로즈 톤",
    kicker: "With flowers", accentLabel: "FLORAL", uppercase: false, grain: false,
    coverPhoto: P("couple-06"),
    palette: { ink: "#2c1f23", paper: "#fdf2f4", accent: "#cf7e8c", soft: "#f5dde2", line: "rgba(44,31,35,.12)" },
  },
  {
    name: "Ending Poem", source: "Vivid Vows sample", cover: "bottom", font: "serif", motion: "glow",
    description: "엔딩 글귀와 마지막 사진의 여운을 살린 모카 톤 마감",
    kicker: "Thank you for being here", accentLabel: "POEM", uppercase: false, grain: false,
    coverPhoto: P("wedding-13"),
    palette: { ink: "#241d16", paper: "#f7f1e8", accent: "#8c7657", soft: "#e9ddca", line: "rgba(36,29,22,.13)" },
  },
];

// ── 매거진형 모바일 청첩장 15종 (패션 매거진 · pinterest 무드: 파격 타이포) ──
const magazine: Omit<Template, "id" | "category" | "tag">[] = [
  {
    name: "Editorial Serif", source: "Pinterest magazine", cover: "editorial", font: "display", motion: "reveal",
    description: "흑백 커버 위 거대한 세리프 타이포, 잡지 표지 그 자체",
    kicker: "The Wedding Issue", accentLabel: "SERIF", uppercase: true, grain: true,
    coverPhoto: P("couple-10"),
    palette: { ink: "#161310", paper: "#f4efe6", accent: "#b5482f", soft: "#e9ddcb", line: "rgba(22,19,16,.16)" },
  },
  {
    name: "Noir Invite", source: "Awwwards mood", cover: "overlay", font: "display", motion: "glow",
    description: "블랙 배경과 스포트라이트 사진, 골드 레터링의 시네마틱 무드",
    kicker: "Save the date", accentLabel: "NOIR", uppercase: true, grain: true,
    coverPhoto: P("couple-04"),
    palette: { ink: "#f3ecdd", paper: "#121110", accent: "#c8a85e", soft: "#1e1c19", line: "rgba(243,236,221,.16)" },
  },
  {
    name: "Y2K Poster", source: "Pinterest magazine", cover: "poster", font: "sans", motion: "glitch",
    description: "과감한 포스터 타이포와 강렬한 레드, 콜라주 라벨",
    kicker: "2026 / We do", accentLabel: "POSTER", uppercase: true, grain: true,
    coverPhoto: P("couple-05"),
    palette: { ink: "#16140f", paper: "#f5ede0", accent: "#e23b27", soft: "#e7dcc7", line: "rgba(22,20,15,.18)" },
  },
  {
    name: "Film Issue", source: "CSSDA motion", cover: "bottom", font: "display", motion: "grain",
    description: "필름 그레인과 시퀀스형 앨범, 따뜻한 아날로그 톤",
    kicker: "Roll 01 — Our story", accentLabel: "FILM", uppercase: true, grain: true,
    coverPhoto: P("wedding-13"),
    palette: { ink: "#1a140f", paper: "#f3e9dd", accent: "#b06a3e", soft: "#e6d5c2", line: "rgba(26,20,15,.16)" },
  },
  {
    name: "Glass Vow", source: "Awwwards mood", cover: "overlay", font: "sans", motion: "parallax",
    description: "사진 위 글래스 패널과 부드러운 딥 모션",
    kicker: "Our promise", accentLabel: "GLASS", uppercase: true, grain: false,
    coverPhoto: P("couple-06"),
    palette: { ink: "#0f1b1a", paper: "#eef7f4", accent: "#3f9c8c", soft: "#dcefe9", line: "rgba(15,27,26,.14)" },
  },
  {
    name: "Type Poster", source: "Pinterest magazine", cover: "poster", font: "sans", motion: "marquee",
    description: "글자가 화면을 지배하는 친구 링크용 강한 타이포",
    kicker: "Just married", accentLabel: "TYPE", uppercase: true, grain: true,
    coverPhoto: P("couple-09"),
    palette: { ink: "#141414", paper: "#fff4df", accent: "#cf2424", soft: "#f3e3c3", line: "rgba(20,20,20,.18)" },
  },
  {
    name: "Quiet Luxury", source: "Editorial minimal", cover: "editorial", font: "display", motion: "zoom",
    description: "고급스러운 무채색, 작은 활자, 큰 사진의 절제된 표지",
    kicker: "M & J", accentLabel: "LUXE", uppercase: true, grain: false,
    coverPhoto: P("wedding-09"),
    palette: { ink: "#1c1b18", paper: "#efece5", accent: "#9a8c72", soft: "#e1ddd2", line: "rgba(28,27,24,.14)" },
  },
  {
    name: "Mesh Couture", source: "Awwwards mood", cover: "split", font: "display", motion: "reveal",
    description: "미세한 메쉬 컬러와 하이패션 레이아웃의 로맨틱 핑크",
    kicker: "Haute wedding", accentLabel: "MESH", uppercase: true, grain: false,
    coverPhoto: P("couple-01"),
    palette: { ink: "#1f1418", paper: "#fdf0f5", accent: "#d8567f", soft: "#f6dbe6", line: "rgba(31,20,24,.14)" },
  },
  {
    name: "Tokyo Scrap", source: "Pinterest magazine", cover: "poster", font: "sans", motion: "glitch",
    description: "사진 조각과 라벨이 겹치는 캐주얼 스크랩 매거진",
    kicker: "Scrapbook / 2026", accentLabel: "SCRAP", uppercase: true, grain: true,
    coverPhoto: P("couple-02"),
    palette: { ink: "#121212", paper: "#eef2ff", accent: "#3257ff", soft: "#dde5ff", line: "rgba(18,18,18,.16)" },
  },
  {
    name: "Artbook Garden", source: "Vivid Vows mood", cover: "editorial", font: "display", motion: "parallax",
    description: "잔잔한 웨딩 사진을 아트북처럼 배열한 올리브 톤",
    kicker: "An art of two", accentLabel: "ARTBOOK", uppercase: true, grain: true,
    coverPhoto: P("wedding-14"),
    palette: { ink: "#17190f", paper: "#f1f3e8", accent: "#6f7f4a", soft: "#e2e6d1", line: "rgba(23,25,15,.16)" },
  },
  {
    name: "Motion Cover", source: "CSSDA motion", cover: "overlay", font: "display", motion: "parallax",
    description: "커버 사진에 은은한 줌과 레터링이 흐르는 라일락 무드",
    kicker: "In motion", accentLabel: "MOTION", uppercase: true, grain: false,
    coverPhoto: P("couple-09"),
    palette: { ink: "#16121f", paper: "#f4f1ff", accent: "#8b6fd8", soft: "#e6defb", line: "rgba(22,18,31,.14)" },
  },
  {
    name: "High Flash", source: "Awwwards mood", cover: "poster", font: "sans", motion: "glitch",
    description: "플래시 사진과 굵은 산세리프, 클럽 무드의 옐로 포인트",
    kicker: "Tonight we wed", accentLabel: "FLASH", uppercase: true, grain: true,
    coverPhoto: P("couple-02"),
    palette: { ink: "#141414", paper: "#fffbe9", accent: "#e8b400", soft: "#f4ecc3", line: "rgba(20,20,20,.18)" },
  },
  {
    name: "Pinterest Board", source: "Pinterest magazine", cover: "split", font: "sans", motion: "grain",
    description: "핀터레스트 무드보드형 갤러리가 주인공인 로즈 매거진",
    kicker: "Mood / Wedding", accentLabel: "BOARD", uppercase: true, grain: true,
    coverPhoto: P("couple-11"),
    palette: { ink: "#1b1518", paper: "#fff2f7", accent: "#d65f82", soft: "#f6dde7", line: "rgba(27,21,24,.14)" },
  },
  {
    name: "Minimal Index", source: "Editorial minimal", cover: "editorial", font: "sans", motion: "still",
    description: "색을 절제하고 정보 인덱스를 강조한 모노톤 표지",
    kicker: "Index — 01 to 09", accentLabel: "INDEX", uppercase: true, grain: false,
    coverPhoto: P("wedding-09"),
    palette: { ink: "#161616", paper: "#f6f6f3", accent: "#3a3a3a", soft: "#e6e6e1", line: "rgba(22,22,22,.16)" },
  },
  {
    name: "Velvet Night", source: "Awwwards mood", cover: "overlay", font: "display", motion: "glow",
    description: "딥 버건디 배경과 실버 세리프, 늦은 저녁 예식의 무드",
    kicker: "An evening affair", accentLabel: "VELVET", uppercase: true, grain: true,
    coverPhoto: P("couple-04"),
    palette: { ink: "#f1e4e4", paper: "#2a1216", accent: "#d98b8b", soft: "#3a1c20", line: "rgba(241,228,228,.16)" },
  },
];

export const templates: Template[] = [
  ...classic.map((t, i) => ({
    ...t,
    id: `classic-${String(i + 1).padStart(2, "0")}`,
    category: "classic" as const,
    tag: "정통 모청",
  })),
  ...magazine.map((t, i) => ({
    ...t,
    id: `magazine-${String(i + 1).padStart(2, "0")}`,
    category: "magazine" as const,
    tag: "매거진 모청",
  })),
];

export const getTemplate = (id: string): Template =>
  templates.find((t) => t.id === id) ?? templates[0];

// ── 색감 조합 프리셋 (에디터에서 템플릿 위에 덧입히는 팔레트) ────────────────
export interface PalettePreset {
  id: string;
  name: string;
  swatch: string;
  palette: Partial<TemplatePalette>;
}

export const palettePresets: PalettePreset[] = [
  { id: "template", name: "템플릿 기본", swatch: "linear-gradient(135deg,#c79a7d,#7d9469,#5a7298)", palette: {} },
  { id: "ivory-rose", name: "아이보리 로즈", swatch: "#c98b9b", palette: { accent: "#c98b9b", soft: "#f6e4e8", paper: "#fcf5f3", ink: "#332428" } },
  { id: "sage", name: "세이지 그린", swatch: "#7d9469", palette: { accent: "#7d9469", soft: "#e3ebda", paper: "#f3f6ee", ink: "#26301f" } },
  { id: "champagne", name: "샴페인 골드", swatch: "#bd9a4e", palette: { accent: "#bd9a4e", soft: "#efe3c6", paper: "#fbf6ea", ink: "#2a2114" } },
  { id: "dusty-blue", name: "더스티 블루", swatch: "#5a7298", palette: { accent: "#5a7298", soft: "#dce4f1", paper: "#f4f7fb", ink: "#1c2531" } },
  { id: "terracotta", name: "테라코타", swatch: "#c2785a", palette: { accent: "#c2785a", soft: "#f1ddd0", paper: "#fcf4ee", ink: "#2c1c14" } },
  { id: "mono", name: "모노 잉크", swatch: "#2b2b2b", palette: { accent: "#2b2b2b", soft: "#e6e6e2", paper: "#f6f6f3", ink: "#161616" } },
  { id: "noir", name: "느와르 다크", swatch: "#c8a85e", palette: { accent: "#c8a85e", soft: "#1e1c19", paper: "#121110", ink: "#f3ecdd" } },
];

export const getPalettePreset = (id: string): PalettePreset =>
  palettePresets.find((p) => p.id === id) ?? palettePresets[0];

export const coverMotions: { id: CoverMotion; name: string }[] = [
  { id: "zoom", name: "켄번스 줌" },
  { id: "reveal", name: "타이틀 라이즈" },
  { id: "parallax", name: "시차 부유" },
  { id: "glow", name: "빛 번짐" },
  { id: "grain", name: "필름 그레인" },
  { id: "marquee", name: "흐르는 텍스트" },
  { id: "glitch", name: "타이포 글리치" },
  { id: "still", name: "모션 없음" },
];
