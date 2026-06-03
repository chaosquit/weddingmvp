'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type Stage = 'landing' | 'auth' | 'editor';
type TemplateCategory = 'classic' | 'magazine';
type TemplateLayout =
  | 'arch'
  | 'classic'
  | 'letter'
  | 'glass'
  | 'poster'
  | 'film'
  | 'index'
  | 'masonry'
  | 'noir'
  | 'soft';
type BlockFilter = 'all' | 'basic' | 'active' | 'addable';
type GalleryMode = 'grid' | 'slide' | 'pinterest' | 'dayalbum';
type EditorStep = 'template' | 'blocks';

type Template = {
  id: string;
  name: string;
  category: TemplateCategory;
  kicker: string;
  description: string;
  source: string;
  photo: string;
  layout: TemplateLayout;
  accent: string;
  ink: string;
  paper: string;
  tag: string;
};

type InvitationBlock = {
  id: string;
  label: string;
  kind: 'basic' | 'extra';
  note: string;
};

type Draft = {
  title: string;
  groom: string;
  bride: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  greeting: string;
  shareTitle: string;
  music: string;
  ending: string;
};

const weddingPhotos = [
  '/wedding-samples/wedding-01.jpg',
  '/wedding-samples/wedding-02.jpg',
  '/wedding-samples/wedding-03.jpg',
  '/wedding-samples/wedding-04.jpg',
  '/wedding-samples/wedding-06.jpg',
  '/wedding-samples/wedding-07.jpg',
  '/wedding-samples/wedding-08.jpg',
  '/wedding-samples/wedding-09.jpg',
  '/wedding-samples/wedding-10.jpg',
  '/wedding-samples/wedding-11.jpg',
  '/wedding-samples/wedding-12.jpg',
  '/wedding-samples/wedding-13.jpg',
  '/wedding-samples/wedding-14.jpg',
  '/wedding-samples/wedding-17.jpg',
  '/wedding-samples/wedding-18.jpg',
];

const classicTemplates = [
  ['Bojagi Arch', '보자기식 아치 커버와 일정 중심 구성', 'Bojagi sample', 'arch', '#d8a7aa', '#1f1b1b', '#f8f0ee', '예식일'],
  ['Pearl Calendar', '캘린더와 예식 정보가 먼저 읽히는 클래식', 'Bojagi sample', 'classic', '#b89b72', '#202020', '#fffaf2', '캘린더'],
  ['Clean Paper', '종이 청첩장처럼 차분한 여백과 본문형 초대글', 'Bojagi sample', 'letter', '#7c8c78', '#1f241f', '#f7f7ef', '모시는 글'],
  ['Blush Letter', '핑크 베이스와 부드러운 카드형 섹션', 'To Our Guest flow', 'soft', '#e7a5b1', '#272022', '#fff5f6', '링크 공유'],
  ['Garden Formal', '야외 웨딩 사진에 어울리는 정갈한 정보형', 'Vivid Vows sample', 'arch', '#628d70', '#162017', '#f2f8ef', '장소'],
  ['Gold Venue', '예식장, 지도, 교통 안내가 또렷한 금박 무드', 'Bojagi sample', 'classic', '#b58a42', '#1d1b16', '#fbf6ea', '오시는 길'],
  ['Family Honor', '양가 혼주와 가족 안내를 품격 있게 배치', 'Bojagi sample', 'letter', '#9a5d4f', '#241918', '#fff7f2', '혼주 정보'],
  ['RSVP Simple', '참석 의사와 식사 여부를 가장 빠르게 처리', 'To Our Guest flow', 'classic', '#526a92', '#171a20', '#f4f7fb', '참석 의사'],
  ['Gift Quiet', '계좌 정보와 마음 전하기를 부담 없이 노출', 'Bojagi sample', 'soft', '#a56d5d', '#211817', '#fbf4ef', '계좌'],
  ['Guestbook Warm', '방명록과 축하 메시지를 따뜻하게 강조', 'Bojagi sample', 'masonry', '#c07861', '#201815', '#fff5ed', '방명록'],
  ['Video Cover', '대표 영상과 커버 이미지가 자연스럽게 이어지는 구성', 'Vivid Vows sample', 'film', '#8a7a54', '#1e1d17', '#f7f3e6', '비디오'],
  ['Day Album', '하루의 장면을 앨범처럼 넘기는 갤러리형', 'Bojagi sample', 'masonry', '#6f8f8f', '#162124', '#eef8f8', '데이앨범'],
  ['Notice Clear', '공지와 피로연 안내를 실용적으로 정리', 'To Our Guest flow', 'classic', '#6d6b88', '#191824', '#f3f2fb', '공지'],
  ['Flower Gift', '축하 화환과 선물받기 흐름을 자연스럽게 포함', 'Bojagi sample', 'soft', '#b67b86', '#221a1d', '#fff3f5', '화환'],
  ['Ending Poem', '엔딩 글귀와 마지막 사진 여운을 살린 마감', 'Vivid Vows sample', 'letter', '#7f715b', '#181612', '#f7f1e8', '엔딩'],
] as const;

const magazineTemplates = [
  ['Editorial Serif', '큰 세리프 타이포와 실제 웨딩 사진을 잡지 커버처럼', 'Pinterest magazine', 'index', '#111111', '#121212', '#f8f6ef', 'SERIF'],
  ['Glass Vow', '사진 위 유리 패널과 부드러운 딥 모션', 'Awwwards mood', 'glass', '#5d9c91', '#111b1a', '#eff8f5', 'GLASS'],
  ['Y2K Poster', '과감한 포스터 타이포와 컬러 대비', 'Pinterest magazine', 'poster', '#e63323', '#0f0f12', '#fff5df', 'POSTER'],
  ['Film Issue', '필름 그레인과 시퀀스형 앨범', 'CSSDA motion', 'film', '#b36a42', '#16120f', '#f7eee5', 'FILM'],
  ['Noir Invite', '블랙 배경과 스포트라이트 사진', 'Awwwards mood', 'noir', '#d8bd7b', '#f8f0db', '#121212', 'NOIR'],
  ['Mesh Couture', '미세한 메쉬 컬러와 하이패션 레이아웃', 'Awwwards mood', 'glass', '#d86b8f', '#151515', '#fff1f5', 'MESH'],
  ['Soft Neumorph', '부드러운 볼륨감의 앱 같은 초대장', 'CSSDA UI', 'soft', '#a97d67', '#201a17', '#f4eee8', 'SOFT'],
  ['Minimal Index', '색을 절제하고 정보 인덱스를 강조', 'Editorial minimal', 'index', '#414141', '#151515', '#f8f8f4', 'INDEX'],
  ['Tokyo Scrap', '사진 조각과 라벨이 겹치는 캐주얼 매거진', 'Pinterest magazine', 'masonry', '#3e79ff', '#121212', '#eef3ff', 'SCRAP'],
  ['Type Poster', '글자가 화면을 지배하는 친구 링크용 디자인', 'Pinterest magazine', 'poster', '#cf2424', '#111111', '#fff7e6', 'TYPE'],
  ['Artbook Garden', '잔잔한 웨딩 사진을 아트북처럼 배열', 'Vivid Vows mood', 'masonry', '#768d63', '#151a12', '#f2f6ec', 'ARTBOOK'],
  ['Motion Cover', '커버 사진에 은은한 줌과 레터링 애니메이션', 'CSSDA motion', 'glass', '#8b6fd8', '#161321', '#f5f1ff', 'MOTION'],
  ['Pinterest Board', '핀터레스트 무드보드형 갤러리', 'Pinterest magazine', 'masonry', '#d65f82', '#1b1518', '#fff2f7', 'BOARD'],
  ['High Flash', '플래시 사진과 굵은 산세리프 타이포', 'Awwwards mood', 'poster', '#f4c400', '#151515', '#fffceb', 'FLASH'],
  ['Quiet Luxury', '고급스러운 무채색, 작은 활자, 큰 사진', 'Editorial minimal', 'noir', '#b7a27b', '#f5efe1', '#151515', 'LUXE'],
] as const;

const templates: Template[] = [
  ...classicTemplates.map((item, index) => ({
    id: `classic-${index + 1}`,
    name: item[0],
    category: 'classic' as const,
    kicker: item[7],
    description: item[1],
    source: item[2],
    layout: item[3] as TemplateLayout,
    accent: item[4],
    ink: item[5],
    paper: item[6],
    photo: weddingPhotos[index],
    tag: '정통 모청',
  })),
  ...magazineTemplates.map((item, index) => ({
    id: `magazine-${index + 1}`,
    name: item[0],
    category: 'magazine' as const,
    kicker: item[7],
    description: item[1],
    source: item[2],
    layout: item[3] as TemplateLayout,
    accent: item[4],
    ink: item[5],
    paper: item[6],
    photo: weddingPhotos[(index + 4) % weddingPhotos.length],
    tag: '매거진 모청',
  })),
];

const blocks: InvitationBlock[] = [
  { id: 'cover', label: '커버 디자인', kind: 'basic', note: '대표 사진, 이름, 인트로 모션' },
  { id: 'share', label: '카톡 · 링크 공유 설정', kind: 'basic', note: '공유 썸네일, 문구, 도메인' },
  { id: 'datetime', label: '예식 일시', kind: 'basic', note: '날짜, 시간, 예식일 하이라이트' },
  { id: 'venue', label: '예식 장소', kind: 'basic', note: '홀 이름, 주소, 층수' },
  { id: 'couple', label: '신랑 · 신부 정보', kind: 'basic', note: '이름, 연락처, 관계 문구' },
  { id: 'parents', label: '양가 혼주 정보', kind: 'basic', note: '혼주명, 연락처, 가족 호칭' },
  { id: 'effects', label: '효과', kind: 'basic', note: '인트로, 레터링, 사진 모션' },
  { id: 'font', label: '폰트', kind: 'basic', note: '고딕, 세리프, 손글씨 조합' },
  { id: 'music', label: '배경음악', kind: 'basic', note: '자동재생 설정, 음원 선택' },
  { id: 'greeting', label: '모시는 글', kind: 'basic', note: '추천 문구와 직접 작성' },
  { id: 'highlight', label: '예식일 하이라이트', kind: 'extra', note: 'D-day, 날짜 포커스' },
  { id: 'calendar', label: '캘린더', kind: 'extra', note: '월간 달력, 날짜 강조' },
  { id: 'family', label: '양가 가족 안내', kind: 'extra', note: '가족별 안내 문구' },
  { id: 'gallery', label: '갤러리', kind: 'extra', note: '그리드, 슬라이드, 핀터레스트' },
  { id: 'directions', label: '오시는 길', kind: 'extra', note: '지도, 내비, 교통 안내' },
  { id: 'account', label: '계좌 정보', kind: 'extra', note: '그룹별 공개 범위' },
  { id: 'profile', label: '커플 프로필', kind: 'extra', note: '둘의 소개와 좋아하는 장면' },
  { id: 'timeline', label: '타임라인', kind: 'extra', note: '처음 만난 날부터 예식까지' },
  { id: 'video', label: '비디오', kind: 'extra', note: '세로 영상, 웨딩 무비' },
  { id: 'rsvp', label: '참석 의사', kind: 'extra', note: '참석, 식사, 동행 인원' },
  { id: 'guestbook', label: '방명록', kind: 'extra', note: '축하 메시지와 댓글' },
  { id: 'notice', label: '공지', kind: 'extra', note: '주차, 식사, 알러지 안내' },
  { id: 'middleImage', label: '중간 이미지', kind: 'extra', note: '섹션 사이 감성 컷' },
  { id: 'reception', label: '피로연 안내', kind: 'extra', note: '식사 장소와 시간' },
  { id: 'flower', label: '축하 화환 선물받기', kind: 'extra', note: '화환 링크와 안내' },
  { id: 'dayAlbum', label: '데이앨범', kind: 'extra', note: '하루의 장면을 앨범으로' },
  { id: 'special1', label: '스페셜 링크 1', kind: 'extra', note: '친구 전용 애프터파티' },
  { id: 'special2', label: '스페셜 링크 2', kind: 'extra', note: '가족 전용 상세 안내' },
  { id: 'ending', label: '엔딩 글귀', kind: 'extra', note: '마지막 문장과 공유 버튼' },
];

const initialEnabledBlocks = [
  'cover',
  'share',
  'datetime',
  'venue',
  'couple',
  'parents',
  'effects',
  'font',
  'music',
  'greeting',
  'calendar',
  'gallery',
  'directions',
  'account',
  'rsvp',
  'ending',
];

const filterLabels: Record<BlockFilter, string> = {
  all: '모두 보기',
  basic: '기본 블록',
  active: '사용 중 블록',
  addable: '추가 가능 블록',
};

const galleryLabels: Record<GalleryMode, string> = {
  grid: '그리드',
  slide: '슬라이드',
  pinterest: '핀터레스트',
  dayalbum: '데이앨범',
};

const links = [
  { label: '친구 링크', url: 'issue.link/seoyeon-doyun/friends', copy: '애프터파티, 갤러리, 방명록이 더 잘 보입니다.' },
  { label: '가족 링크', url: 'issue.link/seoyeon-doyun/family', copy: '혼주 정보, 주차, 계좌 안내를 자세히 노출합니다.' },
  { label: '일반 지인 링크', url: 'issue.link/seoyeon-doyun/guest', copy: '예식 일시와 장소, 참석 의사를 가장 먼저 보여줍니다.' },
];

const initialDraft: Draft = {
  title: 'The September Wedding Issue',
  groom: '김도윤',
  bride: '이서연',
  date: '2026.09.12 Saturday',
  time: '오후 2시 30분',
  venue: '그랜드 하얏트 서울 그랜드볼룸',
  address: '서울 용산구 소월로 322',
  greeting: '서로의 계절이 되어 같은 방향을 바라보려 합니다. 귀한 걸음으로 축복해 주세요.',
  shareTitle: '도윤과 서연의 결혼식에 초대합니다.',
  music: 'Beautiful Day - acoustic',
  ending: '함께해 주신 마음을 오래 기억하겠습니다.',
};

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing');
  const [editorStep, setEditorStep] = useState<EditorStep>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [showcaseTemplateId, setShowcaseTemplateId] = useState(templates[0].id);
  const [templateFilter, setTemplateFilter] = useState<'all' | TemplateCategory>('all');
  const [blockFilter, setBlockFilter] = useState<BlockFilter>('all');
  const [openBlockId, setOpenBlockId] = useState('cover');
  const [enabledBlockIds, setEnabledBlockIds] = useState(initialEnabledBlocks);
  const [draft, setDraft] = useState(initialDraft);
  const [galleryMode, setGalleryMode] = useState<GalleryMode>('pinterest');
  const [finalized, setFinalized] = useState(false);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId],
  );

  const showcaseTemplate = useMemo(
    () => templates.find((template) => template.id === showcaseTemplateId) ?? selectedTemplate,
    [selectedTemplate, showcaseTemplateId],
  );

  const visibleTemplates = useMemo(() => {
    if (templateFilter === 'all') {
      return templates;
    }
    return templates.filter((template) => template.category === templateFilter);
  }, [templateFilter]);

  const visibleBlocks = useMemo(() => {
    if (blockFilter === 'basic') {
      return blocks.filter((block) => block.kind === 'basic');
    }
    if (blockFilter === 'active') {
      return blocks.filter((block) => enabledBlockIds.includes(block.id));
    }
    if (blockFilter === 'addable') {
      return blocks.filter((block) => !enabledBlockIds.includes(block.id));
    }
    return blocks;
  }, [blockFilter, enabledBlockIds]);

  const activeBlock = blocks.find((block) => block.id === openBlockId) ?? blocks[0];

  const updateDraft = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const chooseTemplate = (template: Template) => {
    setSelectedTemplateId(template.id);
    setShowcaseTemplateId(template.id);
    setFinalized(false);
  };

  const startAuth = () => {
    setStage('auth');
    window.setTimeout(() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' }), 40);
  };

  const completeAuth = () => {
    setStage('editor');
    setEditorStep('template');
    window.setTimeout(() => document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth' }), 40);
  };

  const toggleBlock = (id: string) => {
    setEnabledBlockIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ));
    setOpenBlockId(id);
    setFinalized(false);
  };

  return (
    <main className="app-shell">
      {stage !== 'editor' && (
        <nav className="site-nav">
          <a className="brand" href="#top">Issue Invite</a>
          <div>
            <a href="#samples">샘플</a>
            <a href="#start">제작</a>
            <a href="#studio">에디터</a>
          </div>
          <button onClick={startAuth} type="button">나만의 시안 만들기</button>
        </nav>
      )}

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Premium mobile invitation studio</span>
          <h1>하객마다 다른 링크, 잡지처럼 완성되는 모바일 청첩장.</h1>
          <p>
            보자기카드식 필수 정보 구조와 To Our Guest식 실시간 에디터를 바탕으로,
            실제 웨딩 사진이 살아나는 30가지 초대장 쇼룸에서 시작합니다.
          </p>
          <div className="hero-actions">
            <a href="#samples">대표 샘플 보기</a>
            <button onClick={startAuth} type="button">나만의 시안 만들기</button>
          </div>
        </div>
        <div className="sample-river" aria-label="대표 샘플 슬라이더">
          <div className="river-track">
            {[...templates.slice(0, 10), ...templates.slice(0, 10)].map((template, index) => (
              <button
                className={`river-card layout-${template.layout}`}
                key={`${template.id}-${index}`}
                onClick={() => {
                  chooseTemplate(template);
                  document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  '--photo': `url(${template.photo})`,
                  '--accent': template.accent,
                  '--paper': template.paper,
                  '--ink': template.ink,
                } as CSSProperties}
                type="button"
              >
                <span>{template.tag}</span>
                <strong>{template.name}</strong>
                <small>{template.kicker}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sample-section" id="samples">
        <div className="section-heading">
          <span className="eyebrow">30 ready-made directions</span>
          <h2>완성된 샘플을 먼저 보고, 마음에 드는 방향에서 시작하세요.</h2>
          <p>정통 모바일 청첩장 15종과 잡지형 모바일 청첩장 15종을 실제 웨딩 사진으로 구성했습니다.</p>
        </div>

        <div className="sample-layout">
          <div className="template-tools">
            {(['all', 'classic', 'magazine'] as const).map((filter) => (
              <button
                className={templateFilter === filter ? 'is-active' : ''}
                key={filter}
                onClick={() => setTemplateFilter(filter)}
                type="button"
              >
                {filter === 'all' ? '전체 30종' : filter === 'classic' ? '정통 모청 15종' : '매거진 모청 15종'}
              </button>
            ))}
          </div>

          <div className="template-grid">
            {visibleTemplates.map((template) => (
              <button
                className={showcaseTemplateId === template.id ? 'template-card is-selected' : 'template-card'}
                key={template.id}
                onClick={() => chooseTemplate(template)}
                onMouseEnter={() => setShowcaseTemplateId(template.id)}
                style={{
                  '--photo': `url(${template.photo})`,
                  '--accent': template.accent,
                  '--paper': template.paper,
                  '--ink': template.ink,
                } as CSSProperties}
                type="button"
              >
                <span>{template.source}</span>
                <strong>{template.name}</strong>
                <small>{template.description}</small>
              </button>
            ))}
          </div>

          <aside className="sample-preview">
            <PhonePreview
              block={activeBlock}
              draft={draft}
              enabledBlockIds={enabledBlockIds}
              galleryMode={galleryMode}
              template={showcaseTemplate}
            />
            <div>
              <span>{showcaseTemplate.tag}</span>
              <h3>{showcaseTemplate.name}</h3>
              <p>{showcaseTemplate.description}</p>
              <button onClick={startAuth} type="button">이 디자인으로 시안 만들기</button>
            </div>
          </aside>
        </div>
      </section>

      <section className="start-section" id="start">
        <span className="eyebrow">Start your own issue</span>
        <h2>나만의 시안 만들기</h2>
        <p>
          템플릿을 고른 뒤 사진, 일정, 장소, 가족 정보, 갤러리, 참석 의사까지
          실제 모바일 청첩장에 필요한 요소를 순서대로 편집합니다.
        </p>
        <button onClick={startAuth} type="button">Google로 시작하기</button>
      </section>

      {stage === 'auth' && (
        <section className="auth-section" id="auth">
          <div className="oauth-panel">
            <span className="oauth-logo">G</span>
            <span className="eyebrow">Google OAuth</span>
            <h2>시안을 저장하고 에디터로 이동합니다.</h2>
            <p>선택한 템플릿, 입력 정보, 하객별 링크 설정을 계정에 저장합니다.</p>
            <div className="oauth-scopes">
              <span>프로필 확인</span>
              <span>시안 저장</span>
              <span>링크 발급 준비</span>
            </div>
            <button onClick={completeAuth} type="button">Google로 계속하기</button>
          </div>
        </section>
      )}

      {stage === 'editor' && (
        <section className="studio-section" id="studio">
          <div className="product-shell">
            <div className="benefit-strip">
              <span>이미지 초대장 6종 무료 혜택 마감까지</span>
              <b>16 : 33 : 24</b>
              <button type="button">무료 선물 받기</button>
            </div>
            <header className="editor-topbar">
              <strong>ISSUE INVITE</strong>
              <nav>
                <button type="button">모바일청첩장</button>
                <button type="button">청첩장 문구</button>
                <button type="button">다양한 혜택</button>
              </nav>
              <button className="dark" onClick={() => setFinalized(true)} type="button">최종 링크 발급</button>
            </header>

            <div className="editor-body">
              <aside className="editor-rail">
                <button className={editorStep === 'template' ? 'is-active' : ''} onClick={() => setEditorStep('template')} type="button">템플릿</button>
                <button className={editorStep === 'blocks' ? 'is-active' : ''} onClick={() => setEditorStep('blocks')} type="button">디자인</button>
                <button type="button">분석</button>
                <button type="button">설정</button>
                <button type="button">로그아웃</button>
              </aside>

              <section className="builder-panel">
                <span className="eyebrow">{editorStep === 'template' ? 'Template first' : 'Design editor'}</span>
                <h2>{editorStep === 'template' ? '다양한 템플릿부터 선택하세요.' : '블록별로 필요한 요소를 조정하세요.'}</h2>
                <p>{editorStep === 'template' ? '선택할 때마다 오른쪽 모바일 미리보기가 즉시 바뀝니다.' : '무제한 수정, 실시간 반영, 자동 저장 흐름을 기준으로 구성했습니다.'}</p>

                <div className="draft-url">
                  <span>issue.link/cards/seoyeon-doyun</span>
                  <button type="button">복사</button>
                  <b>저장됨</b>
                </div>

                {editorStep === 'template' ? (
                  <div className="editor-template-picker">
                    {templates.map((template) => (
                      <button
                        className={selectedTemplateId === template.id ? 'mini-template is-selected' : 'mini-template'}
                        key={template.id}
                        onClick={() => chooseTemplate(template)}
                        style={{
                          '--photo': `url(${template.photo})`,
                          '--accent': template.accent,
                        } as CSSProperties}
                        type="button"
                      >
                        <span>{template.category === 'classic' ? '정통' : '매거진'}</span>
                        <strong>{template.name}</strong>
                      </button>
                    ))}
                    <button className="continue-button" onClick={() => setEditorStep('blocks')} type="button">
                      이 템플릿으로 제작 시작
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="block-filter">
                      {(Object.keys(filterLabels) as BlockFilter[]).map((filter) => (
                        <button
                          className={blockFilter === filter ? 'is-active' : ''}
                          key={filter}
                          onClick={() => setBlockFilter(filter)}
                          type="button"
                        >
                          {filterLabels[filter]}
                        </button>
                      ))}
                    </div>

                    <div className="accordion-list">
                      {visibleBlocks.map((block) => {
                        const isEnabled = enabledBlockIds.includes(block.id);
                        const isOpen = openBlockId === block.id;

                        return (
                          <article className={isOpen ? 'block-card is-open' : 'block-card'} key={block.id}>
                            <button className="block-title" onClick={() => setOpenBlockId(block.id)} type="button">
                              <span>{block.kind === 'basic' ? '기본' : '추가'}</span>
                              <strong>{block.label}</strong>
                              <small>{isEnabled ? '사용 중' : '추가 가능'}</small>
                            </button>
                            {isOpen && (
                              <div className="block-content">
                                <p>{block.note}</p>
                                <BlockPanel
                                  block={block}
                                  draft={draft}
                                  galleryMode={galleryMode}
                                  setGalleryMode={setGalleryMode}
                                  updateDraft={updateDraft}
                                />
                                <button onClick={() => toggleBlock(block.id)} type="button">
                                  {isEnabled ? '이 블록 숨기기' : '이 블록 추가하기'}
                                </button>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>

              <aside className="phone-workbench">
                <PhonePreview
                  block={activeBlock}
                  draft={draft}
                  enabledBlockIds={enabledBlockIds}
                  galleryMode={galleryMode}
                  template={selectedTemplate}
                />
                <button className="floating-save" onClick={() => setFinalized(true)} type="button">최종 결정</button>
              </aside>
            </div>

            <section className={finalized ? 'final-links is-visible' : 'final-links'}>
              <span className="eyebrow">Issued links</span>
              <h2>최종 결정이 완료되었습니다.</h2>
              <p>하객 그룹별로 다른 정보가 보이는 링크를 발급했습니다.</p>
              <div>
                {links.map((link) => (
                  <article key={link.url}>
                    <span>{link.label}</span>
                    <strong>{link.url}</strong>
                    <p>{link.copy}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}

function BlockPanel({
  block,
  draft,
  galleryMode,
  setGalleryMode,
  updateDraft,
}: {
  block: InvitationBlock;
  draft: Draft;
  galleryMode: GalleryMode;
  setGalleryMode: (value: GalleryMode) => void;
  updateDraft: (key: keyof Draft, value: string) => void;
}) {
  if (block.id === 'cover') {
    return (
      <div className="panel-grid">
        <label>청첩장 제목<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} /></label>
        <label>신랑<input value={draft.groom} onChange={(event) => updateDraft('groom', event.target.value)} /></label>
        <label>신부<input value={draft.bride} onChange={(event) => updateDraft('bride', event.target.value)} /></label>
      </div>
    );
  }

  if (block.id === 'datetime') {
    return (
      <div className="panel-grid">
        <label>날짜<input value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} /></label>
        <label>시간<input value={draft.time} onChange={(event) => updateDraft('time', event.target.value)} /></label>
      </div>
    );
  }

  if (block.id === 'venue' || block.id === 'directions') {
    return (
      <div className="panel-grid">
        <label>예식 장소<input value={draft.venue} onChange={(event) => updateDraft('venue', event.target.value)} /></label>
        <label>주소<input value={draft.address} onChange={(event) => updateDraft('address', event.target.value)} /></label>
      </div>
    );
  }

  if (block.id === 'greeting' || block.id === 'ending') {
    return (
      <label className="wide-field">
        {block.id === 'greeting' ? '모시는 글' : '엔딩 글귀'}
        <textarea
          value={block.id === 'greeting' ? draft.greeting : draft.ending}
          onChange={(event) => updateDraft(block.id === 'greeting' ? 'greeting' : 'ending', event.target.value)}
        />
      </label>
    );
  }

  if (block.id === 'share') {
    return (
      <div className="panel-grid">
        <label>공유 제목<input value={draft.shareTitle} onChange={(event) => updateDraft('shareTitle', event.target.value)} /></label>
        <label>대표 링크<input defaultValue="issue.link/seoyeon-doyun" /></label>
      </div>
    );
  }

  if (block.id === 'music') {
    return (
      <label className="wide-field">배경음악<input value={draft.music} onChange={(event) => updateDraft('music', event.target.value)} /></label>
    );
  }

  if (block.id === 'gallery' || block.id === 'dayAlbum') {
    return (
      <div className="segmented">
        {(Object.keys(galleryLabels) as GalleryMode[]).map((mode) => (
          <button className={galleryMode === mode ? 'is-active' : ''} key={mode} onClick={() => setGalleryMode(mode)} type="button">
            {galleryLabels[mode]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="option-stack">
      <button type="button">상단에 강조</button>
      <button type="button">가족 링크에만 노출</button>
      <button type="button">친구 링크에는 접어두기</button>
    </div>
  );
}

function PhonePreview({
  block,
  draft,
  enabledBlockIds,
  galleryMode,
  template,
}: {
  block: InvitationBlock;
  draft: Draft;
  enabledBlockIds: string[];
  galleryMode: GalleryMode;
  template: Template;
}) {
  const galleryPhotos = weddingPhotos.slice(6, 12);

  return (
    <div
      className={`phone-preview layout-${template.layout}`}
      style={{
        '--photo': `url(${template.photo})`,
        '--accent': template.accent,
        '--paper': template.paper,
        '--ink': template.ink,
      } as CSSProperties}
    >
      <div className="phone-status">
        <span>{template.name}</span>
        <b>Preview</b>
      </div>
      <section className="phone-cover">
        <span>{template.kicker}</span>
        <h2>{draft.groom}<br />& {draft.bride}</h2>
        <p>{draft.title}</p>
      </section>

      <section className="phone-block-highlight">
        <span>Editing</span>
        <strong>{block.label}</strong>
        <p>{block.note}</p>
      </section>

      {enabledBlockIds.includes('greeting') && (
        <section className="phone-section">
          <span>Invitation</span>
          <p>{draft.greeting}</p>
        </section>
      )}

      {enabledBlockIds.includes('datetime') && (
        <section className="phone-section split">
          <div><span>Date</span><strong>{draft.date}</strong></div>
          <div><span>Time</span><strong>{draft.time}</strong></div>
        </section>
      )}

      {enabledBlockIds.includes('calendar') && (
        <section className="phone-calendar">
          {Array.from({ length: 35 }, (_, index) => (
            <span className={index === 18 ? 'is-day' : ''} key={index}>{index > 2 ? index - 2 : ''}</span>
          ))}
        </section>
      )}

      {enabledBlockIds.includes('gallery') && (
        <section className={`phone-gallery mode-${galleryMode}`}>
          {galleryPhotos.map((photo) => <i key={photo} style={{ backgroundImage: `url(${photo})` }} />)}
        </section>
      )}

      {enabledBlockIds.includes('venue') && (
        <section className="phone-section">
          <span>Venue</span>
          <strong>{draft.venue}</strong>
          <p>{draft.address}</p>
        </section>
      )}

      {enabledBlockIds.includes('rsvp') && (
        <section className="phone-rsvp">
          <button type="button">참석</button>
          <button type="button">불참석</button>
        </section>
      )}

      {enabledBlockIds.includes('ending') && (
        <section className="phone-ending">
          <p>{draft.ending}</p>
        </section>
      )}
    </div>
  );
}
