"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { templates, getTemplate } from "../data/templates";
import type { Template, TemplateCategory } from "../data/templates";
import { mockInvitationData } from "../data/invitationData";
import type { InvitationData } from "../data/invitationData";
import InvitationRenderer, {
  RENDER_BLOCKS,
} from "../components/InvitationRenderer";
import type { GalleryMode, RenderBlock } from "../components/InvitationRenderer";
import PhoneFrame from "../components/PhoneFrame";

type Stage = "landing" | "auth" | "editor";
type EditorStep = "template" | "content" | "share";

interface BlockMeta {
  id: RenderBlock;
  label: string;
  note: string;
  locked?: boolean;
}

const BLOCK_META: BlockMeta[] = [
  { id: "cover", label: "커버 디자인", note: "대표 사진 · 이름 · 인트로", locked: true },
  { id: "greeting", label: "모시는 글", note: "초대 인사와 양가 혼주" },
  { id: "datetime", label: "예식 일시 · 캘린더", note: "날짜, 시간, D-day" },
  { id: "timeline", label: "우리의 이야기", note: "만남부터 결혼까지 타임라인" },
  { id: "gallery", label: "갤러리", note: "그리드 · 슬라이드 · 핀터레스트" },
  { id: "venue", label: "오시는 길", note: "예식장, 지도, 교통 안내" },
  { id: "family", label: "연락처", note: "신랑 · 신부 연락처" },
  { id: "account", label: "축의금 계좌", note: "양가 계좌, 복사하기" },
  { id: "rsvp", label: "참석 의사", note: "참석 여부 받기" },
  { id: "guestbook", label: "방명록", note: "축하 메시지" },
  { id: "notice", label: "안내 말씀", note: "공지, 식사, 주차" },
  { id: "ending", label: "엔딩", note: "마지막 사진과 공유 버튼" },
];

const INITIAL_BLOCKS: RenderBlock[] = [
  "cover",
  "greeting",
  "datetime",
  "gallery",
  "venue",
  "family",
  "account",
  "rsvp",
  "ending",
];

const GALLERY_LABEL: Record<GalleryMode, string> = {
  grid: "그리드",
  slide: "슬라이드",
  pinterest: "핀터레스트",
};

const GUEST_LINKS = [
  {
    label: "친구 링크",
    url: "issue.cards/doyun-seoyeon/friends",
    copy: "애프터파티, 갤러리, 방명록을 먼저 보여줍니다.",
  },
  {
    label: "가족·친지 링크",
    url: "issue.cards/doyun-seoyeon/family",
    copy: "혼주 정보, 주차, 계좌 안내를 자세히 노출합니다.",
  },
  {
    label: "일반 지인 링크",
    url: "issue.cards/doyun-seoyeon/guest",
    copy: "예식 일시·장소와 참석 의사를 가장 먼저 보여줍니다.",
  },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [filter, setFilter] = useState<"all" | TemplateCategory>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);

  // editor state
  const [step, setStep] = useState<EditorStep>("template");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [enabled, setEnabled] = useState<RenderBlock[]>(INITIAL_BLOCKS);
  const [openBlock, setOpenBlock] = useState<RenderBlock>("cover");
  const [galleryMode, setGalleryMode] = useState<GalleryMode>("pinterest");
  const [draft, setDraft] = useState<InvitationData>(mockInvitationData);
  const [finalized, setFinalized] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  const visibleTemplates = useMemo(
    () => (filter === "all" ? templates : templates.filter((t) => t.category === filter)),
    [filter],
  );

  const scrollPreviewTo = useCallback((key: RenderBlock) => {
    window.requestAnimationFrame(() => {
      previewRef.current
        ?.querySelector(`#sec-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const goAuth = () => {
    setStage("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditor = (id?: string) => {
    if (id) setTemplateId(id);
    setStage("auth");
    if (id) setPreviewId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeAuth = () => {
    setStage("editor");
    setStep("template");
  };

  const chooseTemplate = (id: string) => {
    setTemplateId(id);
    setFinalized(false);
  };

  const toggleBlock = (id: RenderBlock) => {
    setEnabled((cur) =>
      cur.includes(id) ? cur.filter((b) => b !== id) : [...cur, id],
    );
    setFinalized(false);
  };

  const openSection = (id: RenderBlock) => {
    setOpenBlock(id);
    scrollPreviewTo(id);
  };

  // immutable updaters
  const setCover = (k: keyof InvitationData["cover"], v: string) =>
    setDraft((d) => ({ ...d, cover: { ...d.cover, [k]: v } }));
  const setGreeting = (k: keyof InvitationData["greeting"], v: string) =>
    setDraft((d) => ({ ...d, greeting: { ...d.greeting, [k]: v } }));
  const setVenue = (k: keyof InvitationData["venue"], v: string) =>
    setDraft((d) => ({ ...d, venue: { ...d.venue, [k]: v } }));
  const setPerson = (
    side: "groom" | "bride",
    k: keyof InvitationData["couple"]["groom"],
    v: string,
  ) =>
    setDraft((d) => ({
      ...d,
      couple: { ...d.couple, [side]: { ...d.couple[side], [k]: v } },
    }));
  const setTop = (k: "dateLabel" | "ending" | "music", v: string) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const previewTemplate = previewId ? getTemplate(previewId) : null;

  // ───────────────────────────────────────────── EDITOR ─────────────────
  if (stage === "editor") {
    return (
      <main className="editor">
        <header className="editor__top">
          <strong className="editor__brand">Issue</strong>
          <div className="editor__url">
            <span>issue.cards/doyun-seoyeon</span>
            <button type="button" onClick={() => navigator.clipboard?.writeText("issue.cards/doyun-seoyeon")}>복사</button>
          </div>
          <button
            type="button"
            className="editor__issue"
            onClick={() => {
              setFinalized(true);
              setStep("share");
            }}
          >
            최종 결정하고 링크 발급
          </button>
        </header>

        <div className="editor__body">
          <nav className="editor__rail">
            {([
              ["template", "디자인"],
              ["content", "내용 편집"],
              ["share", "공유"],
            ] as [EditorStep, string][]).map(([key, label], i) => (
              <button
                key={key}
                type="button"
                className={step === key ? "is-active" : ""}
                onClick={() => setStep(key)}
              >
                <i>{i + 1}</i>
                {label}
              </button>
            ))}
            <div className="editor__rail-foot">
              <button type="button" onClick={() => setStage("landing")}>
                ← 나가기
              </button>
            </div>
          </nav>

          <section className="editor__panel">
            {step === "template" && (
              <>
                <span className="editor__eyebrow">Step 1 · 디자인 선택</span>
                <h2>마음에 드는 템플릿부터 고르세요.</h2>
                <p>선택하면 오른쪽 미리보기가 즉시 바뀝니다. 정통 15종 · 매거진 15종.</p>
                <div className="mini-grid">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={templateId === t.id ? "mini is-selected" : "mini"}
                      onClick={() => chooseTemplate(t.id)}
                      style={{ "--photo": `url(${t.coverPhoto})` } as CSSProperties}
                    >
                      <span className="mini__tag">
                        {t.category === "classic" ? "정통" : "매거진"}
                      </span>
                      <strong>{t.name}</strong>
                    </button>
                  ))}
                </div>
                <button className="editor__next" type="button" onClick={() => setStep("content")}>
                  이 디자인으로 내용 편집하기 →
                </button>
              </>
            )}

            {step === "content" && (
              <>
                <span className="editor__eyebrow">Step 2 · 내용 편집</span>
                <h2>블록을 켜고, 내용을 채우세요.</h2>
                <p>제목을 누르면 미리보기가 해당 영역으로 따라갑니다.</p>
                <div className="accordion">
                  {BLOCK_META.map((block) => {
                    const isOn = enabled.includes(block.id);
                    const isOpen = openBlock === block.id;
                    return (
                      <article key={block.id} className={isOpen ? "acc is-open" : "acc"}>
                        <div className="acc__head">
                          <button
                            type="button"
                            className="acc__title"
                            onClick={() => openSection(block.id)}
                          >
                            <strong>{block.label}</strong>
                            <small>{block.note}</small>
                          </button>
                          {block.locked ? (
                            <span className="acc__lock">필수</span>
                          ) : (
                            <button
                              type="button"
                              className={isOn ? "acc__switch is-on" : "acc__switch"}
                              onClick={() => toggleBlock(block.id)}
                              aria-label="블록 켜기/끄기"
                            >
                              <i />
                            </button>
                          )}
                        </div>
                        {isOpen && (
                          <div className="acc__body">
                            <BlockFields
                              id={block.id}
                              draft={draft}
                              galleryMode={galleryMode}
                              setGalleryMode={setGalleryMode}
                              setCover={setCover}
                              setGreeting={setGreeting}
                              setVenue={setVenue}
                              setPerson={setPerson}
                              setTop={setTop}
                            />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {step === "share" && (
              <>
                <span className="editor__eyebrow">Step 3 · 공유</span>
                <h2>하객 그룹마다 다른 링크를 발급합니다.</h2>
                <p>같은 청첩장이지만 그룹별로 먼저 보이는 정보가 달라집니다.</p>
                {!finalized ? (
                  <button
                    type="button"
                    className="editor__next"
                    onClick={() => setFinalized(true)}
                  >
                    최종 결정하고 링크 발급하기
                  </button>
                ) : (
                  <div className="links">
                    {GUEST_LINKS.map((l) => (
                      <article key={l.url}>
                        <span>{l.label}</span>
                        <div>
                          <strong>{l.url}</strong>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard?.writeText(l.url)}
                          >
                            복사
                          </button>
                        </div>
                        <p>{l.copy}</p>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="editor__preview">
            <PhoneFrame ref={previewRef} label={template.name}>
              <InvitationRenderer
                template={template}
                data={draft}
                enabledBlocks={enabled}
                galleryMode={galleryMode}
                activeBlock={step === "content" ? openBlock : null}
              />
            </PhoneFrame>
          </aside>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────── AUTH ───────────────────
  if (stage === "auth") {
    return (
      <main className="auth">
        <div className="gcard">
          <div className="gcard__head">
            <GoogleMark />
            <span>Google 계정으로 로그인</span>
          </div>
          <h2>Issue에 로그인</h2>
          <p className="gcard__sub">계정을 선택해 시안을 저장하고 에디터로 이동합니다.</p>
          <button type="button" className="gacct" onClick={completeAuth}>
            <span className="gacct__avatar">D</span>
            <span className="gacct__info">
              <strong>도윤 · 서연</strong>
              <small>chaos_quit@naver.com</small>
            </span>
          </button>
          <button type="button" className="gacct gacct--add" onClick={completeAuth}>
            <span className="gacct__plus">+</span>
            다른 계정 사용
          </button>
          <p className="gcard__scope">
            계속 진행하면 Issue가 프로필, 시안 저장, 링크 발급에 필요한 정보를
            사용하는 데 동의하게 됩니다.
          </p>
          <div className="gcard__actions">
            <button type="button" className="ghost" onClick={() => setStage("landing")}>
              취소
            </button>
            <button type="button" className="gprimary" onClick={completeAuth}>
              계속
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────── LANDING ────────────────
  return (
    <main className="land">
      <nav className="land__nav">
        <a href="#top" className="land__brand">Issue</a>
        <div className="land__links">
          <a href="#showroom">샘플</a>
          <a href="#start">제작</a>
        </div>
        <button type="button" onClick={goAuth}>나만의 시안 만들기</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero__copy">
          <span className="hero__eyebrow">Premium mobile wedding invitation</span>
          <h1>
            하객마다 다른 링크,
            <br />
            <em>잡지처럼 완성되는</em>
            <br />
            모바일 청첩장.
          </h1>
          <p>
            실제 웨딩 사진이 살아나는 30가지 디자인. 친구·가족·지인에게 각각 다른
            링크를 보내고, 잡지를 넘기듯 완성하세요.
          </p>
          <div className="hero__cta">
            <a href="#showroom">완성된 샘플 보기</a>
            <button type="button" onClick={goAuth}>나만의 시안 만들기</button>
          </div>
        </div>

        <div className="river" aria-label="대표 샘플 슬라이더">
          <div className="river__track">
            {[...templates.slice(0, 12), ...templates.slice(0, 12)].map((t, i) => (
              <button
                key={`${t.id}-${i}`}
                type="button"
                className="river__card"
                onClick={() => setPreviewId(t.id)}
                style={
                  {
                    "--photo": `url(${t.coverPhoto})`,
                    "--accent": t.palette.accent,
                  } as CSSProperties
                }
              >
                <span>{t.tag}</span>
                <strong>{t.name}</strong>
                <small>{t.kicker}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM */}
      <section className="showroom" id="showroom">
        <div className="showroom__head">
          <span className="hero__eyebrow">30 ready-made directions</span>
          <h2>완성된 샘플을 먼저 보고, 마음에 드는 방향에서 시작하세요.</h2>
          <p>정통 모바일 청첩장 15종과 잡지형 모바일 청첩장 15종. 카드를 누르면 실제 웨딩 사진으로 미리 볼 수 있어요.</p>
          <div className="showroom__filter">
            {(["all", "classic", "magazine"] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={filter === f ? "is-active" : ""}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "전체 30종" : f === "classic" ? "정통 15종" : "매거진 15종"}
              </button>
            ))}
          </div>
        </div>

        <div className="showroom__grid">
          {visibleTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              className="card"
              onClick={() => setPreviewId(t.id)}
              style={
                {
                  "--photo": `url(${t.coverPhoto})`,
                  "--accent": t.palette.accent,
                  "--paper": t.palette.paper,
                  "--ink": t.palette.ink,
                } as CSSProperties
              }
            >
              <div className="card__photo">
                <span className="card__badge">{t.tag}</span>
                {t.category === "magazine" && (
                  <span className="card__label">{t.accentLabel}</span>
                )}
              </div>
              <div className="card__foot">
                <strong>{t.name}</strong>
                <small>{t.description}</small>
                <span className="card__source">{t.source}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* START */}
      <section className="start" id="start">
        <span className="hero__eyebrow">Start your own issue</span>
        <h2>나만의 시안 만들기</h2>
        <p>
          템플릿을 고르고, 사진·일정·장소·가족·갤러리·참석 의사까지 순서대로
          편집하면 됩니다. 미리보기는 편집과 동시에 실시간으로 완성됩니다.
        </p>
        <button type="button" className="start__btn" onClick={goAuth}>
          <GoogleMark />
          Google로 시작하기
        </button>
        <small className="start__note">최종 결정하면 곧바로 하객별 링크가 발급됩니다.</small>
      </section>

      <footer className="land__foot">
        <span>Issue</span>
        <small>실제 웨딩 사진으로 완성하는 잡지형 모바일 청첩장 스튜디오</small>
      </footer>

      {/* PREVIEW MODAL */}
      {previewTemplate && (
        <div className="modal" role="dialog" aria-modal onClick={() => setPreviewId(null)}>
          <div className="modal__inner" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" type="button" onClick={() => setPreviewId(null)}>
              ✕
            </button>
            <PhoneFrame label={previewTemplate.name}>
              <InvitationRenderer
                template={previewTemplate}
                data={mockInvitationData}
                enabledBlocks={[...RENDER_BLOCKS]}
                galleryMode="pinterest"
              />
            </PhoneFrame>
            <div className="modal__side">
              <span className="modal__tag">{previewTemplate.tag}</span>
              <h3>{previewTemplate.name}</h3>
              <p>{previewTemplate.description}</p>
              <span className="modal__src">참고 무드 · {previewTemplate.source}</span>
              <button type="button" onClick={() => startEditor(previewTemplate.id)}>
                이 디자인으로 시안 만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ───────────────────────────────────────── BLOCK FIELDS ──────────────────
function BlockFields({
  id,
  draft,
  galleryMode,
  setGalleryMode,
  setCover,
  setGreeting,
  setVenue,
  setPerson,
  setTop,
}: {
  id: RenderBlock;
  draft: InvitationData;
  galleryMode: GalleryMode;
  setGalleryMode: (m: GalleryMode) => void;
  setCover: (k: keyof InvitationData["cover"], v: string) => void;
  setGreeting: (k: keyof InvitationData["greeting"], v: string) => void;
  setVenue: (k: keyof InvitationData["venue"], v: string) => void;
  setPerson: (
    s: "groom" | "bride",
    k: keyof InvitationData["couple"]["groom"],
    v: string,
  ) => void;
  setTop: (k: "dateLabel" | "ending" | "music", v: string) => void;
}) {
  if (id === "cover") {
    return (
      <div className="fields">
        <label>
          잡지 제목
          <input value={draft.cover.title} onChange={(e) => setCover("title", e.target.value)} />
        </label>
        <label>
          영문 라벨 (비우면 템플릿 기본값)
          <input value={draft.cover.kicker} placeholder="We're getting married" onChange={(e) => setCover("kicker", e.target.value)} />
        </label>
        <div className="fields__row">
          <label>
            신랑
            <input value={draft.cover.groom} onChange={(e) => setCover("groom", e.target.value)} />
          </label>
          <label>
            신부
            <input value={draft.cover.bride} onChange={(e) => setCover("bride", e.target.value)} />
          </label>
        </div>
      </div>
    );
  }
  if (id === "greeting") {
    return (
      <div className="fields">
        <label>
          제목
          <input value={draft.greeting.title} onChange={(e) => setGreeting("title", e.target.value)} />
        </label>
        <label>
          모시는 글
          <textarea rows={6} value={draft.greeting.content} onChange={(e) => setGreeting("content", e.target.value)} />
        </label>
        <div className="fields__row">
          <label>
            신랑 부 · 모
            <input value={`${draft.couple.groom.father}`} onChange={(e) => setPerson("groom", "father", e.target.value)} />
          </label>
          <label>
            신부 부 · 모
            <input value={`${draft.couple.bride.father}`} onChange={(e) => setPerson("bride", "father", e.target.value)} />
          </label>
        </div>
      </div>
    );
  }
  if (id === "datetime") {
    return (
      <div className="fields">
        <label>
          예식 일시 (표시 문구)
          <input value={draft.dateLabel} onChange={(e) => setTop("dateLabel", e.target.value)} />
        </label>
        <p className="fields__hint">캘린더와 D-day는 일시에 맞춰 자동으로 표시됩니다.</p>
      </div>
    );
  }
  if (id === "gallery") {
    return (
      <div className="fields">
        <span className="fields__label">갤러리 형태</span>
        <div className="seg">
          {(Object.keys(GALLERY_LABEL) as GalleryMode[]).map((m) => (
            <button key={m} type="button" className={galleryMode === m ? "is-active" : ""} onClick={() => setGalleryMode(m)}>
              {GALLERY_LABEL[m]}
            </button>
          ))}
        </div>
        <p className="fields__hint">실제 웨딩 사진 {draft.gallery.length}장이 적용되어 있습니다.</p>
      </div>
    );
  }
  if (id === "venue") {
    return (
      <div className="fields">
        <label>
          예식장
          <input value={draft.venue.name} onChange={(e) => setVenue("name", e.target.value)} />
        </label>
        <label>
          홀 / 층
          <input value={draft.venue.hall} onChange={(e) => setVenue("hall", e.target.value)} />
        </label>
        <label>
          주소
          <input value={draft.venue.address} onChange={(e) => setVenue("address", e.target.value)} />
        </label>
      </div>
    );
  }
  if (id === "family") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>
            신랑 연락처
            <input value={draft.couple.groom.phone} onChange={(e) => setPerson("groom", "phone", e.target.value)} />
          </label>
          <label>
            신부 연락처
            <input value={draft.couple.bride.phone} onChange={(e) => setPerson("bride", "phone", e.target.value)} />
          </label>
        </div>
      </div>
    );
  }
  if (id === "account") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>
            신랑 은행
            <input value={draft.couple.groom.bank} onChange={(e) => setPerson("groom", "bank", e.target.value)} />
          </label>
          <label>
            신랑 계좌
            <input value={draft.couple.groom.account} onChange={(e) => setPerson("groom", "account", e.target.value)} />
          </label>
        </div>
        <div className="fields__row">
          <label>
            신부 은행
            <input value={draft.couple.bride.bank} onChange={(e) => setPerson("bride", "bank", e.target.value)} />
          </label>
          <label>
            신부 계좌
            <input value={draft.couple.bride.account} onChange={(e) => setPerson("bride", "account", e.target.value)} />
          </label>
        </div>
      </div>
    );
  }
  if (id === "ending") {
    return (
      <div className="fields">
        <label>
          엔딩 글귀
          <textarea rows={3} value={draft.ending} onChange={(e) => setTop("ending", e.target.value)} />
        </label>
      </div>
    );
  }
  return (
    <p className="fields__hint">
      이 블록은 추천 구성으로 자동 채워집니다. 켜고 끄며 미리보기에서 확인하세요.
    </p>
  );
}

function GoogleMark() {
  return (
    <svg className="gmark" viewBox="0 0 48 48" aria-hidden width="18" height="18">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
