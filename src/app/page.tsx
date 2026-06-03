'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type AudienceKey = 'friends' | 'family' | 'public';
type SectionKey = 'hero' | 'intro' | 'gallery' | 'schedule' | 'location' | 'rsvp' | 'gift' | 'guestbook';
type GalleryLayout = 'grid' | 'slide' | 'pinterest' | 'film';

type Template = {
  id: string;
  name: string;
  tone: string;
  description: string;
  accent: string;
  surface: string;
  className: string;
  cover: string;
};

type InvitationSection = {
  id: SectionKey;
  label: string;
  help: string;
  enabled: boolean;
};

type MediaAsset = {
  name: string;
  url: string;
  type: string;
};

const templates: Template[] = [
  {
    id: 'editorial',
    name: 'Editorial Minimal',
    tone: 'Fashion magazine',
    description: '여백과 큰 타이포, 한 장의 대표 사진으로 고급스럽게 시작합니다.',
    accent: '#1f1f1f',
    surface: '#f5f1e8',
    className: 'theme-editorial',
    cover: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'glass',
    name: 'Glass Garden',
    tone: 'Soft app-like',
    description: '사진 위에 유리 패널을 얹어 정보와 감성을 부드럽게 분리합니다.',
    accent: '#2f6f73',
    surface: '#edf5f1',
    className: 'theme-glass',
    cover: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'poster',
    name: 'Bold Poster',
    tone: 'Graphic issue',
    description: '친구 링크에 어울리는 과감한 포스터 타이포와 인쇄 질감입니다.',
    accent: '#d71920',
    surface: '#fff8ec',
    className: 'theme-poster',
    cover: '/inspiration/type-poster.jpg',
  },
  {
    id: 'luxury',
    name: 'Dark Luxury',
    tone: 'Evening couture',
    description: '블랙, 버건디, 금박 라벨로 완성하는 하이패션 청첩장입니다.',
    accent: '#a83f39',
    surface: '#120d0e',
    className: 'theme-luxury',
    cover: '/inspiration/street-cover.jpg',
  },
  {
    id: 'system',
    name: 'Calm System',
    tone: 'Information first',
    description: '일정, 장소, 참석 여부를 가장 빠르게 읽히게 하는 미니멀 타입입니다.',
    accent: '#0f766e',
    surface: '#ffffff',
    className: 'theme-system',
    cover: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop',
  },
];

const starterSections: InvitationSection[] = [
  { id: 'hero', label: '메인 커버', help: '대표 사진/영상, 이름, 첫 인상', enabled: true },
  { id: 'intro', label: '초대 문구', help: '직접 작성 또는 추천 문구 적용', enabled: true },
  { id: 'gallery', label: '웨딩 앨범', help: '그리드, 슬라이드, 핀터레스트, 필름', enabled: true },
  { id: 'schedule', label: '일정', help: '날짜, 시간, 캘린더 강조', enabled: true },
  { id: 'location', label: '오시는 길', help: '주소, 교통, 주차 안내', enabled: true },
  { id: 'rsvp', label: '참석 여부', help: '동행 인원, 식사 여부, 메시지', enabled: true },
  { id: 'gift', label: '마음 전하실 곳', help: '계좌, 복사 버튼, 그룹별 공개', enabled: true },
  { id: 'guestbook', label: '방명록', help: '축하 메시지와 공개 범위', enabled: false },
];

const audiences = {
  friends: {
    label: '친구',
    headline: 'Dress up, cry a little, dance a lot.',
    note: '애프터 모임과 사진을 더 보여주고, 계좌 안내는 접어둡니다.',
    link: 'issue.link/doyun-seoyeon/friends',
  },
  public: {
    label: '지인',
    headline: '일정과 장소를 가장 먼저 확인하실 수 있습니다.',
    note: '핵심 일정, 지도, 참석 여부를 상단에 배치합니다.',
    link: 'issue.link/doyun-seoyeon/guest',
  },
  family: {
    label: '가족',
    headline: '귀한 걸음으로 함께해 주세요.',
    note: '혼주 정보, 주차, 계좌 안내를 자세히 노출합니다.',
    link: 'issue.link/doyun-seoyeon/family',
  },
} satisfies Record<AudienceKey, { label: string; headline: string; note: string; link: string }>;

const sampleImages = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=900&auto=format&fit=crop',
];

const writingSuggestions = [
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
  const editorRef = useRef<HTMLElement | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [selectedAudience, setSelectedAudience] = useState<AudienceKey>('friends');
  const [selectedSectionId, setSelectedSectionId] = useState<SectionKey>('hero');
  const [draggingSection, setDraggingSection] = useState<SectionKey | null>(null);
  const [sections, setSections] = useState(starterSections);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [previewStarted, setPreviewStarted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [form, setForm] = useState({
    title: 'The September Wedding Issue',
    groom: '김도윤',
    bride: '이서연',
    date: '2026.09.12 Sat',
    time: '오후 2시',
    venue: '그랜드 하얏트 서울 그랜드볼룸',
    address: '서울 용산구 소월로 322',
    greeting: writingSuggestions[0],
  });
  const [design, setDesign] = useState({
    accent: templates[0].accent,
    surface: templates[0].surface,
    galleryLayout: 'pinterest' as GalleryLayout,
    heroMotion: 'cinematic',
    typography: 'balanced',
    decoration: 'line',
  });

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId],
  );

  const enabledSections = useMemo(() => sections.filter((section) => section.enabled), [sections]);
  const activeSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId) ?? sections[0],
    [sections, selectedSectionId],
  );

  const previewImages = mediaAssets.length > 0 ? mediaAssets.map((asset) => asset.url) : sampleImages;

  useEffect(() => {
    return () => {
      mediaAssets.forEach((asset) => URL.revokeObjectURL(asset.url));
    };
  }, [mediaAssets]);

  useEffect(() => {
    if (!previewStarted || checkoutOpen || secondsLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(value - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [checkoutOpen, previewStarted, secondsLeft]);

  const chooseTemplate = (template: Template) => {
    setSelectedTemplateId(template.id);
    setDesign((current) => ({
      ...current,
      accent: template.accent,
      surface: template.surface,
    }));
  };

  const requestStart = () => {
    if (!loggedIn) {
      setLoginOpen(true);
      return;
    }
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const completeLogin = () => {
    setLoggedIn(true);
    setLoginOpen(false);
    window.setTimeout(() => editorRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateDesign = (key: keyof typeof design, value: string) => {
    setDesign((current) => ({ ...current, [key]: value }));
  };

  const moveSection = (id: SectionKey, direction: -1 | 1) => {
    setSections((current) => {
      const index = current.findIndex((section) => section.id === id);
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

  const dropSection = (targetId: SectionKey) => {
    if (!draggingSection || draggingSection === targetId) {
      return;
    }
    setSections((current) => {
      const moving = current.find((section) => section.id === draggingSection);
      if (!moving) {
        return current;
      }
      const rest = current.filter((section) => section.id !== draggingSection);
      const targetIndex = rest.findIndex((section) => section.id === targetId);
      const next = [...rest];
      next.splice(targetIndex, 0, moving);
      return next;
    });
    setDraggingSection(null);
  };

  const toggleSection = (id: SectionKey) => {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, enabled: !section.enabled } : section)),
    );
  };

  const uploadMedia = (files: FileList | null) => {
    if (!files) {
      return;
    }
    mediaAssets.forEach((asset) => URL.revokeObjectURL(asset.url));
    const nextAssets = Array.from(files)
      .slice(0, 8)
      .map((file) => ({
        name: file.name,
        type: file.type || 'image',
        url: URL.createObjectURL(file),
      }));
    setMediaAssets(nextAssets);
  };

  return (
    <main className="app-shell">
      <nav className="site-nav">
        <a href="#top" className="brand">Issue Invite</a>
        <div>
          <a href="#samples">샘플</a>
          <a href="#editor">에디터</a>
          <a href="#preview">결과 확인</a>
        </div>
        <button onClick={requestStart} type="button">무료 시안 만들기</button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Premium mobile invitation studio</span>
          <h1>하객마다 다른 링크, 잡지처럼 완성되는 모바일 청첩장.</h1>
          <p>
            사진을 올리고, 템플릿을 고르고, 필요한 섹션만 정리하세요. 친구, 지인, 가족에게
            서로 다른 문구와 정보가 보이는 프리미엄 청첩장을 무료 시안으로 먼저 확인할 수 있습니다.
          </p>
          <div className="hero-actions">
            <button onClick={requestStart} type="button">무료 시안 만들기</button>
            <a href="#samples">완성 샘플 보기</a>
          </div>
          <div className="trust-row">
            <span>5분 프리뷰</span>
            <span>그룹별 링크</span>
            <span>사진 기반 에디터</span>
          </div>
        </div>

        <div className="hero-gallery" aria-label="finished invitation samples">
          {templates.slice(0, 3).map((template) => (
            <button
              className={`sample-phone ${selectedTemplateId === template.id ? 'is-active' : ''}`}
              key={template.id}
              onClick={() => chooseTemplate(template)}
              style={{ '--accent': template.accent, '--cover': `url(${template.cover})` } as CSSProperties}
              type="button"
            >
              <span>{template.tone}</span>
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="sample-section" id="samples">
        <div className="section-heading">
          <span className="eyebrow">Template gallery</span>
          <h2>완성된 샘플을 먼저 보고, 마음에 드는 방향에서 시작하세요.</h2>
        </div>
        <div className="template-grid">
          {templates.map((template) => (
            <button
              className={selectedTemplateId === template.id ? 'template-card is-selected' : 'template-card'}
              key={template.id}
              onClick={() => chooseTemplate(template)}
              style={{ '--accent': template.accent, '--surface': template.surface, '--cover': `url(${template.cover})` } as CSSProperties}
              type="button"
            >
              <i />
              <span>{template.tone}</span>
              <strong>{template.name}</strong>
              <small>{template.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="editor-shell" id="editor" ref={editorRef}>
        <div className="editor-header">
          <div>
            <span className="eyebrow">Invitation editor</span>
            <h2>사진, 섹션, 스타일을 한 화면에서 조정합니다.</h2>
            <p>템플릿은 출발점일 뿐입니다. 섹션 순서와 공개 범위, 앨범 레이아웃, 색감과 모션까지 세부 조정할 수 있습니다.</p>
          </div>
          <button onClick={requestStart} type="button">
            {loggedIn ? '편집 중' : '로그인하고 편집 시작'}
          </button>
        </div>

        <div className={loggedIn ? 'editor-workspace' : 'editor-workspace is-locked'}>
          {!loggedIn && (
            <div className="editor-lock">
              <strong>템플릿을 고른 뒤 무료 시안을 저장하세요.</strong>
              <span>사진과 정보를 안전하게 보관하고, 이어서 편집할 수 있도록 로그인을 진행합니다.</span>
              <button onClick={() => setLoginOpen(true)} type="button">무료 시안 만들기</button>
            </div>
          )}

          <aside className="component-panel">
            <span className="eyebrow">Components</span>
            <h3>섹션 구성</h3>
            <div className="section-list">
              {sections.map((section, index) => (
                <article
                  className={selectedSectionId === section.id ? 'section-item is-selected' : 'section-item'}
                  draggable={loggedIn}
                  key={section.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDraggingSection(section.id)}
                  onDrop={() => dropSection(section.id)}
                >
                  <button onClick={() => setSelectedSectionId(section.id)} type="button">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{section.label}</strong>
                    <small>{section.help}</small>
                  </button>
                  <div>
                    <button onClick={() => moveSection(section.id, -1)} type="button">위</button>
                    <button onClick={() => moveSection(section.id, 1)} type="button">아래</button>
                    <button onClick={() => toggleSection(section.id)} type="button">
                      {section.enabled ? '노출' : '숨김'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <section className="inspector-panel">
            <div className="panel-block">
              <span className="eyebrow">Wedding details</span>
              <h3>기본 정보</h3>
              <div className="field-grid">
                <label>제목<input value={form.title} onChange={(event) => updateForm('title', event.target.value)} /></label>
                <label>신랑<input value={form.groom} onChange={(event) => updateForm('groom', event.target.value)} /></label>
                <label>신부<input value={form.bride} onChange={(event) => updateForm('bride', event.target.value)} /></label>
                <label>날짜<input value={form.date} onChange={(event) => updateForm('date', event.target.value)} /></label>
                <label>시간<input value={form.time} onChange={(event) => updateForm('time', event.target.value)} /></label>
                <label>장소<input value={form.venue} onChange={(event) => updateForm('venue', event.target.value)} /></label>
              </div>
              <label className="wide-field">주소<input value={form.address} onChange={(event) => updateForm('address', event.target.value)} /></label>
              <label className="wide-field">초대 문구<textarea value={form.greeting} onChange={(event) => updateForm('greeting', event.target.value)} /></label>
              <div className="copy-suggestions">
                {writingSuggestions.map((copy) => (
                  <button key={copy} onClick={() => updateForm('greeting', copy)} type="button">추천 문구 적용</button>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <span className="eyebrow">Photo upload</span>
              <h3>고해상도 웨딩 사진</h3>
              <label className="upload-zone">
                <input accept="image/*,video/*" multiple onChange={(event) => uploadMedia(event.target.files)} type="file" />
                <strong>사진 또는 짧은 영상을 업로드하세요.</strong>
                <small>JPG, PNG, HEIC, MP4 권장. 최대 8개까지 미리보기로 반영됩니다.</small>
              </label>
              <div className="asset-row">
                {(mediaAssets.length > 0 ? mediaAssets : sampleImages.map((url, index) => ({ name: `sample-${index + 1}.jpg`, type: 'image', url }))).map((asset) => (
                  <div className="asset-chip" key={asset.url}>
                    <i style={{ backgroundImage: `url(${asset.url})` }} />
                    <span>{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-block">
              <span className="eyebrow">Design inspector</span>
              <h3>{activeSection.label} 스타일</h3>
              <div className="control-grid">
                <label>포인트 색<input type="color" value={design.accent} onChange={(event) => updateDesign('accent', event.target.value)} /></label>
                <label>배경 색감<input type="color" value={design.surface} onChange={(event) => updateDesign('surface', event.target.value)} /></label>
                <label>
                  앨범 레이아웃
                  <select value={design.galleryLayout} onChange={(event) => updateDesign('galleryLayout', event.target.value)}>
                    <option value="grid">정돈된 그리드</option>
                    <option value="slide">가로 슬라이드</option>
                    <option value="pinterest">핀터레스트형</option>
                    <option value="film">필름 롤</option>
                  </select>
                </label>
                <label>
                  메인 모션
                  <select value={design.heroMotion} onChange={(event) => updateDesign('heroMotion', event.target.value)}>
                    <option value="cinematic">시네마틱 줌</option>
                    <option value="float">부유하는 카드</option>
                    <option value="still">정적인 화보</option>
                  </select>
                </label>
                <label>
                  타이포
                  <select value={design.typography} onChange={(event) => updateDesign('typography', event.target.value)}>
                    <option value="balanced">정돈된 고딕</option>
                    <option value="editorial">에디토리얼 세리프</option>
                    <option value="poster">포스터 타이포</option>
                  </select>
                </label>
                <label>
                  장식
                  <select value={design.decoration} onChange={(event) => updateDesign('decoration', event.target.value)}>
                    <option value="line">라인 드로잉</option>
                    <option value="spark">빛 입자</option>
                    <option value="paper">종이 질감</option>
                  </select>
                </label>
              </div>
            </div>
          </section>

          <aside className="preview-panel">
            <div className="preview-toolbar">
              <span>{selectedTemplate.name}</span>
              <strong>{previewStarted ? formatTime(secondsLeft) : 'Preview'}</strong>
            </div>
            <PhonePreview
              audience={audiences[selectedAudience]}
              design={design}
              form={form}
              images={previewImages}
              sections={enabledSections}
              template={selectedTemplate}
            />
          </aside>
        </div>
      </section>

      <section className="audience-section" id="preview">
        <div className="section-heading">
          <span className="eyebrow">Audience preview</span>
          <h2>최종 결과물은 하객 그룹별로 다르게 확인합니다.</h2>
        </div>
        <div className="audience-grid">
          {(Object.keys(audiences) as AudienceKey[]).map((key) => (
            <button
              className={selectedAudience === key ? 'audience-card is-active' : 'audience-card'}
              key={key}
              onClick={() => setSelectedAudience(key)}
              type="button"
            >
              <span>{audiences[key].label} 링크</span>
              <strong>{audiences[key].headline}</strong>
              <p>{audiences[key].note}</p>
              <small>{audiences[key].link}</small>
            </button>
          ))}
        </div>
        <div className="preview-gate">
          <div>
            <span className="eyebrow">5 minute preview</span>
            <h3>{previewStarted ? `남은 시간 ${formatTime(secondsLeft)}` : '무료 미리보기를 시작해 보세요.'}</h3>
            <p>미리보기는 5분 동안 열립니다. 최종 결정 후 결제 페이지에서 링크 발급을 진행합니다.</p>
          </div>
          <div>
            <button onClick={() => { setPreviewStarted(true); setSecondsLeft(300); }} type="button">5분 미리보기 시작</button>
            <button className="dark" onClick={() => setCheckoutOpen(true)} type="button">결제 페이지로 이동</button>
          </div>
        </div>
        {checkoutOpen && (
          <div className="checkout-card">
            <span className="eyebrow">Checkout</span>
            <h3>결제 대기 상태로 저장되었습니다.</h3>
            <p>{selectedTemplate.name} 템플릿과 {audiences[selectedAudience].label} 링크 설정을 기준으로 발급 준비가 완료되었습니다.</p>
            <div><strong>발급 링크</strong><span>{audiences[selectedAudience].link}</span></div>
          </div>
        )}
      </section>

      {loginOpen && (
        <div className="modal-backdrop" role="presentation">
          <section aria-label="login modal" className="login-modal">
            <span className="eyebrow">Draft access</span>
            <h2>무료 시안을 저장하고 계속 편집하세요.</h2>
            <p>로그인하면 선택한 템플릿과 입력한 정보를 보관하고, 미리보기 링크를 이어서 확인할 수 있습니다.</p>
            <button onClick={completeLogin} type="button">Google로 계속하기</button>
            <button className="ghost" onClick={() => setLoginOpen(false)} type="button">조금 더 둘러보기</button>
          </section>
        </div>
      )}
    </main>
  );
}

function PhonePreview({
  audience,
  design,
  form,
  images,
  sections,
  template,
}: {
  audience: { label: string; headline: string; note: string; link: string };
  design: {
    accent: string;
    surface: string;
    galleryLayout: string;
    heroMotion: string;
    typography: string;
    decoration: string;
  };
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
  images: string[];
  sections: InvitationSection[];
  template: Template;
}) {
  return (
    <article
      className={`phone ${template.className} layout-${design.galleryLayout} motion-${design.heroMotion} typo-${design.typography}`}
      style={
        {
          '--accent': design.accent,
          '--surface': design.surface,
          '--cover': `url(${images[0] ?? template.cover})`,
        } as CSSProperties
      }
    >
      <div className="phone-scroll">
        <section className="phone-hero">
          <div className="phone-meta">
            <span>{template.tone}</span>
            <span>{audience.label}</span>
          </div>
          <h2>{form.groom}<br />&amp; {form.bride}</h2>
          <p>{audience.headline}</p>
        </section>
        {sections.map((section) => (
          <PhoneSection
            audience={audience}
            form={form}
            images={images}
            key={section.id}
            section={section}
          />
        ))}
        <footer className="phone-footer">
          <strong>{audience.link}</strong>
          <span>Made with Issue Invite</span>
        </footer>
      </div>
    </article>
  );
}

function PhoneSection({
  audience,
  form,
  images,
  section,
}: {
  audience: { label: string; headline: string; note: string; link: string };
  form: {
    title: string;
    date: string;
    time: string;
    venue: string;
    address: string;
    greeting: string;
  };
  images: string[];
  section: InvitationSection;
}) {
  if (section.id === 'hero') {
    return null;
  }

  if (section.id === 'intro') {
    return (
      <section className="phone-section">
        <span>Invitation</span>
        <h3>{form.title}</h3>
        <p>{form.greeting}</p>
      </section>
    );
  }

  if (section.id === 'gallery') {
    return (
      <section className="phone-section">
        <span>Gallery</span>
        <div className="phone-gallery">
          {images.slice(0, 5).map((image) => <i key={image} style={{ backgroundImage: `url(${image})` }} />)}
        </div>
      </section>
    );
  }

  if (section.id === 'schedule') {
    return (
      <section className="phone-section split">
        <div><span>Date</span><strong>{form.date}</strong><small>{form.time}</small></div>
        <div><span>For</span><strong>{audience.label}</strong><small>{audience.note}</small></div>
      </section>
    );
  }

  if (section.id === 'location') {
    return (
      <section className="phone-section">
        <span>Location</span>
        <h3>{form.venue}</h3>
        <p>{form.address}</p>
        <div className="map-box">Map preview</div>
      </section>
    );
  }

  if (section.id === 'rsvp') {
    return (
      <section className="phone-section">
        <span>RSVP</span>
        <h3>{audience.label}용 참석 여부</h3>
        <button type="button">참석 여부 남기기</button>
      </section>
    );
  }

  if (section.id === 'gift') {
    return (
      <section className="phone-section">
        <span>Gift</span>
        <p>{audience.label === '친구' ? '친구 링크에서는 계좌 안내를 접어둡니다.' : '혼주와 신랑 신부 계좌를 탭으로 구분합니다.'}</p>
      </section>
    );
  }

  return (
    <section className="phone-section">
      <span>Guestbook</span>
      <p>축하 메시지는 공개 범위에 맞춰 노출됩니다.</p>
    </section>
  );
}
