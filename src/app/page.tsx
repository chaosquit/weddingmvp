'use client';

import { useEffect, useMemo, useState } from 'react';

type AudienceKey = 'friends' | 'family' | 'public';

type Template = {
  id: string;
  name: string;
  label: string;
  mood: string;
  className: string;
  accent: string;
  paper: string;
  ink: string;
  cover: string;
  motion: string;
};

type AudienceMode = {
  id: AudienceKey;
  label: string;
  tone: string;
  link: string;
  headline: string;
  greeting: string;
  primaryCta: string;
  hidden: string[];
};

const eventBlueprint = {
  platformName: 'Issue Invite',
  category: 'Mobile invitation platform',
  eventType: 'Wedding',
  eventTitle: 'The September Wedding Issue',
  hosts: ['김도윤', '이서연'],
  date: '2026.09.12 Sat',
  time: '2:00 PM',
  venue: '그랜드 하얏트 서울, 그랜드볼룸',
  address: '서울 용산구 소월로 322',
  editorNote:
    '흔한 세로형 청첩장이 아니라, 하객이 자신의 링크를 여는 순간 하나의 매거진 이슈를 받았다고 느끼게 만드는 초대장입니다.',
  modules: ['Cover', 'Story', 'Gallery', 'Calendar', 'Map', 'Gift', 'RSVP', 'Guestbook'],
  gallery: [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=900&auto=format&fit=crop',
  ],
};

const journey = [
  ['Landing', '서비스 가치와 실제 목업을 먼저 보여줍니다.'],
  ['Create', '이벤트 타입, 사진, 일정, 장소, 필수 모듈을 입력합니다.'],
  ['Audience', '친구, 가족, 일반 지인 링크별 문구와 정보량을 다르게 만듭니다.'],
  ['Preview', '5분 동안 전체 모바일 초대장을 확인합니다.'],
  ['Payment', '결제 후 커스텀 링크와 공유용 썸네일을 발급합니다.'],
] as const;

const audienceModes: AudienceMode[] = [
  {
    id: 'friends',
    label: '친구 링크',
    tone: 'Casual after-party tone',
    link: 'issue.link/doyun-seoyeon/friends',
    headline: 'Dress up, cry a little, dance a lot.',
    greeting:
      '우리 둘의 결혼식이기도 하지만, 결국 너희랑 웃고 떠드는 날이 될 것 같아. 예식 후 작은 애프터 모임 안내까지 이 링크에만 넣어둘게.',
    primaryCta: '참석하고 애프터 확인',
    hidden: ['혼주 상세 계좌', '격식형 인사말'],
  },
  {
    id: 'family',
    label: '가족 링크',
    tone: 'Formal family edition',
    link: 'issue.link/doyun-seoyeon/family',
    headline: '가족과 어른들께 정중히 전하는 초대',
    greeting:
      '두 사람이 한 가정을 이루는 자리에 귀한 걸음으로 함께해 주세요. 예식 순서, 주차, 혼주 연락처와 마음 전하실 곳을 보기 쉽게 정리했습니다.',
    primaryCta: '예식 정보 확인',
    hidden: ['애프터 파티', '친구용 농담 문구'],
  },
  {
    id: 'public',
    label: '지인 링크',
    tone: 'Clean information first',
    link: 'issue.link/doyun-seoyeon/guest',
    headline: '일정, 장소, 참석 여부가 바로 보이는 초대장',
    greeting:
      '바쁘신 가운데 시간을 내어 축하해 주시는 마음에 감사드립니다. 핵심 일정과 오시는 길, 참석 여부 확인을 가장 먼저 확인하실 수 있습니다.',
    primaryCta: '참석 여부 남기기',
    hidden: ['개인 사진 일부', '비공개 메시지'],
  },
];

const templates: Template[] = [
  {
    id: 'editorial-minimal',
    name: 'Editorial Minimal Serif',
    label: '01',
    mood: '인디자인 잡지 표지처럼 여백과 세리프가 주인공인 프리미엄 타입',
    className: 'template-editorial',
    accent: '#111111',
    paper: '#f7f0e6',
    ink: '#111111',
    cover: eventBlueprint.gallery[0],
    motion: 'slow title reveal',
  },
  {
    id: 'glass-issue',
    name: 'Glassmorphism Issue',
    label: '02',
    mood: '사진 위에 얇은 유리 정보 패널을 얹는 앱형 청첩장',
    className: 'template-glass',
    accent: '#2f6f73',
    paper: '#eef5f2',
    ink: '#12201e',
    cover: eventBlueprint.gallery[1],
    motion: 'floating glass panels',
  },
  {
    id: 'mesh-modern',
    name: 'Mesh Modern',
    label: '03',
    mood: '은은한 메쉬 컬러와 다크 UI를 결합한 쇼룸형 초대장',
    className: 'template-mesh',
    accent: '#f2c14e',
    paper: '#101214',
    ink: '#ffffff',
    cover: eventBlueprint.gallery[2],
    motion: 'animated gradient field',
  },
  {
    id: 'soft-ui',
    name: 'Neumorphism Soft UI',
    label: '04',
    mood: '부드러운 버튼, 깊은 그림자, 선명한 정보 모듈 중심',
    className: 'template-soft',
    accent: '#7b8c6f',
    paper: '#edf0ea',
    ink: '#273024',
    cover: eventBlueprint.gallery[0],
    motion: 'soft press micro-interactions',
  },
  {
    id: 'minima-system',
    name: 'Minima System',
    label: '05',
    mood: '거의 앱에 가까운 극미니멀 정보형 초대장',
    className: 'template-minima',
    accent: '#0f766e',
    paper: '#ffffff',
    ink: '#111827',
    cover: eventBlueprint.gallery[1],
    motion: 'quiet snap sections',
  },
  {
    id: 'bold-poster',
    name: 'Bold Typographic Poster',
    label: '06',
    mood: '포스터, 타이포그래피, 강한 컬러로 친구 링크에 어울리는 커버',
    className: 'template-bold',
    accent: '#d71920',
    paper: '#fff8ec',
    ink: '#071ad9',
    cover: '/inspiration/type-poster.jpg',
    motion: 'ticker and print jitter',
  },
  {
    id: 'film-photo',
    name: 'Film Photography',
    label: '07',
    mood: '필름 노트, 프레임 번호, 영화 크레딧 같은 시네마틱 구성',
    className: 'template-film',
    accent: '#c8a96a',
    paper: '#090909',
    ink: '#f8f2e8',
    cover: eventBlueprint.gallery[2],
    motion: 'grain and credits',
  },
  {
    id: 'street-collage',
    name: 'Y2K Street Collage',
    label: '08',
    mood: 'Pinterest 무드의 오프셋 사진, 스티커, 과감한 레이어',
    className: 'template-street',
    accent: '#ccff00',
    paper: '#f7f7f2',
    ink: '#101010',
    cover: '/inspiration/sporty-editorial.jpg',
    motion: 'sticker pop',
  },
  {
    id: 'hanji-calm',
    name: 'Korean Paper Calm',
    label: '09',
    mood: '어른들께 보내기 좋은 한지 질감과 차분한 동양적 여백',
    className: 'template-hanji',
    accent: '#946b45',
    paper: '#f4eee2',
    ink: '#32271d',
    cover: eventBlueprint.gallery[0],
    motion: 'paper fade',
  },
  {
    id: 'dark-luxury',
    name: 'Dark Luxury Issue',
    label: '10',
    mood: '블랙, 버건디, 금박 라벨을 쓰는 하이패션형 청첩장',
    className: 'template-luxury',
    accent: '#a83f39',
    paper: '#120d0e',
    ink: '#f9efe0',
    cover: '/inspiration/street-cover.jpg',
    motion: 'cover spotlight',
  },
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Home() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [selectedAudienceId, setSelectedAudienceId] = useState<AudienceKey>('friends');
  const [issued, setIssued] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId],
  );

  const selectedAudience = useMemo(
    () => audienceModes.find((audience) => audience.id === selectedAudienceId) ?? audienceModes[0],
    [selectedAudienceId],
  );

  useEffect(() => {
    if (issued || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [issued, secondsLeft]);

  return (
    <main className="platform-shell">
      <HeroSection />

      <section className="journey-section" id="flow" aria-labelledby="journey-title">
        <div className="section-heading">
          <span className="eyebrow">Product flow</span>
          <h2 id="journey-title">랜딩에서 발급까지, 한 번에 이해되는 제작 여정</h2>
        </div>
        <div className="journey-track">
          {journey.map(([title, description], index) => (
            <article className="journey-step" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="builder-section" id="create" aria-labelledby="builder-title">
        <div className="builder-copy">
          <span className="eyebrow">Creation lab</span>
          <h2 id="builder-title">웨딩으로 시작하지만, 모든 이벤트로 확장되는 빌더</h2>
          <p>
            청첩장 전용 템플릿 묶음이 아니라 이벤트 타입, 초대 대상, 정보 공개 범위를
            조합하는 구조입니다. 이후 돌잔치, 생일, 개업식, 전시, 세미나, 기업 행사도 같은
            흐름으로 확장할 수 있습니다.
          </p>
          <div className="event-type-row" aria-label="event categories">
            {['Wedding', 'Baby', 'Birthday', 'Opening', 'Exhibition', 'Seminar', 'Company'].map(
              (type) => (
                <button className={type === 'Wedding' ? 'is-active' : ''} key={type} type="button">
                  {type}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="builder-board">
          <div className="builder-panel">
            <div className="panel-topline">
              <span>01</span>
              <strong>Event brief</strong>
            </div>
            <label>
              이벤트명
              <input value={eventBlueprint.eventTitle} readOnly />
            </label>
            <label>
              호스트
              <input value={`${eventBlueprint.hosts[0]} & ${eventBlueprint.hosts[1]}`} readOnly />
            </label>
            <label>
              장소
              <input value={eventBlueprint.venue} readOnly />
            </label>
            <div className="module-cloud" aria-label="selected modules">
              {eventBlueprint.modules.map((module) => (
                <span key={module}>{module}</span>
              ))}
            </div>
          </div>

          <div className="builder-panel">
            <div className="panel-topline">
              <span>02</span>
              <strong>Audience links</strong>
            </div>
            <div className="audience-tabs" role="tablist" aria-label="guest group">
              {audienceModes.map((audience) => (
                <button
                  className={selectedAudienceId === audience.id ? 'is-active' : ''}
                  key={audience.id}
                  onClick={() => setSelectedAudienceId(audience.id)}
                  type="button"
                >
                  {audience.label}
                </button>
              ))}
            </div>
            <article className="audience-card">
              <span>{selectedAudience.tone}</span>
              <h3>{selectedAudience.headline}</h3>
              <p>{selectedAudience.greeting}</p>
              <div className="hidden-rule">
                <strong>숨김 처리</strong>
                {selectedAudience.hidden.join(' / ')}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="showroom-section" id="showroom" aria-labelledby="showroom-title">
        <div className="section-heading narrow">
          <span className="eyebrow">Design showroom</span>
          <h2 id="showroom-title">모바일 청첩장 목업 10종</h2>
          <p>
            Awwwards와 CSS Design Awards식의 강한 첫 화면, 큰 타이포, 목적 있는 모션을
            모바일 초대장 필수 모듈과 섞었습니다.
          </p>
        </div>

        <div className="showroom-grid">
          <aside className="template-picker" aria-label="template list">
            {templates.map((template) => (
              <button
                className={selectedTemplate.id === template.id ? 'template-option is-active' : 'template-option'}
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                type="button"
              >
                <span className="template-number">{template.label}</span>
                <span>
                  <strong>{template.name}</strong>
                  <small>{template.motion}</small>
                </span>
              </button>
            ))}
          </aside>

          <div className="phone-stage">
            <div className="preview-toolbar">
              <span>{selectedTemplate.name}</span>
              <strong>{issued ? 'Issued' : `Preview ${formatTime(secondsLeft)}`}</strong>
            </div>
            <PhonePreview audience={selectedAudience} issued={issued} template={selectedTemplate} />
          </div>

          <aside className="checkout-panel">
            <span className="eyebrow">5 minute preview</span>
            <h3>미리보기 후 결제하면 링크가 즉시 발급됩니다.</h3>
            <p>
              현재 시제품에서는 결제 완료 상태를 시뮬레이션합니다. 실제 서비스에서는 이 단계에
              PG 결제, 도메인 발급, 공유 썸네일 생성, 분석 태그가 연결됩니다.
            </p>
            <div className="receipt-box">
              <div>
                <span>Template</span>
                <strong>{selectedTemplate.name}</strong>
              </div>
              <div>
                <span>Audience</span>
                <strong>{selectedAudience.label}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{issued ? '링크 발급 완료' : '무료 프리뷰 중'}</strong>
              </div>
            </div>
            <button className="payment-button" onClick={() => setIssued(true)} type="button">
              결제하고 링크 발급
            </button>
            <div className={issued ? 'issued-links is-visible' : 'issued-links'}>
              {audienceModes.map((audience) => (
                <a href={`https://${audience.link}`} key={audience.id}>
                  {audience.label}
                  <span>{audience.link}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="snapshot-section" aria-labelledby="snapshot-title">
        <div className="section-heading narrow">
          <span className="eyebrow">Screenshot selling point</span>
          <h2 id="snapshot-title">템플릿 카탈로그가 아니라, 쇼룸 스크린샷으로 파는 서비스</h2>
        </div>
        <div className="snapshot-grid">
          {templates.map((template, index) => (
            <button
              className={`snapshot-card ${template.className}`}
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              style={
                {
                  '--accent': template.accent,
                  '--paper': template.paper,
                  '--ink': template.ink,
                  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${template.paper} 82%, transparent), color-mix(in srgb, ${template.ink} 16%, transparent)), url(${template.cover})`,
                } as React.CSSProperties
              }
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{template.name}</strong>
              <small>{template.mood}</small>
            </button>
          ))}
        </div>
      </section>

      <footer className="platform-footer">
        <span>{eventBlueprint.platformName}</span>
        <p>Wedding first, invitation platform next.</p>
      </footer>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <nav className="top-nav" aria-label="primary navigation">
        <a href="#top" className="brand-mark">
          Issue Invite
        </a>
        <div>
          <a href="#flow">Flow</a>
          <a href="#create">Create</a>
          <a href="#showroom">Showroom</a>
        </div>
      </nav>

      <div className="hero-layout">
        <div className="hero-copy">
          <span className="eyebrow">Event invitation platform</span>
          <h1>세상에 없는 모바일 초대장을 만드는 매거진 스튜디오</h1>
          <p>
            플랫폼은 심플하게, 제작 과정은 쉽게, 결과물은 패션 잡지처럼 강하게. 첫 카테고리는
            모바일 청첩장이지만 구조는 모든 이벤트 초대장으로 확장됩니다.
          </p>
          <div className="hero-actions">
            <a href="#create">초대장 만들기</a>
            <a href="#showroom">목업 보기</a>
          </div>
        </div>

        <div className="hero-preview" aria-label="featured invitation mockups">
          <div className="cover-card cover-card-main">
            <span>THE WEDDING ISSUE</span>
            <strong>DOYUN<br />SEOYEON</strong>
            <small>Group-aware invitation links</small>
          </div>
          <div className="cover-card cover-card-type">
            <span>FRIENDS ONLY</span>
            <strong>AFTER<br />PARTY</strong>
            <small>custom copy / hidden sections</small>
          </div>
          <div className="cover-card cover-card-soft">
            <span>FAMILY EDITION</span>
            <strong>FORMAL<br />DETAILS</strong>
            <small>parking / account / RSVP</small>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhonePreview({
  audience,
  issued,
  template,
}: {
  audience: AudienceMode;
  issued: boolean;
  template: Template;
}) {
  return (
    <article
      className={`phone-frame ${template.className}`}
      style={
        {
          '--accent': template.accent,
          '--paper': template.paper,
          '--ink': template.ink,
        } as React.CSSProperties
      }
    >
      <div className="phone-scroll">
        <header
          className="invite-cover"
          style={
            {
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.58)), url(${template.cover})`,
            } as React.CSSProperties
          }
        >
          <div className="issue-bar">
            <span>{template.label}</span>
            <span>{eventBlueprint.eventType}</span>
            <span>{audience.label}</span>
          </div>
          <div className="cover-copy">
            <span>{eventBlueprint.eventTitle}</span>
            <h2>
              {eventBlueprint.hosts[0]}
              <br />
              &amp; {eventBlueprint.hosts[1]}
            </h2>
            <p>{audience.headline}</p>
          </div>
        </header>

        <section className="invite-section intro-section">
          <span className="section-code">Editor note</span>
          <h3>{audience.headline}</h3>
          <p>{audience.greeting}</p>
        </section>

        <section className="invite-section meta-section">
          <div>
            <span>Date</span>
            <strong>{eventBlueprint.date}</strong>
            <small>{eventBlueprint.time}</small>
          </div>
          <div>
            <span>Venue</span>
            <strong>{eventBlueprint.venue}</strong>
            <small>{eventBlueprint.address}</small>
          </div>
        </section>

        <section className="invite-section gallery-spread">
          <span className="section-code">Gallery</span>
          <div className="spread-grid">
            <div
              className="spread-photo large"
              style={{ backgroundImage: `url(${eventBlueprint.gallery[0]})` }}
            />
            <div
              className="spread-photo"
              style={{ backgroundImage: `url(${eventBlueprint.gallery[1]})` }}
            />
            <div
              className="spread-photo"
              style={{ backgroundImage: `url(${eventBlueprint.gallery[2]})` }}
            />
          </div>
        </section>

        <section className="invite-section action-section">
          <div className="action-card">
            <span>RSVP</span>
            <strong>{audience.primaryCta}</strong>
            <p>동행 인원, 식사 여부, 전달 메시지를 그룹 링크별로 수집합니다.</p>
          </div>
          <div className="action-card">
            <span>Gift</span>
            <strong>마음 전하실 곳</strong>
            <p>{audience.id === 'friends' ? '친구 링크에서는 간단 보기로 축약됩니다.' : '혼주와 신랑 신부 계좌를 탭으로 구분합니다.'}</p>
          </div>
        </section>

        <footer className="invite-footer">
          <strong>{issued ? 'Issued link ready' : 'Preview mode'}</strong>
          <span>{audience.link}</span>
        </footer>
      </div>
    </article>
  );
}
