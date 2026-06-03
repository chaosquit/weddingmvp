"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { templates, getTemplate } from "../data/templates";
import { mockInvitationData } from "../data/invitationData";
import type { InvitationData } from "../data/invitationData";
import InvitationRenderer, { RENDER_BLOCKS } from "../components/InvitationRenderer";
import type { RenderBlock, EditKey } from "../components/InvitationRenderer";

type Stage = "landing" | "auth" | "editor";
type EditorStep = "template" | "content" | "share";

interface BlockMeta {
  id: RenderBlock;
  label: string;
  note: string;
  locked?: boolean;
}

const BLOCK_META: BlockMeta[] = [
  { id: "cover", label: "커버 / 히어로", note: "컨셉별 대표 화면", locked: true },
  { id: "greeting", label: "모시는 글", note: "초대 인사와 양가 혼주" },
  { id: "datetime", label: "예식 일시 · 캘린더", note: "날짜, 시간, D-day, 캘린더 저장" },
  { id: "gallery", label: "갤러리", note: "사진 (탭하면 확대)" },
  { id: "venue", label: "오시는 길", note: "예식장, 교통, 주소 복사" },
  { id: "family", label: "연락처", note: "신랑 · 신부 연락처" },
  { id: "account", label: "축의금 계좌", note: "양가 계좌, 복사하기" },
  { id: "rsvp", label: "참석 의사", note: "RSVP 폼" },
  { id: "guestbook", label: "방명록", note: "축하 메시지" },
  { id: "notice", label: "안내 말씀", note: "공지 · 식사 · 주차" },
  { id: "ending", label: "엔딩", note: "마지막 문장과 공유 버튼" },
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

const GUEST_LINKS = [
  { label: "친구 링크", url: "issue.cards/doyun-seoyeon/friends", copy: "애프터파티 · 갤러리 · 방명록을 먼저 보여줍니다." },
  { label: "가족·친지 링크", url: "issue.cards/doyun-seoyeon/family", copy: "혼주 정보 · 주차 · 계좌 안내를 자세히 노출합니다." },
  { label: "일반 지인 링크", url: "issue.cards/doyun-seoyeon/guest", copy: "예식 일시·장소와 참석 의사를 가장 먼저 보여줍니다." },
];

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [step, setStep] = useState<EditorStep>("template");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [enabled, setEnabled] = useState<RenderBlock[]>(INITIAL_BLOCKS);
  const [openBlock, setOpenBlock] = useState<RenderBlock>("cover");
  const [draft, setDraft] = useState<InvitationData>(mockInvitationData);
  const [finalized, setFinalized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const template = useMemo(() => getTemplate(templateId), [templateId]);

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
    setPreviewId(null);
    setStage("auth");
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
    setEnabled((cur) => (cur.includes(id) ? cur.filter((b) => b !== id) : [...cur, id]));
    setFinalized(false);
  };
  const openSection = (id: RenderBlock) => {
    setOpenBlock(id);
    scrollPreviewTo(id);
  };
  const selectFromPreview = useCallback((id: RenderBlock) => {
    setStep("content");
    setOpenBlock(id);
    window.requestAnimationFrame(() => {
      document.getElementById(`acc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

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
  ) => setDraft((d) => ({ ...d, couple: { ...d.couple, [side]: { ...d.couple[side], [k]: v } } }));
  const setTop = (k: "dateLabel" | "ending", v: string) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const applyEdit = useCallback((key: EditKey, value: string) => {
    setDraft((d) => {
      switch (key) {
        case "cover.groom": return { ...d, cover: { ...d.cover, groom: value } };
        case "cover.bride": return { ...d, cover: { ...d.cover, bride: value } };
        case "cover.title": return { ...d, cover: { ...d.cover, title: value } };
        case "greeting.title": return { ...d, greeting: { ...d.greeting, title: value } };
        case "greeting.content": return { ...d, greeting: { ...d.greeting, content: value } };
        case "dateLabel": return { ...d, dateLabel: value };
        case "venue.name": return { ...d, venue: { ...d.venue, name: value } };
        case "venue.hall": return { ...d, venue: { ...d.venue, hall: value } };
        case "venue.address": return { ...d, venue: { ...d.venue, address: value } };
        case "ending": return { ...d, ending: value };
        default: return d;
      }
    });
    setFinalized(false);
  }, []);

  const previewTemplate = previewId ? getTemplate(previewId) : null;

  // ───────────────────────────── EDITOR ─────────────────────────────
  if (stage === "editor") {
    return (
      <main className="editor">
        <header className="editor__top">
          <strong className="editor__brand">Issue</strong>
          <div className="editor__url">
            <span>issue.cards/doyun-seoyeon</span>
            <button type="button" onClick={() => navigator.clipboard?.writeText("issue.cards/doyun-seoyeon")}>복사</button>
          </div>
          <button type="button" className="editor__ghostbtn" onClick={() => setFullscreen(true)}>
            전체 미리보기
          </button>
          <button
            type="button"
            className="editor__issue"
            onClick={() => {
              setFinalized(true);
              setStep("share");
            }}
          >
            최종 결정 · 링크 발급
          </button>
        </header>

        <div className="editor__body">
          <nav className="editor__rail">
            {([
              ["template", "디자인"],
              ["content", "내용 편집"],
              ["share", "공유"],
            ] as [EditorStep, string][]).map(([key, label], i) => (
              <button key={key} type="button" className={step === key ? "is-active" : ""} onClick={() => setStep(key)}>
                <i>{String(i + 1).padStart(2, "0")}</i>
                {label}
              </button>
            ))}
            <div className="editor__rail-foot">
              <button type="button" onClick={() => setStage("landing")}>← 나가기</button>
            </div>
          </nav>

          <section className="editor__panel">
            {step === "template" && (
              <>
                <span className="editor__eyebrow">Step 01 · Design</span>
                <h2>세상에 없던 컨셉부터 고르세요.</h2>
                <p>신문 · 만화 · 보그 · 필름 · 보딩패스 · 포스터 등 {templates.length}가지 컨셉. 선택하면 오른쪽 미리보기가 즉시 바뀝니다.</p>
                <div className="mini-grid">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={templateId === t.id ? "mini is-selected" : "mini"}
                      onClick={() => chooseTemplate(t.id)}
                      style={{ "--photo": `url(${t.coverPhoto})` } as CSSProperties}
                    >
                      <span className="mini__tag">{t.family === "fashion" ? "FASHION" : "EDITORIAL"}</span>
                      <strong>{t.name}</strong>
                    </button>
                  ))}
                </div>
                <button className="editor__next" type="button" onClick={() => setStep("content")}>
                  이 컨셉으로 내용 편집 →
                </button>
              </>
            )}

            {step === "content" && (
              <>
                <span className="editor__eyebrow">Step 02 · Content</span>
                <h2>블록을 켜고 내용을 채우세요.</h2>
                <p>제목을 누르면 미리보기가 따라가고, 미리보기의 글자를 직접 눌러 고칠 수도 있어요.</p>
                <div className="accordion">
                  {BLOCK_META.map((block) => {
                    const isOn = enabled.includes(block.id);
                    const isOpen = openBlock === block.id;
                    return (
                      <article key={block.id} id={`acc-${block.id}`} className={isOpen ? "acc is-open" : "acc"}>
                        <div className="acc__head">
                          <button type="button" className="acc__title" onClick={() => openSection(block.id)}>
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
                <span className="editor__eyebrow">Step 03 · Share</span>
                <h2>하객 그룹마다 다른 링크.</h2>
                <p>같은 청첩장이지만 그룹별로 먼저 보이는 정보가 달라집니다.</p>
                {!finalized ? (
                  <button type="button" className="editor__next" onClick={() => setFinalized(true)}>
                    최종 결정하고 링크 발급
                  </button>
                ) : (
                  <div className="links">
                    {GUEST_LINKS.map((l) => (
                      <article key={l.url}>
                        <span>{l.label}</span>
                        <div>
                          <strong>{l.url}</strong>
                          <button type="button" onClick={() => navigator.clipboard?.writeText(l.url)}>복사</button>
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
            <div className="canvas-wrap">
              <span className="canvas-tab">미리보기 · 본문 글자를 눌러 바로 수정</span>
              <div className="canvas" ref={previewRef}>
                <InvitationRenderer
                  template={template}
                  data={draft}
                  enabledBlocks={enabled}
                  activeBlock={step === "content" ? openBlock : null}
                  editable
                  onSelectBlock={selectFromPreview}
                  onEdit={applyEdit}
                />
              </div>
            </div>
          </aside>
        </div>

        {fullscreen && (
          <div className="fs" role="dialog" aria-modal>
            <div className="fs__bar">
              <strong>{template.name}</strong>
              <span>실제 하객이 보게 될 화면</span>
              <button type="button" onClick={() => setFullscreen(false)}>닫기 ✕</button>
            </div>
            <div className="fs__scroll">
              <div className="canvas canvas--fs">
                <InvitationRenderer template={template} data={draft} enabledBlocks={enabled} />
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // ───────────────────────────── AUTH ─────────────────────────────
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
            계속 진행하면 Issue가 프로필, 시안 저장, 링크 발급에 필요한 정보를 사용하는 데 동의하게 됩니다.
          </p>
          <div className="gcard__actions">
            <button type="button" className="ghost" onClick={() => setStage("landing")}>취소</button>
            <button type="button" className="gprimary" onClick={completeAuth}>계속</button>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────── LANDING ─────────────────────────────
  return (
    <main className="land">
      <nav className="land__nav">
        <a href="#top" className="land__brand">Issue</a>
        <div className="land__links">
          <a href="#showroom">컨셉</a>
          <a href="#start">제작</a>
        </div>
        <button type="button" onClick={goAuth}>나만의 시안 만들기</button>
      </nav>

      <section className="hero" id="top">
        <div className="hero__copy">
          <span className="hero__eyebrow">Editorial mobile wedding invitation</span>
          <h1>
            하객마다 다른 링크,
            <br />
            <em>세상에 없던 컨셉</em>의
            <br />
            모바일 청첩장.
          </h1>
          <p>
            신문 · 만화 · 보그 · 필름 · 보딩패스 · 포스터까지. 실제 웨딩 사진을
            잡지처럼 편집해, 친구·가족·지인에게 각각 다른 링크를 보내세요.
          </p>
          <div className="hero__cta">
            <a href="#showroom">컨셉 둘러보기</a>
            <button type="button" onClick={goAuth}>나만의 시안 만들기</button>
          </div>
        </div>

        <div className="river" aria-label="대표 컨셉 슬라이더">
          <div className="river__track">
            {[...templates, ...templates].map((t, i) => (
              <button
                key={`${t.id}-${i}`}
                type="button"
                className="river__card"
                onClick={() => setPreviewId(t.id)}
                style={{ "--photo": `url(${t.coverPhoto})` } as CSSProperties}
              >
                <span>{t.family === "fashion" ? "FASHION" : "EDITORIAL"}</span>
                <strong>{t.name}</strong>
                <small>{t.blurb}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="showroom" id="showroom">
        <div className="showroom__head">
          <span className="hero__eyebrow">{templates.length} concepts, one of a kind</span>
          <h2>완성된 컨셉을 먼저 보고, 마음에 드는 방향에서 시작하세요.</h2>
          <p>클래식·매거진 같은 구분은 없앴습니다. 각각이 하나의 잡지처럼 완결된 컨셉이에요. 카드를 누르면 실제 웨딩 사진으로 미리 볼 수 있습니다.</p>
        </div>

        <div className="showroom__grid">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className="card"
              onClick={() => setPreviewId(t.id)}
              style={{ "--photo": `url(${t.coverPhoto})` } as CSSProperties}
            >
              <div className="card__photo">
                <span className="card__badge">{t.family === "fashion" ? "FASHION" : "EDITORIAL"}</span>
              </div>
              <div className="card__foot">
                <strong>{t.name}</strong>
                <small>{t.blurb}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="start" id="start">
        <span className="hero__eyebrow">Start your own issue</span>
        <h2>나만의 시안 만들기</h2>
        <p>컨셉을 고르고 사진·일정·장소·가족·갤러리·참석 의사까지 편집하면, 미리보기가 실시간으로 완성됩니다.</p>
        <button type="button" className="start__btn" onClick={goAuth}>
          <GoogleMark />
          Google로 시작하기
        </button>
        <small className="start__note">최종 결정하면 곧바로 하객별 링크가 발급됩니다.</small>
      </section>

      <footer className="land__foot">
        <span>Issue</span>
        <small>실제 웨딩 사진으로 완성하는 에디토리얼 모바일 청첩장 스튜디오</small>
      </footer>

      {previewTemplate && (
        <div className="modal" role="dialog" aria-modal onClick={() => setPreviewId(null)}>
          <div className="modal__inner" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" type="button" onClick={() => setPreviewId(null)}>✕</button>
            <div className="canvas canvas--modal">
              <InvitationRenderer
                template={previewTemplate}
                data={mockInvitationData}
                enabledBlocks={[...RENDER_BLOCKS]}
              />
            </div>
            <div className="modal__side">
              <span className="modal__tag">{previewTemplate.family === "fashion" ? "FASHION" : "EDITORIAL"}</span>
              <h3>{previewTemplate.name}</h3>
              <p>{previewTemplate.blurb}</p>
              <button type="button" onClick={() => startEditor(previewTemplate.id)}>이 컨셉으로 시안 만들기</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─────────────────────────── BLOCK FIELDS ───────────────────────────
function BlockFields({
  id,
  draft,
  setCover,
  setGreeting,
  setVenue,
  setPerson,
  setTop,
}: {
  id: RenderBlock;
  draft: InvitationData;
  setCover: (k: keyof InvitationData["cover"], v: string) => void;
  setGreeting: (k: keyof InvitationData["greeting"], v: string) => void;
  setVenue: (k: keyof InvitationData["venue"], v: string) => void;
  setPerson: (s: "groom" | "bride", k: keyof InvitationData["couple"]["groom"], v: string) => void;
  setTop: (k: "dateLabel" | "ending", v: string) => void;
}) {
  if (id === "cover") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>신랑<input value={draft.cover.groom} onChange={(e) => setCover("groom", e.target.value)} /></label>
          <label>신부<input value={draft.cover.bride} onChange={(e) => setCover("bride", e.target.value)} /></label>
        </div>
        <label>제목 (일부 컨셉에 노출)<input value={draft.cover.title} onChange={(e) => setCover("title", e.target.value)} /></label>
      </div>
    );
  }
  if (id === "greeting") {
    return (
      <div className="fields">
        <label>제목<input value={draft.greeting.title} onChange={(e) => setGreeting("title", e.target.value)} /></label>
        <label>모시는 글<textarea rows={6} value={draft.greeting.content} onChange={(e) => setGreeting("content", e.target.value)} /></label>
        <div className="fields__row">
          <label>신랑 아버지<input value={draft.couple.groom.father} onChange={(e) => setPerson("groom", "father", e.target.value)} /></label>
          <label>신부 아버지<input value={draft.couple.bride.father} onChange={(e) => setPerson("bride", "father", e.target.value)} /></label>
        </div>
      </div>
    );
  }
  if (id === "datetime") {
    return (
      <div className="fields">
        <label>예식 일시 (표시 문구)<input value={draft.dateLabel} onChange={(e) => setTop("dateLabel", e.target.value)} /></label>
        <p className="fields__hint">캘린더 · D-day · 캘린더 저장 버튼이 자동으로 연동됩니다.</p>
      </div>
    );
  }
  if (id === "venue") {
    return (
      <div className="fields">
        <label>예식장<input value={draft.venue.name} onChange={(e) => setVenue("name", e.target.value)} /></label>
        <label>홀 / 층<input value={draft.venue.hall} onChange={(e) => setVenue("hall", e.target.value)} /></label>
        <label>주소<input value={draft.venue.address} onChange={(e) => setVenue("address", e.target.value)} /></label>
      </div>
    );
  }
  if (id === "family") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>신랑 연락처<input value={draft.couple.groom.phone} onChange={(e) => setPerson("groom", "phone", e.target.value)} /></label>
          <label>신부 연락처<input value={draft.couple.bride.phone} onChange={(e) => setPerson("bride", "phone", e.target.value)} /></label>
        </div>
      </div>
    );
  }
  if (id === "account") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>신랑 은행<input value={draft.couple.groom.bank} onChange={(e) => setPerson("groom", "bank", e.target.value)} /></label>
          <label>신랑 계좌<input value={draft.couple.groom.account} onChange={(e) => setPerson("groom", "account", e.target.value)} /></label>
        </div>
        <div className="fields__row">
          <label>신부 은행<input value={draft.couple.bride.bank} onChange={(e) => setPerson("bride", "bank", e.target.value)} /></label>
          <label>신부 계좌<input value={draft.couple.bride.account} onChange={(e) => setPerson("bride", "account", e.target.value)} /></label>
        </div>
      </div>
    );
  }
  if (id === "ending") {
    return (
      <div className="fields">
        <label>엔딩 글귀<textarea rows={3} value={draft.ending} onChange={(e) => setTop("ending", e.target.value)} /></label>
      </div>
    );
  }
  return <p className="fields__hint">이 블록은 추천 구성으로 자동 채워집니다. 켜고 끄며 미리보기에서 확인하세요.</p>;
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
