import { weddingPhotos } from "./templates";

export interface Person {
  name: string;
  phone: string;
  father: string;
  mother: string;
  relation: string; // 장남, 차녀 ...
  bank: string;
  account: string;
}

export interface TimelineItem {
  date: string;
  title: string;
  body: string;
}

export interface InvitationData {
  cover: {
    kicker: string; // 영문 라벨 (템플릿 기본값을 덮어씀, 비우면 템플릿값)
    title: string; // 잡지 제목
    groom: string;
    bride: string;
  };
  couple: {
    groom: Person;
    bride: Person;
  };
  date: string; // ISO
  dateLabel: string; // 화면용 (예: 2026년 9월 12일 토요일 오후 2시 30분)
  venue: {
    name: string;
    hall: string;
    address: string;
    transport: { subway?: string; bus?: string; parking?: string };
  };
  greeting: {
    title: string;
    content: string;
  };
  ending: string;
  music: string;
  timeline: TimelineItem[];
  gallery: string[];
  notice: string[];
}

export const mockInvitationData: InvitationData = {
  cover: {
    kicker: "",
    title: "The September Wedding Issue",
    groom: "김도윤",
    bride: "이서연",
  },
  couple: {
    groom: {
      name: "김도윤",
      phone: "010-1234-5678",
      father: "김영수",
      mother: "박미정",
      relation: "장남",
      bank: "우리은행",
      account: "1002-123-456789",
    },
    bride: {
      name: "이서연",
      phone: "010-8765-4321",
      father: "이진호",
      mother: "최수연",
      relation: "차녀",
      bank: "신한은행",
      account: "110-987-654321",
    },
  },
  date: "2026-09-12T14:30:00",
  dateLabel: "2026년 9월 12일 토요일 오후 2시 30분",
  venue: {
    name: "그랜드 하얏트 서울",
    hall: "그랜드볼룸 (1층)",
    address: "서울 용산구 소월로 322",
    transport: {
      subway: "6호선 한강진역 2번 출구 도보 7분",
      bus: "장충체육관·한남동 정류장 하차",
      parking: "호텔 내 주차장 3시간 무료",
    },
  },
  greeting: {
    title: "모시는 글",
    content:
      "서로의 계절이 되어\n같은 방향을 바라보기로 했습니다.\n\n오랜 시간 곁을 지켜주신 분들과\n저희의 첫 페이지를 함께 펼치고 싶습니다.\n귀한 걸음으로 축복해 주세요.",
  },
  ending: "함께해 주신 그 마음, 오래도록 기억하겠습니다.",
  music: "Beautiful Day — acoustic ver.",
  timeline: [
    { date: "2019.04", title: "처음 만난 날", body: "친구의 소개로 봄의 한가운데에서." },
    { date: "2021.12", title: "함께한 첫 여행", body: "눈 내리는 도시를 함께 걸으며." },
    { date: "2025.05", title: "프러포즈", body: "노을이 가장 붉던 저녁, 약속했습니다." },
    { date: "2026.09", title: "결혼식", body: "이제 같은 이름으로 시작합니다." },
  ],
  gallery: [
    weddingPhotos[2],
    weddingPhotos[4],
    weddingPhotos[9],
    weddingPhotos[10],
    weddingPhotos[12],
    weddingPhotos[13],
    weddingPhotos[0],
    weddingPhotos[7],
    weddingPhotos[11],
  ],
  notice: [
    "화환은 정중히 사양합니다. 보내주시는 마음만 감사히 받겠습니다.",
    "예식 후 같은 층 연회장에서 식사가 준비되어 있습니다.",
    "주차 등록은 안내 데스크에서 도와드립니다.",
  ],
};
