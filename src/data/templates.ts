// Concept-driven invitation templates. No more "classic / magazine" split —
// every design is its own editorial concept (newspaper, comic, vogue, film …),
// each rendered by a bespoke hero + a shared themed body in InvitationRenderer.

export type Concept =
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
  | "riso";

export interface Template {
  id: string;
  concept: Concept;
  name: string;
  blurb: string;
  family: "editorial" | "fashion"; // grouping label only (not a hard filter)
  coverPhoto: string;
}

const P = (name: string) => `/wedding-samples/${name}.jpg`;

// People-forward photo pool (covers + galleries use real human photos).
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

export const templates: Template[] = [
  { id: "newspaper", concept: "newspaper", name: "신문 스크랩", family: "editorial", blurb: "기사형 타이포 · 테이프 · 스탬프로 박제한 결혼 특보", coverPhoto: P("couple-10") },
  { id: "mosaic", concept: "mosaic", name: "모자이크 그리드", family: "editorial", blurb: "사진 조각이 모여 하나의 장면이 되는 블록 구조", coverPhoto: P("couple-05") },
  { id: "comic", concept: "comic", name: "컷만화 스토리", family: "fashion", blurb: "패널 · 말풍선 · 효과음으로 푸는 다음 컷 감성", coverPhoto: P("couple-09") },
  { id: "vogue", concept: "vogue", name: "보그 커버", family: "fashion", blurb: "잡지 커버와 커버라인으로 완성하는 하이패션 표지", coverPhoto: P("couple-04") },
  { id: "film", concept: "film", name: "필름 컨택트시트", family: "fashion", blurb: "영화 스틸컷과 다크 룩의 시네마틱 청첩장", coverPhoto: P("wedding-13") },
  { id: "museum", concept: "museum", name: "뮤지엄 포스터", family: "editorial", blurb: "전시 라벨과 고급스러운 여백의 아트 초대장", coverPhoto: P("couple-06") },
  { id: "boarding", concept: "boarding", name: "보딩패스 티켓", family: "editorial", blurb: "탑승권 구조로 떠나는 부부행 초대장", coverPhoto: P("wedding-09") },
  { id: "letter", concept: "letter", name: "레터프레스 카드", family: "editorial", blurb: "압인 카드의 차분한 클래식 무드", coverPhoto: P("couple-11") },
  { id: "archive", concept: "archive", name: "아카이브 폴더", family: "editorial", blurb: "폴더 UI와 파일 아이콘으로 여는 기억 보관함", coverPhoto: P("wedding-14") },
  { id: "botanical", concept: "botanical", name: "보태니컬 매거진", family: "editorial", blurb: "식물원 무드의 내추럴 화보 초대장", coverPhoto: P("couple-06") },
  { id: "poster", concept: "poster", name: "스트리트 포스터", family: "fashion", blurb: "거대한 타이포와 레드 슬래시, 패션 포스터 그 자체", coverPhoto: P("couple-05") },
  { id: "collage", concept: "collage", name: "Y2K 콜라주", family: "fashion", blurb: "오려붙인 컷 · 스티커 · 마커로 꾸민 스크랩북", coverPhoto: P("couple-02") },
  { id: "riso", concept: "riso", name: "리소 듀오톤", family: "fashion", blurb: "리소그래프 듀오톤 인쇄와 그레인의 인디 무드", coverPhoto: P("couple-01") },
];

export const getTemplate = (id: string): Template =>
  templates.find((t) => t.id === id) ?? templates[0];
