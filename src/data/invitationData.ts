export interface InvitationData {
  couple: {
    groom: {
      name: string;
      father: string;
      mother: string;
      relation: string;
      bank: string;
      account: string;
    };
    bride: {
      name: string;
      father: string;
      mother: string;
      relation: string;
      bank: string;
      account: string;
    };
  };
  date: string; // ISO String
  venue: {
    name: string;
    address: string;
    detail: string;
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
  gallery: string[];
}

export const mockInvitationData: InvitationData = {
  couple: {
    groom: {
      name: '김도윤',
      father: '김영수',
      mother: '박미정',
      relation: '장남',
      bank: '우리은행',
      account: '1002-123-456789',
    },
    bride: {
      name: '이서연',
      father: '이진호',
      mother: '최수연',
      relation: '차녀',
      bank: '신한은행',
      account: '110-987-654321',
    },
  },
  date: '2026-09-12T14:00:00',
  venue: {
    name: '그랜드 하얏트 서울',
    address: '서울 용산구 소월로 322',
    detail: '그랜드볼룸 (1층)',
    transport: {
      subway: '6호선 한강진역 2번 출구',
      parking: '호텔 내 주차장 무료 이용 (하객 3시간 무료)',
    },
  },
  greeting: {
    title: '초대합니다',
    content: '서로의 다름을 존중하고, 같은 곳을 바라보며 평생의 동반자가 되기로 약속했습니다.\n저희의 새로운 시작을 함께 축하해 주세요.',
  },
  gallery: [
    'https://images.unsplash.com/photo-1544078755-9bb50392f2b3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
  ],
};
