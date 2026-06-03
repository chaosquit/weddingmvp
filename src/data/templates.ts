export type Concept =
  | "lumiere"
  | "serene"
  | "botanica"
  | "atelier"
  | "nocturne"
  | "vellum"
  | "newspaper"
  | "mosaic"
  | "comic"
  | "vogue"
  | "film"
  | "museum"
  | "boarding"
  | "letter"
  | "archive"
  | "botanical"
  | "poster"
  | "collage"
  | "riso"
  | "sportychic"
  | "sonic"
  | "street";

export interface Template {
  id: string;
  concept: Concept;
  name: string;
  blurb: string;
  mood: string;
  coverPhoto: string;
  coverVideo?: string;
  accent: string;
  paper: string;
  ink: string;
}

const P = (name: string) => `/wedding-samples/${name}.jpg`;
const V = (name: string) => `/wedding-samples/${name}.mp4`;
const I = (name: string) => `/inspiration/pinterest/${name}.jpg`;

export const weddingPhotos: string[] = [
  P("editorial-beach-veil"),
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

export const weddingVideos: string[] = [V("motion-just-married")];

export const templates: Template[] = [
  {
    id: "vogue",
    concept: "vogue",
    name: "Vows Cover",
    blurb: "보그식 커버라인, 큰 로고, 사진 위 잡지 표지 같은 하이패션 청첩장.",
    mood: "패션 매거진 커버",
    coverPhoto: P("couple-04"),
    accent: "#8d2e2f",
    paper: "#efede8",
    ink: "#141310",
  },
  {
    id: "poster",
    concept: "poster",
    name: "Street Poster",
    blurb: "거대한 타이포와 포스터 레이어를 청첩장 첫 화면으로 번역한 대담한 디자인.",
    mood: "스트리트 패션 포스터",
    coverPhoto: P("couple-05"),
    accent: "#c6322f",
    paper: "#f1eee7",
    ink: "#151515",
  },
  {
    id: "collage",
    concept: "collage",
    name: "Soft Scrapbook",
    blurb: "오려 붙인 듯한 컷과 스티커 감성은 살리고, 각진 테두리는 부드럽게 정리한 콜라주.",
    mood: "몽타주 스크랩북",
    coverPhoto: P("couple-02"),
    accent: "#d94a58",
    paper: "#f4eadf",
    ink: "#1c1715",
  },
  {
    id: "film",
    concept: "film",
    name: "Film Contact",
    blurb: "시네마틱 스틸컷, 필름 스트립, 저녁 예식에 어울리는 어두운 화보형 청첩장.",
    mood: "영화 스틸컷",
    coverPhoto: P("wedding-13"),
    accent: "#c4a46b",
    paper: "#161513",
    ink: "#f6efe2",
  },
  {
    id: "motion-film",
    concept: "film",
    name: "Motion Film Invite",
    blurb: "무료 공개 웨딩 영상으로 시작하는 초대영상형 커버. 사진만 올려도 필름 모션처럼 이어지는 구성을 염두에 둔 시안.",
    mood: "초대영상 필름 커버",
    coverPhoto: P("editorial-beach-veil"),
    coverVideo: V("motion-just-married"),
    accent: "#c4a46b",
    paper: "#161513",
    ink: "#f6efe2",
  },
  {
    id: "sportychic",
    concept: "sportychic",
    name: "Sporty Chic",
    blurb: "핀터레스트 스포츠 포스터처럼 큰 글자와 역동적인 사진 배치가 있는 청첩장.",
    mood: "스포티 에디토리얼",
    coverPhoto: I("sportychic"),
    accent: "#7aa7dc",
    paper: "#f3f4f1",
    ink: "#151515",
  },
  {
    id: "runway-sporty",
    concept: "sportychic",
    name: "Runway Sport",
    blurb: "사진 한 장을 런웨이 편집컷처럼 밀어붙이는 스포티 에디토리얼 변형.",
    mood: "런웨이 포토 에디토리얼",
    coverPhoto: P("editorial-beach-veil"),
    accent: "#7aa7dc",
    paper: "#f3f4f1",
    ink: "#151515",
  },
  {
    id: "sonic",
    concept: "sonic",
    name: "Sonic Poster",
    blurb: "사운드 전시 포스터에서 가져온 반복 타이포와 리듬감 있는 청첩장.",
    mood: "인터랙티브 사운드 포스터",
    coverPhoto: I("sonic"),
    accent: "#e5272d",
    paper: "#f7f7f0",
    ink: "#113bd6",
  },
  {
    id: "street",
    concept: "street",
    name: "Rebel Street",
    blurb: "찢어진 종이, 강한 레드, 스트리트 패션 무드를 웨딩용으로 낮춘 실험적 커버.",
    mood: "레벨 스트리트 매거진",
    coverPhoto: I("rebel"),
    accent: "#b62528",
    paper: "#151515",
    ink: "#f4eee8",
  },
  {
    id: "rebel-film",
    concept: "street",
    name: "Rebel Film",
    blurb: "어두운 웨딩 스냅 위에 잡지식 타이포와 필름 노이즈를 얹는 레벨 스트리트 확장판.",
    mood: "필름 노이즈 스트리트",
    coverPhoto: I("street"),
    accent: "#d83a37",
    paper: "#151515",
    ink: "#f4eee8",
  },
  {
    id: "newspaper",
    concept: "newspaper",
    name: "Newspaper Scrap",
    blurb: "기사형 타이포와 종이 질감은 살리고 거친 네모 박스는 덜어낸 웨딩 특보.",
    mood: "웨딩 뉴스레터",
    coverPhoto: P("couple-10"),
    accent: "#9f735b",
    paper: "#f8f1e7",
    ink: "#1f1b15",
  },
  {
    id: "mosaic",
    concept: "mosaic",
    name: "Mosaic Grid",
    blurb: "사진 조각들이 하나의 흐름을 만드는 그래픽 그리드형 모바일 청첩장.",
    mood: "조각난 화보 그리드",
    coverPhoto: P("couple-05"),
    accent: "#566a7f",
    paper: "#f0eee8",
    ink: "#191a18",
  },
  {
    id: "comic",
    concept: "comic",
    name: "Next Cut",
    blurb: "컷만화의 패널과 말풍선을 둥글게 다듬어 다음 장면처럼 넘기는 청첩장.",
    mood: "로맨스 그래픽 노블",
    coverPhoto: P("couple-09"),
    accent: "#d84a3a",
    paper: "#fff4d8",
    ink: "#19140f",
  },
  {
    id: "museum",
    concept: "museum",
    name: "Museum Piece",
    blurb: "전시 포스터와 작품 라벨을 닮은 고급스럽고 조용한 초대장.",
    mood: "전시 라벨 초대장",
    coverPhoto: P("couple-06"),
    accent: "#b08a4a",
    paper: "#f7f3ea",
    ink: "#221f1a",
  },
  {
    id: "boarding",
    concept: "boarding",
    name: "Boarding Pass",
    blurb: "탑승권 구조를 부드러운 모바일 티켓으로 재해석한 여행 같은 결혼식 초대.",
    mood: "웨딩 보딩패스",
    coverPhoto: P("wedding-09"),
    accent: "#566f86",
    paper: "#eef1ef",
    ink: "#17212a",
  },
  {
    id: "archive",
    concept: "archive",
    name: "Wedding Archive",
    blurb: "폴더 UI와 파일 아이콘 감성을 둥근 카드형 아카이브로 정리한 기억 보관함.",
    mood: "디지털 아카이브",
    coverPhoto: P("wedding-14"),
    accent: "#3f8fc9",
    paper: "#f0f1ed",
    ink: "#1f2426",
  },
  {
    id: "botanical",
    concept: "botanical",
    name: "Botanical Magazine",
    blurb: "식물원 포스터와 웨딩 화보 사이의 내추럴 매거진형 청첩장.",
    mood: "보태니컬 화보",
    coverPhoto: P("couple-06"),
    accent: "#587260",
    paper: "#f4f1e8",
    ink: "#22241f",
  },
  {
    id: "riso",
    concept: "riso",
    name: "Riso Duotone",
    blurb: "리소 인쇄 질감과 듀오톤 색상으로 인디 포스터처럼 보이는 청첩장.",
    mood: "리소그래프 포스터",
    coverPhoto: P("couple-01"),
    accent: "#ef3b55",
    paper: "#efe7df",
    ink: "#252020",
  },
  {
    id: "lumiere",
    concept: "lumiere",
    name: "Lumiere Serif",
    blurb: "큰 여백, 얇은 선, 세리프 타이틀로 차분하게 완성되는 클래식 모던.",
    mood: "정제된 웨딩 매거진",
    coverPhoto: P("couple-05"),
    accent: "#9f735b",
    paper: "#fbf7ef",
    ink: "#231f1a",
  },
  {
    id: "serene",
    concept: "serene",
    name: "Serene Frame",
    blurb: "둥근 프레임과 부드러운 대비로 사진이 중심이 되는 미니멀 초대장.",
    mood: "포근한 갤러리",
    coverPhoto: P("couple-06"),
    accent: "#6f7b6b",
    paper: "#f7f5ee",
    ink: "#20241e",
  },
  {
    id: "botanica",
    concept: "botanica",
    name: "Botanica Calm",
    blurb: "식물성 색감과 얇은 라인 장식만 남긴 자연스러운 모던 세리프.",
    mood: "초록빛 정원",
    coverPhoto: P("wedding-09"),
    accent: "#587260",
    paper: "#f5f3ea",
    ink: "#22241f",
  },
  {
    id: "atelier",
    concept: "atelier",
    name: "Atelier Letter",
    blurb: "편지지 같은 흐름, 단아한 문장, 촬영본을 깊게 보여주는 레이아웃.",
    mood: "수공예 편지",
    coverPhoto: P("couple-11"),
    accent: "#9a6f6a",
    paper: "#fbf6f2",
    ink: "#251e1d",
  },
  {
    id: "letter",
    concept: "letter",
    name: "Letterpress Mark",
    blurb: "압인 카드와 이니셜 마크를 닮은 정중한 레터프레스 초대장.",
    mood: "압인 카드",
    coverPhoto: P("couple-11"),
    accent: "#8b734b",
    paper: "#fbf7ef",
    ink: "#231f1a",
  },
  {
    id: "nocturne",
    concept: "nocturne",
    name: "Nocturne",
    blurb: "어두운 배경에 따뜻한 금빛 포인트를 얹은 조용한 럭셔리.",
    mood: "저녁 예식",
    coverPhoto: P("wedding-13"),
    accent: "#c4a46b",
    paper: "#161513",
    ink: "#f6efe2",
  },
  {
    id: "vellum",
    concept: "vellum",
    name: "Vellum Soft",
    blurb: "반투명 카드와 낮은 채도, 모바일에서 특히 읽기 좋은 부드러운 구성.",
    mood: "소프트 모던",
    coverPhoto: P("couple-04"),
    accent: "#7d8ca3",
    paper: "#f3f5f4",
    ink: "#1f2328",
  },
];

export const getTemplate = (id: string): Template =>
  templates.find((template) => template.id === id) ?? templates[0];
