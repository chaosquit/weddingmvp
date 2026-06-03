import { weddingPhotos, weddingVideos } from "./templates";

export interface Person {
  name: string;
  phone: string;
  father: string;
  mother: string;
  relation: string;
  bank: string;
  account: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  caption?: string;
  fit?: "cover" | "contain";
  focusX?: number;
  focusY?: number;
  scale?: number;
  rotate?: number;
  effect?: "cinematic" | "kenburns" | "handheld" | "shutter" | "still";
}

export interface TimelineItem {
  date: string;
  title: string;
  body: string;
  mediaId?: string;
}

export interface InvitationData {
  cover: {
    kicker: string;
    title: string;
    groom: string;
    bride: string;
    media?: MediaItem;
  };
  couple: {
    groom: Person;
    bride: Person;
  };
  date: string;
  dateLabel: string;
  venue: {
    name: string;
    hall: string;
    address: string;
    transport: {
      subway?: string;
      bus?: string;
      parking?: string;
    };
  };
  greeting: {
    title: string;
    content: string;
  };
  ending: string;
  music: string;
  timeline: TimelineItem[];
  gallery: MediaItem[];
  notice: string[];
}

const image = (src: string, id: string, alt = "웨딩 사진", caption = ""): MediaItem => ({
  id,
  type: "image",
  src,
  alt,
  caption,
  focusX: 50,
  focusY: 50,
  scale: 1,
  rotate: 0,
  effect: "cinematic",
});

const video = (src: string, id: string, alt = "웨딩 영상", caption = ""): MediaItem => ({
  id,
  type: "video",
  src,
  alt,
  caption,
  focusX: 50,
  focusY: 50,
  scale: 1,
  rotate: 0,
  effect: "still",
});

export const mockInvitationData: InvitationData = {
  cover: {
    kicker: "Wedding Invitation",
    title: "A quiet promise, beautifully shared",
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
      mother: "최수민",
      relation: "차녀",
      bank: "신한은행",
      account: "110-987-654321",
    },
  },
  date: "2026-09-12T14:30",
  dateLabel: "2026년 9월 12일 토요일 오후 2시 30분",
  venue: {
    name: "그랜드 하얏트 서울",
    hall: "그랜드볼룸 1층",
    address: "서울 용산구 소월로 322",
    transport: {
      subway: "6호선 녹사평역 2번 출구 도보 7분",
      bus: "하얏트호텔 정류장 하차",
      parking: "호텔 내 주차 3시간 무료",
    },
  },
  greeting: {
    title: "소중한 분들을 초대합니다",
    content:
      "서로의 계절을 지나 같은 방향을 바라보게 되었습니다.\n\n오랜 시간 곁을 지켜주신 분들과 함께 첫 걸음을 나누고 싶습니다. 바쁘시더라도 오셔서 따뜻한 축복으로 자리를 빛내 주세요.",
  },
  ending: "함께해 주신 마음 오래도록 소중히 간직하겠습니다.",
  music: "Beautiful Day - acoustic ver.",
  timeline: [
    {
      date: "2019.04",
      title: "처음 만난 날",
      body: "친구의 소개로 봄 저녁의 작은 카페에서 만났습니다.",
    },
    {
      date: "2021.12",
      title: "첫 여행",
      body: "낯선 도시를 함께 걸으며 서로의 속도를 배웠습니다.",
    },
    {
      date: "2025.05",
      title: "프로포즈",
      body: "가장 평범한 하루를 가장 특별한 기억으로 남겼습니다.",
    },
    {
      date: "2026.09",
      title: "결혼식",
      body: "이제 같은 이름으로 새로운 계절을 시작합니다.",
    },
  ],
  gallery: [
    image(weddingPhotos[0], "gallery-1", "editorial beach veil", "바람이 만드는 첫 장면"),
    image(weddingPhotos[1], "gallery-2", "손을 잡고 걷는 커플", "함께 걷는 오후"),
    image(weddingPhotos[3], "gallery-3", "야외 웨딩 촬영", "계절을 닮은 스냅"),
    image(weddingPhotos[5], "gallery-4", "따뜻한 웨딩 사진", "따뜻한 표정"),
    image(weddingPhotos[6], "gallery-5", "축하 속 커플", "축하 속의 우리"),
    image(weddingPhotos[2], "gallery-6", "호숫가 커플 사진", "빛이 좋은 순간"),
    image(weddingPhotos[8], "gallery-7", "부케를 든 신부", "부케와 드레스"),
    image(weddingPhotos[9], "gallery-8", "신부 단독 사진", "고요한 포트레이트"),
    image(weddingPhotos[12], "gallery-9", "손을 맞잡은 사진", "서로의 손"),
    image(weddingPhotos[15], "gallery-10", "흑백 커플 사진", "흑백의 약속"),
    video(weddingVideos[0], "gallery-video-1", "just married motion", "움직이는 초대 커버"),
  ],
  notice: [
    "화환은 정중히 사양합니다. 보내주시는 마음만 감사히 받겠습니다.",
    "예식 후 같은 층 연회장에서 식사가 준비되어 있습니다.",
    "주차 등록은 안내 데스크에서 도와드립니다.",
  ],
};
