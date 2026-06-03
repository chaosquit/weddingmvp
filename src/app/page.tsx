'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type AudienceKey = 'friends' | 'family' | 'public';
type ModuleKey = 'cover' | 'intro' | 'gallery' | 'calendar' | 'map' | 'gift' | 'rsvp' | 'guestbook';

type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  className: string;
  accent: string;
  background: string;
  cover: string;
  motion: string;
};

type Audience = {
  id: AudienceKey;
  label: string;
  description: string;
  headline: string;
  link: string;
  visible: string;
};

type ModuleItem = {
  id: ModuleKey;
  label: string;
  summary: string;
};

const templates: Template[] = [
  {
    id: 'editorial',
    name: 'Editorial Minimal',
    category: 'Magazine',
    description: '여백, 큰 타이포, 화보형 커버를 쓰는 패션 잡지 스타일',
    className: 'preview-editorial',
    accent: '#111111',
    background: '#f6f1e8',
    cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000&auto=format&fit=crop',
    motion: '세리프 타이틀 페이드',
  },
  {
    id: 'glass',
    name: 'Glass Studio',
    category: 'Soft modern',
    description: '사진 위에 유리 패널과 얇은 정보 모듈을 얹는 앱형 스타일',
    className: 'preview-glass',
    accent: '#2f6f73',
    background: '#edf5f1',
    cover: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1000&auto=format&fit=crop',
    motion: '플로팅 글래스 카드',
  },
  {
    id: 'poster',
    name: 'Bold Poster',
    category: 'Street issue',
    description: '강한 포스터 그래픽, 오프셋 프레임, 빠른 타이포 모션',
    className: 'preview-poster',
    accent: '#d71920',
    background: '#fff8ec',
    cover: '/inspiration/type-poster.jpg',
    motion: '프린트 지터 타이포',
  },
  {
    id: 'luxury',
    name: 'Dark Luxury',
    category: 'High fashion',
    description: '블랙, 버건디, 금박 라벨을 쓰는 럭셔리 매거진 스타일',
    className: 'preview-luxury',
    accent: '#a83f39',
    background: '#120d0e',
    cover: '/inspiration/street-cover.jpg',
    motion: '스포트라이트 커버',
  },
  {
    id: 'system',
    name: 'Minima System',
    category: 'Clean utility',
    description: '정보가 먼저 보이는 깔끔한 모바일 앱형 청첩장',
    className: 'preview-system',
    accent: '#0f766e',
    background: '#ffffff',
    cover: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1000&auto=format&fit=crop',
    motion: '스냅 섹션 전환',
  },
];

const audiences: Audience[] = [
  {
    id: 'friends',
    label: '친구',
    description: '가볍고 재치 있는 문구, 애프터 모임, 사진을 더 많이 노출',
    headline: 'Dress up, cry a little, dance a lot.',
    link: 'issue.link/doyun-seoyeon/friends',
    visible: '사진, 애프터 안내, 참석 여부, 방명록',
  },
  {
    id: 'public',
    label: '지인',
    description: '일정과 장소, 참석 여부가 가장 빨리 보이는 정보 우선 링크',
    headline: '일정과 장소를 바로 확인하실 수 있습니다.',
    link: 'issue.link/doyun-seoyeon/guest',
    visible: '일정, 장소, 교통, RSVP',
  },
  {
    id: 'family',
    label: '가족',
    description: '정중한 인사말, 혼주 정보, 주차와 계좌 안내를 자세히 노출',
    headline: '귀한 걸음으로 함께해 주세요.',
    link: 'issue.link/doyun-seoyeon/family',
    visible: '혼주, 주차, 계좌, 예식 순서',
  },
];

const baseModules: ModuleItem[] = [
  { id: 'cover', label: '메인 커버', summary: '첫 사진, 영상, 타이틀 모션' },
  { id: 'intro', label: '초대 문구', summary: '자동 추천 문구 또는 직접 작성' },
  { id: 'gallery', label: '앨범', summary: '그리드, 필름, 매거진 스프레드' },
  { id: 'calendar', label: '일정', summary: '날짜, 시간, 캘린더 강조' },
  { id: 'map', label: '오시는 길', summary: '지도, 교통, 주차 안내' },
  { id: 'gift', label: '마음 전하실 곳', summary: '계좌, 복사 버튼, 그룹별 노출' },
  { id: 'rsvp', label: '참석 여부', summary: '동행 인원, 식사 여부, 메시지' },
  { id: 'guestbook', label: '방명록', summary: '축하 메시지와 공개 범위' },
];

const steps = ['로그인', '테마 선택', '정보 입력', '요소 편집', '스타일 조절', '그룹 프리뷰'];

const phraseSuggestions = [
  '서로의 계절이 되어 같은 방향을 바라보려 합니다. 귀한 걸음으로 축복해 주세요.',
  '익숙한 하루들이 모여 특별한 약속이 되었습니다. 소중한 분들을 초대합니다.',
  '작은 우연에서 시작된 이야기를 이제 하나의 집으로 이어가려 합니다.',
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [selectedAudienceId, setSelectedAudienceId] = useState<AudienceKey>('friends');
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleKey>('cover');
  const [modules, setModules] = useState(baseModules);
  const [draggedModule, setDraggedModule] = useState<ModuleKey | null>(null);
  const [previewStarted, setPreviewStarted] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [form, setForm] = useState({
    title: 'The September Wedding Issue',
    groom: '김도윤',
    bride: '이서연',
    date: '2026.09.12 Sat',
    time: '오후 2시',
    venue: '그랜드 하얏트 서울, 그랜드볼룸',
    address: '서울 용산구 소월로 322',
    greeting: phraseSuggestions[0],
    heroMotion: 'cinematic',
    albumStyle: 'magazine',
    typography: 'soft-reveal',
    ornament: 'line',
    tone: 'warm',
  });
  const [style, setStyle] = useState({
    accent: templates[0].accent,
    background: templates[0].background,
    contrast: 'balanced',
    photoFx: 'grain',
    density: 'editorial',
  });

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId],
  );

  const selectedAudience = useMemo(
    () => audiences.find((audience) => audience.id === selectedAudienceId) ?? audiences[0],
    [selectedAudienceId],
  );

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedModuleId) ?? modules[0],
    [modules, selectedModuleId],
  );

  useEffect(() => {
    if (!previewStarted || paymentOpen || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [paymentOpen, previewStarted, secondsLeft]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateStyle = (key: keyof typeof style, value: string) => {
    setStyle((current) => ({ ...current, [key]: value }));
  };

  const startMaking = () => {
    document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' });
  };

  const fakeLogin = () => {
    setLoggedIn(true);
    setActiveStep(1);
  };

  const moveModule = (id: ModuleKey, direction: -1 | 1) => {
    setModules((current) => {
      const index = current.findIndex((module) => module.id === id);
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  };

  const dropModule = (targetId: ModuleKey) => {
    if (!draggedModule || draggedModule === targetId) {
      return;
    }

    setModules((current) => {
      const moving = current.find((module) => module.id === draggedModule);
      if (!moving) {
        return current;
      }

      const withoutMoving = current.filter((module) => module.id !== draggedModule);
      const targetIndex = withoutMoving.findIndex((module) => module.id === targetId);
      const next = [...withoutMoving];
      next.splice(targetIndex, 0, moving);
      return next;
    });
    setDraggedModule(null);
  };

  return (
    <main className="product-shell">
      <nav className="topbar">
        <a className="brand" href="#top">Issue Invite</a>
        <div>
          <a href="#templates">테마</a>
          <a href="#builder">만들기</a>
          <a href="#result">결과물</a>
        </div>
      </nav>

      <section className="landing" id="top">
        <div className="landing-copy">
          <span className="label">Mobile invitation builder</span>
          <h1>템플릿을 고르고, 필요한 정보만 채우면 바로 모청 시안이 완성됩니다.</h1>
          <p>
            랜딩은 단정하게, 제작 과정은 쉽게, 결과물은 매거진처럼 감각적으로. 결혼식으로
            시작하지만 돌잔치, 생일, 전시, 세미나까지 확장 가능한 이벤트 초대장 플랫폼입니다.
          </p>
          <div className="landing-actions">
            <button onClick={startMaking} type="button">샘플 만들기</button>
            <a href="#result">그룹별 결과 보기</a>
          </div>
        </div>

        <div className="landing-product" aria-label="service flow preview">
          <div className="flow-card is-dark">
            <span>01</span>
            <strong>Google Login</strong>
            <small>나중에 실제 연동</small>
          </div>
          <div className="flow-card">
            <span>02</span>
            <strong>Theme First</strong>
            <small>테마 선택 후 입력 구조 자동 세팅</small>
          </div>
          <div className="flow-card">
            <span>03</span>
            <strong>Drag Modules</strong>
            <small>커버, 앨범, 지도, RSVP 순서 편집</small>
          </div>
          <div className="flow-card is-accent">
            <span>04</span>
            <strong>5 Minute Preview</strong>
            <small>친구, 지인, 가족 링크별 확인</small>
          </div>
        </div>
      </section>

      <section className="template-strip" id="templates">
        <div className="section-title">
          <span className="label">Choose theme</span>
          <h2>먼저 테마를 고르면, 그 테마에 맞는 입력과 스타일 옵션이 열립니다.</h2>
        </div>
        <div className="template-row">
          {templates.map((template) => (
            <button
              className={selectedTemplate.id === template.id ? 'theme-card is-selected' : 'theme-card'}
              key={template.id}
              onClick={() => {
                setSelectedTemplateId(template.id);
                setStyle((value) => ({
                  ...value,
                  accent: template.accent,
                  background: template.background,
                }));
                setActiveStep(Math.max(activeStep, 2));
              }}
              style={{ '--theme-accent': template.accent } as CSSProperties}
              type="button"
            >
              <span>{template.category}</span>
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="builder" id="builder">
        <div className="builder-header">
          <div>
            <span className="label">Actual creation flow</span>
            <h2>로그인하는 척하고, 실제 모청 샘플을 끝까지 만들어봅니다.</h2>
          </div>
          <button className={loggedIn ? 'login-button is-done' : 'login-button'} onClick={fakeLogin} type="button">
            {loggedIn ? 'Google 계정 연결됨' : 'Google로 시작하기'}
          </button>
        </div>

        <div className="stepper" aria-label="builder steps">
          {steps.map((step, index) => (
            <button
              className={activeStep === index ? 'is-active' : activeStep > index ? 'is-complete' : ''}
              key={step}
              onClick={() => loggedIn && setActiveStep(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {step}
            </button>
          ))}
        </div>

        <div className="workspace">
          <div className="editor-panels">
            {!loggedIn ? (
              <LoginPanel fakeLogin={fakeLogin} />
            ) : (
              <>
                <Panel title="기본 정보 입력" kicker="Content">
                  <div className="field-grid">
                    <label>
                      초대장 제목
                      <input value={form.title} onChange={(event) => updateForm('title', event.target.value)} />
                    </label>
                    <label>
                      신랑
                      <input value={form.groom} onChange={(event) => updateForm('groom', event.target.value)} />
                    </label>
                    <label>
                      신부
                      <input value={form.bride} onChange={(event) => updateForm('bride', event.target.value)} />
                    </label>
                    <label>
                      날짜
                      <input value={form.date} onChange={(event) => updateForm('date', event.target.value)} />
                    </label>
                    <label>
                      시간
                      <input value={form.time} onChange={(event) => updateForm('time', event.target.value)} />
                    </label>
                    <label>
                      장소
                      <input value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} />
                    </label>
                  </div>
                  <label className="wide-field">
                    주소
                    <input value={form.address} onChange={(event) => updateForm('address', event.target.value)} />
                  </label>
                  <label className="wide-field">
                    초대 문구
                    <textarea value={form.greeting} onChange={(event) => updateForm('greeting', event.target.value)} />
                  </label>
                  <div className="suggestion-row">
                    {phraseSuggestions.map((phrase) => (
                      <button key={phrase} onClick={() => updateForm('greeting', phrase)} type="button">
                        자동 문구 적용
                      </button>
                    ))}
                  </div>
                </Panel>

                <Panel title="요소 순서와 세부 편집" kicker="Drag and drop">
                  <div className="module-list">
                    {modules.map((module, index) => (
                      <article
                        className={selectedModuleId === module.id ? 'module-item is-selected' : 'module-item'}
                        draggable
                        key={module.id}
                        onDragOver={(event) => event.preventDefault()}
                        onDragStart={() => setDraggedModule(module.id)}
                        onDrop={() => dropModule(module.id)}
                      >
                        <button className="module-select" onClick={() => setSelectedModuleId(module.id)} type="button">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <strong>{module.label}</strong>
                          <small>{module.summary}</small>
                        </button>
                        <div className="module-actions">
                          <button onClick={() => moveModule(module.id, -1)} type="button">위</button>
                          <button onClick={() => moveModule(module.id, 1)} type="button">아래</button>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div className="module-detail">
                    <span>{selectedModule.label} 세부 옵션</span>
                    <div className="segmented">
                      {['기본', '강조', '숨김'].map((value) => (
                        <button key={value} type="button">{value}</button>
                      ))}
                    </div>
                    <p>{selectedModule.summary}을 현재 테마인 {selectedTemplate.name}에 맞춰 세부 조절합니다.</p>
                  </div>
                </Panel>

                <Panel title="디자인 스타일링" kicker="CSS controls">
                  <div className="control-grid">
                    <label>
                      포인트 색
                      <input
                        type="color"
                        value={style.accent}
                        onChange={(event) => updateStyle('accent', event.target.value)}
                      />
                    </label>
                    <label>
                      배경 색감
                      <input
                        type="color"
                        value={style.background}
                        onChange={(event) => updateStyle('background', event.target.value)}
                      />
                    </label>
                    <label>
                      메인 사진/영상 애니메이션
                      <select value={form.heroMotion} onChange={(event) => updateForm('heroMotion', event.target.value)}>
                        <option value="cinematic">시네마틱 줌</option>
                        <option value="float">부유하는 패널</option>
                        <option value="poster">포스터 지터</option>
                      </select>
                    </label>
                    <label>
                      앨범 디자인
                      <select value={form.albumStyle} onChange={(event) => updateForm('albumStyle', event.target.value)}>
                        <option value="magazine">매거진 스프레드</option>
                        <option value="film">필름 롤</option>
                        <option value="grid">정돈된 그리드</option>
                      </select>
                    </label>
                    <label>
                      타이포 효과
                      <select value={form.typography} onChange={(event) => updateForm('typography', event.target.value)}>
                        <option value="soft-reveal">부드러운 등장</option>
                        <option value="ticker">흐르는 티커</option>
                        <option value="stamp">스탬프 오버레이</option>
                      </select>
                    </label>
                    <label>
                      장식 애니메이션
                      <select value={form.ornament} onChange={(event) => updateForm('ornament', event.target.value)}>
                        <option value="line">라인 드로잉</option>
                        <option value="spark">작은 빛 입자</option>
                        <option value="paper">종이 질감 페이드</option>
                      </select>
                    </label>
                  </div>
                </Panel>
              </>
            )}
          </div>

          <aside className="live-preview">
            <div className="preview-top">
              <span>{selectedTemplate.name}</span>
              <strong>{previewStarted ? formatTime(secondsLeft) : '미리보기 대기'}</strong>
            </div>
            <PhonePreview
              audience={selectedAudience}
              form={form}
              modules={modules}
              previewStarted={previewStarted}
              secondsLeft={secondsLeft}
              style={style}
              template={selectedTemplate}
            />
          </aside>
        </div>
      </section>

      <section className="result-section" id="result">
        <div className="section-title">
          <span className="label">Audience preview</span>
          <h2>최종 결과물은 친구, 지인, 가족 링크별로 다르게 확인합니다.</h2>
        </div>

        <div className="audience-grid">
          {audiences.map((audience) => (
            <button
              className={selectedAudienceId === audience.id ? 'audience-result is-selected' : 'audience-result'}
              key={audience.id}
              onClick={() => setSelectedAudienceId(audience.id)}
              type="button"
            >
              <span>{audience.label} 링크</span>
              <strong>{audience.headline}</strong>
              <p>{audience.description}</p>
              <small>{audience.link}</small>
            </button>
          ))}
        </div>

        <div className="preview-gate">
          <div>
            <span className="label">5 minute preview</span>
            <h3>{previewStarted ? `남은 시간 ${formatTime(secondsLeft)}` : '5분 미리보기 시작 전입니다.'}</h3>
            <p>샘플 확인은 5분 동안 열리고, 최종 결정 시 결제 페이지로 이동하는 흐름입니다.</p>
          </div>
          <div className="gate-actions">
            <button onClick={() => { setPreviewStarted(true); setSecondsLeft(300); }} type="button">
              5분 미리보기 시작
            </button>
            <button className="dark" onClick={() => setPaymentOpen(true)} type="button">
              최종 결정하고 결제페이지로
            </button>
          </div>
        </div>

        <div className={paymentOpen ? 'payment-panel is-open' : 'payment-panel'}>
          <span className="label">Checkout</span>
          <h3>결제 페이지 시뮬레이션</h3>
          <p>{selectedTemplate.name} 테마와 {selectedAudience.label} 링크 구성이 결제 대기 상태로 저장되었습니다.</p>
          <div>
            <strong>상품</strong>
            <span>프리미엄 모바일 초대장 발급</span>
          </div>
          <div>
            <strong>발급 링크</strong>
            <span>{selectedAudience.link}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function Panel({
  children,
  kicker,
  title,
}: {
  children: ReactNode;
  kicker: string;
  title: string;
}) {
  return (
    <article className="panel">
      <span className="label">{kicker}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}

function LoginPanel({ fakeLogin }: { fakeLogin: () => void }) {
  return (
    <article className="login-panel">
      <span className="label">Login required</span>
      <h3>샘플 제작을 시작하려면 먼저 Google 로그인을 진행합니다.</h3>
      <p>현재는 실제 인증 없이 로그인된 것처럼 상태만 바꿉니다. 나중에 OAuth와 사용자 저장소를 연결하면 됩니다.</p>
      <button onClick={fakeLogin} type="button">Google로 계속하기</button>
    </article>
  );
}

function PhonePreview({
  audience,
  form,
  modules,
  previewStarted,
  secondsLeft,
  style,
  template,
}: {
  audience: Audience;
  form: {
    title: string;
    groom: string;
    bride: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    greeting: string;
    heroMotion: string;
    albumStyle: string;
    typography: string;
    ornament: string;
    tone: string;
  };
  modules: ModuleItem[];
  previewStarted: boolean;
  secondsLeft: number;
  style: {
    accent: string;
    background: string;
    contrast: string;
    photoFx: string;
    density: string;
  };
  template: Template;
}) {
  return (
    <article
      className={`phone ${template.className} motion-${form.heroMotion} type-${form.typography} album-${form.albumStyle}`}
      style={
        {
          '--accent': style.accent,
          '--phone-bg': style.background,
          '--cover': `url(${template.cover})`,
        } as CSSProperties
      }
    >
      <div className="phone-scroll">
        {!previewStarted && (
          <div className="preview-lock">
            <strong>5분 미리보기 전</strong>
            <span>제작 내용은 저장되고 있습니다.</span>
          </div>
        )}

        <section className="phone-cover">
          <div className="cover-meta">
            <span>{template.category}</span>
            <span>{audience.label} 링크</span>
          </div>
          <div className="ornament-line" />
          <h2>{form.groom}<br />&amp; {form.bride}</h2>
          <p>{audience.headline}</p>
        </section>

        {modules.map((module) => (
          <PhoneModule
            audience={audience}
            form={form}
            key={module.id}
            module={module}
            secondsLeft={secondsLeft}
          />
        ))}
      </div>
    </article>
  );
}

function PhoneModule({
  audience,
  form,
  module,
  secondsLeft,
}: {
  audience: Audience;
  form: {
    title: string;
    groom: string;
    bride: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    greeting: string;
  };
  module: ModuleItem;
  secondsLeft: number;
}) {
  if (module.id === 'cover') {
    return null;
  }

  if (module.id === 'intro') {
    return (
      <section className="phone-section">
        <span>Invitation note</span>
        <h3>{form.title}</h3>
        <p>{form.greeting}</p>
      </section>
    );
  }

  if (module.id === 'gallery') {
    return (
      <section className="phone-section">
        <span>Album</span>
        <div className="mobile-gallery">
          <i />
          <i />
          <i />
        </div>
      </section>
    );
  }

  if (module.id === 'calendar') {
    return (
      <section className="phone-section split">
        <div>
          <span>Date</span>
          <strong>{form.date}</strong>
          <small>{form.time}</small>
        </div>
        <div>
          <span>Preview</span>
          <strong>{formatTime(secondsLeft)}</strong>
          <small>5분 제한</small>
        </div>
      </section>
    );
  }

  if (module.id === 'map') {
    return (
      <section className="phone-section">
        <span>Location</span>
        <h3>{form.venue}</h3>
        <p>{form.address}</p>
        <div className="mini-map">Map preview</div>
      </section>
    );
  }

  if (module.id === 'gift') {
    return (
      <section className="phone-section">
        <span>Gift</span>
        <p>{audience.id === 'friends' ? '친구 링크에서는 계좌 안내를 접어둡니다.' : '혼주와 신랑 신부 계좌를 탭으로 구분해 보여줍니다.'}</p>
      </section>
    );
  }

  if (module.id === 'rsvp') {
    return (
      <section className="phone-section">
        <span>RSVP</span>
        <h3>{audience.label}용 참석 여부</h3>
        <button type="button">참석 여부 남기기</button>
      </section>
    );
  }

  return (
    <section className="phone-section">
      <span>Guestbook</span>
      <p>축하 메시지는 그룹별 공개 범위에 맞춰 노출됩니다.</p>
    </section>
  );
}
