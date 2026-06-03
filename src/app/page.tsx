"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { templates, getTemplate } from "../data/templates";
import { mockInvitationData } from "../data/invitationData";
import type { InvitationData, MediaItem, Person, TimelineItem } from "../data/invitationData";
import InvitationRenderer, {
  RENDER_BLOCKS,
  type EditKey,
  type InvitationStyle,
  type RenderBlock,
} from "../components/InvitationRenderer";

type Stage = "landing" | "auth" | "editor";
type EditorStep = "template" | "content" | "share";

interface BlockMeta {
  id: RenderBlock;
  label: string;
  note: string;
  locked?: boolean;
}

const BLOCK_META: BlockMeta[] = [
  { id: "cover", label: "커버 / 히어로", note: "대표 사진, 영상, 이름, 첫 문장", locked: true },
  { id: "greeting", label: "초대 문구", note: "인사말과 양가 정보" },
  { id: "datetime", label: "예식 일시", note: "날짜, 시간, D-day, 캘린더 저장" },
  { id: "gallery", label: "갤러리", note: "사진과 영상을 직접 업로드" },
  { id: "story", label: "여정 스토리", note: "스크롤에 따라 이어지는 장면 블록" },
  { id: "venue", label: "오시는 길", note: "예식장, 주소, 교통, 지도" },
  { id: "family", label: "연락처", note: "신랑 · 신부 연락처" },
  { id: "account", label: "마음 전하실 곳", note: "계좌 안내와 복사 버튼" },
  { id: "rsvp", label: "참석 의사", note: "하객 응답 폼" },
  { id: "guestbook", label: "방명록", note: "축하 메시지 영역" },
  { id: "notice", label: "안내 말씀", note: "화환, 식사, 주차 등" },
  { id: "ending", label: "엔딩", note: "마지막 문장과 공유 버튼" },
];

const INITIAL_BLOCKS: RenderBlock[] = [
  "cover",
  "greeting",
  "datetime",
  "gallery",
  "story",
  "venue",
  "family",
  "account",
  "rsvp",
  "notice",
  "ending",
];

const GUEST_LINKS = [
  {
    label: "친구용 링크",
    url: "issue.cards/doyun-seoyeon/friends",
    copy: "갤러리와 방명록을 먼저 보여주는 가벼운 링크",
  },
  {
    label: "가족 · 친지용 링크",
    url: "issue.cards/doyun-seoyeon/family",
    copy: "예식 정보, 주차, 계좌 안내를 더 명확히 보여주는 링크",
  },
  {
    label: "일반 하객용 링크",
    url: "issue.cards/doyun-seoyeon/guest",
    copy: "날짜, 장소, 참석 의사를 중심으로 구성된 링크",
  },
];

const STYLE_PRESETS = [
  { label: "Warm", accent: "#9f735b", paper: "#fbf7ef", ink: "#231f1a" },
  { label: "Garden", accent: "#587260", paper: "#f5f3ea", ink: "#22241f" },
  { label: "Rose", accent: "#9a6f6a", paper: "#fbf6f2", ink: "#251e1d" },
  { label: "Blue", accent: "#7d8ca3", paper: "#f3f5f4", ink: "#1f2328" },
  { label: "Noir", accent: "#c4a46b", paper: "#161513", ink: "#f6efe2" },
];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function defaultStyle(templateId = templates[0].id): InvitationStyle {
  const template = getTemplate(templateId);
  return {
    accent: template.accent,
    paper: template.paper,
    ink: template.ink,
    fontPair: "serif",
    heroAlign: "center",
    radius: 24,
    motion: "calm",
    coverEffect: "cinematic",
    galleryLayout: "editorial",
  };
}

function createMedia(file: File, index: number): MediaItem {
  return {
    id: `upload-${Date.now()}-${index}-${file.name}`,
    type: file.type.startsWith("video/") ? "video" : "image",
    src: URL.createObjectURL(file),
    alt: file.name,
    caption: file.name.replace(/\.[^.]+$/, ""),
    focusX: 50,
    focusY: 50,
    scale: 1,
    rotate: 0,
    effect: file.type.startsWith("video/") ? "still" : "cinematic",
  };
}

function fileListToMedia(files: FileList | null) {
  return Array.from(files ?? []).map(createMedia);
}

function formatDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const hour = date.getHours();
  const minute = date.getMinutes();
  const displayHour = hour % 12 || 12;
  const period = hour < 12 ? "오전" : "오후";
  const minuteText = minute > 0 ? ` ${minute}분` : "";

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${
    WEEKDAYS[date.getDay()]
  }요일 ${period} ${displayHour}시${minuteText}`;
}

function updateDateValue(current: string, nextDate?: string, nextTime?: string) {
  const date = nextDate || current.slice(0, 10);
  const time = nextTime || current.slice(11, 16) || "12:00";
  return `${date}T${time}`;
}

function toCalendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildCalendarUrl(data: InvitationData) {
  const start = new Date(data.date);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const text = encodeURIComponent(`${data.cover.groom} & ${data.cover.bride} 결혼식`);
  const details = encodeURIComponent(`${data.dateLabel}\n${data.venue.name} ${data.venue.hall}`);
  const location = encodeURIComponent(`${data.venue.name}, ${data.venue.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${toCalendarStamp(
    start,
  )}/${toCalendarStamp(end)}&details=${details}&location=${location}`;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [step, setStep] = useState<EditorStep>("template");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [styleConfig, setStyleConfig] = useState<InvitationStyle>(() => defaultStyle());
  const [enabled, setEnabled] = useState<RenderBlock[]>(INITIAL_BLOCKS);
  const [openBlock, setOpenBlock] = useState<RenderBlock>("cover");
  const [draft, setDraft] = useState<InvitationData>(mockInvitationData);
  const [finalized, setFinalized] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  const previewTemplate = previewId ? getTemplate(previewId) : null;

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

  const completeAuth = () => {
    setStage("editor");
    setStep("template");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditor = (id?: string) => {
    if (id) {
      setTemplateId(id);
      setStyleConfig(defaultStyle(id));
    }
    setPreviewId(null);
    setStage("auth");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseTemplate = (id: string) => {
    setTemplateId(id);
    setStyleConfig(defaultStyle(id));
    setFinalized(false);
  };

  const toggleBlock = (id: RenderBlock) => {
    setEnabled((current) => (current.includes(id) ? current.filter((block) => block !== id) : [...current, id]));
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
      document.getElementById(`acc-${id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, []);

  const setCover = (key: keyof InvitationData["cover"], value: string | MediaItem | undefined) => {
    setDraft((current) => ({
      ...current,
      cover: { ...current.cover, [key]: value },
    }));
    setFinalized(false);
  };

  const setGreeting = (key: keyof InvitationData["greeting"], value: string) => {
    setDraft((current) => ({
      ...current,
      greeting: { ...current.greeting, [key]: value },
    }));
    setFinalized(false);
  };

  const setVenue = (key: keyof InvitationData["venue"], value: string) => {
    setDraft((current) => ({
      ...current,
      venue: { ...current.venue, [key]: value },
    }));
    setFinalized(false);
  };

  const setPerson = (side: "groom" | "bride", key: keyof Person, value: string) => {
    setDraft((current) => ({
      ...current,
      couple: {
        ...current.couple,
        [side]: { ...current.couple[side], [key]: value },
      },
    }));
    setFinalized(false);
  };

  const setTop = (key: "dateLabel" | "ending", value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setFinalized(false);
  };

  const setNoticeText = (value: string) => {
    setDraft((current) => ({
      ...current,
      notice: value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    }));
    setFinalized(false);
  };

  const setDatePart = (datePart?: string, timePart?: string) => {
    setDraft((current) => {
      const next = updateDateValue(current.date, datePart, timePart);
      return {
        ...current,
        date: next,
        dateLabel: formatDateLabel(next),
      };
    });
    setFinalized(false);
  };

  const setGallery = (media: MediaItem[]) => {
    if (media.length === 0) return;
    setDraft((current) => ({ ...current, gallery: media }));
    setFinalized(false);
  };

  const addGallery = (media: MediaItem[]) => {
    if (media.length === 0) return;
    setDraft((current) => ({ ...current, gallery: [...current.gallery, ...media] }));
    setFinalized(false);
  };

  const updateMedia = (id: string, patch: Partial<MediaItem>) => {
    setDraft((current) => ({
      ...current,
      cover: current.cover.media?.id === id ? { ...current.cover, media: { ...current.cover.media, ...patch } } : current.cover,
      gallery: current.gallery.map((media) => (media.id === id ? { ...media, ...patch } : media)),
    }));
    setFinalized(false);
  };

  const removeMedia = (id: string) => {
    setDraft((current) => ({
      ...current,
      cover: current.cover.media?.id === id ? { ...current.cover, media: undefined } : current.cover,
      gallery: current.gallery.filter((media) => media.id !== id),
    }));
    setFinalized(false);
  };

  const moveMedia = (id: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.gallery.findIndex((media) => media.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.gallery.length) return current;
      const nextGallery = [...current.gallery];
      const [item] = nextGallery.splice(index, 1);
      nextGallery.splice(nextIndex, 0, item);
      return { ...current, gallery: nextGallery };
    });
    setFinalized(false);
  };

  const setCoverFromMedia = (media: MediaItem) => {
    setDraft((current) => ({ ...current, cover: { ...current.cover, media } }));
    setFinalized(false);
  };

  const updateTimeline = (index: number, patch: Partial<TimelineItem>) => {
    setDraft((current) => ({
      ...current,
      timeline: current.timeline.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
    setFinalized(false);
  };

  const addTimeline = () => {
    setDraft((current) => ({
      ...current,
      timeline: [
        ...current.timeline,
        {
          date: "New scene",
          title: "새로운 장면",
          body: "이 장면에 담긴 이야기를 적어주세요.",
          mediaId: current.gallery[0]?.id,
        },
      ],
    }));
    setFinalized(false);
  };

  const removeTimeline = (index: number) => {
    setDraft((current) => ({ ...current, timeline: current.timeline.filter((_, itemIndex) => itemIndex !== index) }));
    setFinalized(false);
  };

  const applyEdit = useCallback((key: EditKey, value: string) => {
    setDraft((current) => {
      switch (key) {
        case "cover.groom":
          return { ...current, cover: { ...current.cover, groom: value } };
        case "cover.bride":
          return { ...current, cover: { ...current.cover, bride: value } };
        case "cover.title":
          return { ...current, cover: { ...current.cover, title: value } };
        case "greeting.title":
          return { ...current, greeting: { ...current.greeting, title: value } };
        case "greeting.content":
          return { ...current, greeting: { ...current.greeting, content: value } };
        case "dateLabel":
          return { ...current, dateLabel: value };
        case "venue.name":
          return { ...current, venue: { ...current.venue, name: value } };
        case "venue.hall":
          return { ...current, venue: { ...current.venue, hall: value } };
        case "venue.address":
          return { ...current, venue: { ...current.venue, address: value } };
        case "ending":
          return { ...current, ending: value };
        default:
          return current;
      }
    });
    setFinalized(false);
  }, []);

  if (stage === "editor") {
    return (
      <main className="editor">
        <header className="editor__top">
          <strong className="editor__brand">Issue</strong>
          <div className="editor__url">
            <span>issue.cards/doyun-seoyeon</span>
            <button type="button" onClick={() => navigator.clipboard?.writeText("issue.cards/doyun-seoyeon")}>
              복사
            </button>
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
          <nav className="editor__rail" aria-label="제작 단계">
            {([
              ["template", "디자인"],
              ["content", "내용 편집"],
              ["share", "공유"],
            ] as [EditorStep, string][]).map(([key, label], index) => (
              <button key={key} type="button" className={step === key ? "is-active" : ""} onClick={() => setStep(key)}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                {label}
              </button>
            ))}
            <button type="button" className="editor__back" onClick={() => setStage("landing")}>
              처음으로
            </button>
          </nav>

          <section className="editor__panel">
            {step === "template" && (
              <>
                <span className="editor__eyebrow">Step 01 · Design</span>
                <h2>청첩장의 첫인상을 고르세요.</h2>
                <p>카드 안의 미니 화면은 실제 모바일 청첩장의 첫 화면 구조를 축소해서 보여줍니다.</p>
                <div className="mini-grid">
                  {templates.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={templateId === item.id ? "mini is-selected" : "mini"}
                      onClick={() => chooseTemplate(item.id)}
                    >
                      <ConceptMockup template={item} compact />
                      <span>{item.mood}</span>
                      <strong>{item.name}</strong>
                    </button>
                  ))}
                </div>
                <StyleControls styleConfig={styleConfig} onChange={setStyleConfig} />
                <button className="editor__next" type="button" onClick={() => setStep("content")}>
                  이 디자인으로 내용 편집
                </button>
              </>
            )}

            {step === "content" && (
              <>
                <span className="editor__eyebrow">Step 02 · Content</span>
                <h2>블록을 켜고 바로 채우세요.</h2>
                <p>사진, 영상, 날짜, 색감, 폰트까지 이 화면에서 바로 바꾸면 오른쪽 미리보기에 반영됩니다.</p>
                <StyleControls styleConfig={styleConfig} onChange={setStyleConfig} compact />
                <div className="accordion">
                  {BLOCK_META.map((block) => {
                    const isOn = enabled.includes(block.id);
                    const isOpen = openBlock === block.id;

                    return (
                      <article
                        key={block.id}
                        id={`acc-${block.id}`}
                        className={`acc ${isOpen ? "is-open" : ""} ${!isOn ? "is-muted" : ""}`.trim()}
                      >
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
                              aria-label={`${block.label} 블록 ${isOn ? "끄기" : "켜기"}`}
                            >
                              <i />
                            </button>
                          )}
                        </div>
                        {isOpen && (
                          <div className="acc__body">
                            {isOn ? (
                              <BlockFields
                                id={block.id}
                                draft={draft}
                                setCover={setCover}
                                setGreeting={setGreeting}
                                setVenue={setVenue}
                                setPerson={setPerson}
                                setTop={setTop}
                                setDatePart={setDatePart}
                                setGallery={setGallery}
                                addGallery={addGallery}
                                updateMedia={updateMedia}
                                removeMedia={removeMedia}
                                moveMedia={moveMedia}
                                setCoverFromMedia={setCoverFromMedia}
                                updateTimeline={updateTimeline}
                                addTimeline={addTimeline}
                                removeTimeline={removeTimeline}
                                setNoticeText={setNoticeText}
                              />
                            ) : (
                              <p className="fields__hint">스위치를 켜면 이 블록의 입력 항목이 열립니다.</p>
                            )}
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
                <h2>하객 그룹마다 다른 링크를 발급합니다.</h2>
                <p>최종 결정 후 친구, 가족, 일반 하객에게 맞춘 링크를 나눠 보낼 수 있습니다.</p>
                {!finalized ? (
                  <button type="button" className="editor__next" onClick={() => setFinalized(true)}>
                    최종 결정하고 링크 발급
                  </button>
                ) : (
                  <div className="links">
                    {GUEST_LINKS.map((link) => (
                      <article key={link.url}>
                        <span>{link.label}</span>
                        <div>
                          <strong>{link.url}</strong>
                          <button type="button" onClick={() => navigator.clipboard?.writeText(link.url)}>
                            복사
                          </button>
                        </div>
                        <p>{link.copy}</p>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <aside className="editor__preview">
            <div className="canvas-wrap">
              <span className="canvas-tab">미리보기 · 본문을 누르면 해당 블록으로 이동</span>
              <div className="canvas" ref={previewRef}>
                <InvitationRenderer
                  template={template}
                  data={draft}
                  enabledBlocks={enabled}
                  styleConfig={styleConfig}
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
          <div className="fs" role="dialog" aria-modal="true">
            <div className="fs__bar">
              <strong>{template.name}</strong>
              <span>실제 하객 화면에 가까운 전체 미리보기</span>
              <button type="button" onClick={() => setFullscreen(false)}>
                닫기
              </button>
            </div>
            <div className="fs__scroll">
              <div className="canvas canvas--fs">
                <InvitationRenderer
                  template={template}
                  data={draft}
                  enabledBlocks={enabled}
                  styleConfig={styleConfig}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  if (stage === "auth") {
    return (
      <main className="auth">
        <div className="gcard">
          <div className="gcard__head">
            <GoogleMark />
            <span>Google 계정으로 시작</span>
          </div>
          <h2>Issue에 로그인</h2>
          <p className="gcard__sub">작업 중인 디자인과 업로드한 사진을 저장하기 위해 계정을 선택해 주세요.</p>
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
          <p className="gcard__scope">계속 진행하면 Issue가 초대장 저장과 링크 발급에 필요한 정보만 사용합니다.</p>
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

  return (
    <main className="land">
      <nav className="land__nav">
        <a href="#top" className="land__brand">
          Issue
        </a>
        <div className="land__links">
          <a href="#showroom">컨셉</a>
          <a href="#start">시작</a>
        </div>
        <button type="button" onClick={goAuth}>
          나만의 시안 만들기
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero__copy">
          <span className="hero__eyebrow">Modern mobile wedding invitation</span>
          <h1>Issue</h1>
          <p>
            사진만 바뀌는 청첩장이 아니라, 첫 화면의 흐름과 글자의 온도까지 고를 수 있는 모바일 청첩장 제작
            플랫폼입니다.
          </p>
          <div className="hero__cta">
            <a href="#showroom">컨셉 둘러보기</a>
            <button type="button" onClick={goAuth}>
              나만의 시안 만들기
            </button>
          </div>
        </div>

        <div className="hero__visual" aria-label="대표 모바일 청첩장 미리보기">
          <ConceptMockup template={templates[0]} large />
        </div>
      </section>

      <section className="showroom" id="showroom">
        <div className="showroom__head">
          <span className="hero__eyebrow">Concept showroom</span>
          <h2>사진이 아니라, 디자인의 표정을 먼저 보세요.</h2>
          <p>각 컨셉 카드는 실제 모바일 청첩장의 첫 화면 구조와 색감, 타이포그래피를 축소해서 보여줍니다.</p>
        </div>

        <div className="showroom__grid">
          {templates.map((item) => (
            <button key={item.id} type="button" className="card" onClick={() => setPreviewId(item.id)}>
              <ConceptMockup template={item} />
              <div className="card__foot">
                <span>{item.mood}</span>
                <strong>{item.name}</strong>
                <small>{item.blurb}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="start" id="start">
        <span className="hero__eyebrow">Start your own issue</span>
        <h2>지금 바로 시안을 만드세요.</h2>
        <p>컨셉을 고르고, 사진과 예식 정보를 채우면 실제 하객 화면에 가까운 미리보기가 바로 완성됩니다.</p>
        <button type="button" className="start__btn" onClick={goAuth}>
          <GoogleMark />
          Google로 시작하기
        </button>
      </section>

      <footer className="land__foot">
        <span>Issue</span>
        <small>모던 모바일 청첩장 스튜디오</small>
      </footer>

      {previewTemplate && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setPreviewId(null)}>
          <div className="modal__inner" onClick={(event) => event.stopPropagation()}>
            <button className="modal__close" type="button" onClick={() => setPreviewId(null)}>
              닫기
            </button>
            <div className="canvas canvas--modal">
              <InvitationRenderer
                template={previewTemplate}
                data={mockInvitationData}
                enabledBlocks={[...RENDER_BLOCKS]}
                styleConfig={defaultStyle(previewTemplate.id)}
              />
            </div>
            <div className="modal__side">
              <span>{previewTemplate.mood}</span>
              <h3>{previewTemplate.name}</h3>
              <p>{previewTemplate.blurb}</p>
              <button type="button" onClick={() => startEditor(previewTemplate.id)}>
                이 컨셉으로 시안 만들기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BlockFields({
  id,
  draft,
  setCover,
  setGreeting,
  setVenue,
  setPerson,
  setTop,
  setDatePart,
  setGallery,
  addGallery,
  updateMedia,
  removeMedia,
  moveMedia,
  setCoverFromMedia,
  updateTimeline,
  addTimeline,
  removeTimeline,
  setNoticeText,
}: {
  id: RenderBlock;
  draft: InvitationData;
  setCover: (key: keyof InvitationData["cover"], value: string | MediaItem | undefined) => void;
  setGreeting: (key: keyof InvitationData["greeting"], value: string) => void;
  setVenue: (key: keyof InvitationData["venue"], value: string) => void;
  setPerson: (side: "groom" | "bride", key: keyof Person, value: string) => void;
  setTop: (key: "dateLabel" | "ending", value: string) => void;
  setDatePart: (datePart?: string, timePart?: string) => void;
  setGallery: (media: MediaItem[]) => void;
  addGallery: (media: MediaItem[]) => void;
  updateMedia: (id: string, patch: Partial<MediaItem>) => void;
  removeMedia: (id: string) => void;
  moveMedia: (id: string, direction: -1 | 1) => void;
  setCoverFromMedia: (media: MediaItem) => void;
  updateTimeline: (index: number, patch: Partial<TimelineItem>) => void;
  addTimeline: () => void;
  removeTimeline: (index: number) => void;
  setNoticeText: (value: string) => void;
}) {
  if (id === "cover") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>
            신랑
            <input value={draft.cover.groom} onChange={(event) => setCover("groom", event.target.value)} />
          </label>
          <label>
            신부
            <input value={draft.cover.bride} onChange={(event) => setCover("bride", event.target.value)} />
          </label>
        </div>
        <label>
          첫 문장
          <input value={draft.cover.title} onChange={(event) => setCover("title", event.target.value)} />
        </label>
        <label>
          대표 사진 또는 영상
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const [media] = fileListToMedia(event.target.files);
              if (media) setCover("media", media);
            }}
          />
        </label>
        {draft.cover.media && (
          <MediaTuner
            media={draft.cover.media}
            title="커버 미디어 편집"
            onChange={(patch) => updateMedia(draft.cover.media!.id, patch)}
            onRemove={() => setCover("media", undefined)}
          />
        )}
        {draft.gallery.length > 0 && (
          <div className="media-picker">
            <small>갤러리에서 커버로 지정</small>
            <div>
              {draft.gallery.slice(0, 8).map((media) => (
                <button type="button" key={media.id} onClick={() => setCoverFromMedia(media)}>
                  {media.type === "video" ? <video src={media.src} muted playsInline /> : <img src={media.src} alt={media.alt} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (id === "greeting") {
    return (
      <div className="fields">
        <label>
          제목
          <input value={draft.greeting.title} onChange={(event) => setGreeting("title", event.target.value)} />
        </label>
        <label>
          초대 문구
          <textarea rows={6} value={draft.greeting.content} onChange={(event) => setGreeting("content", event.target.value)} />
        </label>
        <div className="fields__row">
          <label>
            신랑 아버지
            <input value={draft.couple.groom.father} onChange={(event) => setPerson("groom", "father", event.target.value)} />
          </label>
          <label>
            신부 아버지
            <input value={draft.couple.bride.father} onChange={(event) => setPerson("bride", "father", event.target.value)} />
          </label>
        </div>
        <div className="fields__row">
          <label>
            신랑 어머니
            <input value={draft.couple.groom.mother} onChange={(event) => setPerson("groom", "mother", event.target.value)} />
          </label>
          <label>
            신부 어머니
            <input value={draft.couple.bride.mother} onChange={(event) => setPerson("bride", "mother", event.target.value)} />
          </label>
        </div>
      </div>
    );
  }

  if (id === "datetime") {
    return (
      <div className="fields">
        <div className="fields__row">
          <label>
            날짜
            <input type="date" value={draft.date.slice(0, 10)} onChange={(event) => setDatePart(event.target.value)} />
          </label>
          <label>
            시간
            <input type="time" value={draft.date.slice(11, 16)} onChange={(event) => setDatePart(undefined, event.target.value)} />
          </label>
        </div>
        <label>
          화면에 표시할 문구
          <input value={draft.dateLabel} onChange={(event) => setTop("dateLabel", event.target.value)} />
        </label>
        <a className="fields__link" href={buildCalendarUrl(draft)} target="_blank" rel="noreferrer">
          Google 캘린더 저장 링크 확인
        </a>
      </div>
    );
  }

  if (id === "gallery") {
    return (
      <div className="fields">
        <label>
          사진 또는 영상 여러 개 선택
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(event: ChangeEvent<HTMLInputElement>) => addGallery(fileListToMedia(event.target.files))}
          />
        </label>
        <button type="button" className="fields__ghost" onClick={() => setGallery(draft.gallery)}>
          현재 순서로 갤러리 다시 적용
        </button>
        <div className="asset-board">
          {draft.gallery.map((media, index) => (
            <MediaTuner
              key={media.id}
              media={media}
              title={`${String(index + 1).padStart(2, "0")} ${media.type === "video" ? "Video" : "Photo"}`}
              onChange={(patch) => updateMedia(media.id, patch)}
              onRemove={() => removeMedia(media.id)}
              onCover={() => setCoverFromMedia(media)}
              onMoveUp={index > 0 ? () => moveMedia(media.id, -1) : undefined}
              onMoveDown={index < draft.gallery.length - 1 ? () => moveMedia(media.id, 1) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  if (id === "story") {
    return (
      <div className="fields">
        <p className="fields__hint">갤러리 사진과 영상을 연결해 스크롤형 여정 블록으로 보여줍니다.</p>
        <div className="timeline-editor">
          {draft.timeline.map((item, index) => (
            <article key={`${item.date}-${index}`}>
              <div className="fields__row">
                <label>
                  시점
                  <input value={item.date} onChange={(event) => updateTimeline(index, { date: event.target.value })} />
                </label>
                <label>
                  연결 미디어
                  <select value={item.mediaId ?? ""} onChange={(event) => updateTimeline(index, { mediaId: event.target.value })}>
                    <option value="">갤러리 순서 자동</option>
                    {draft.gallery.map((media, mediaIndex) => (
                      <option key={media.id} value={media.id}>
                        {String(mediaIndex + 1).padStart(2, "0")} {media.caption || media.alt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                제목
                <input value={item.title} onChange={(event) => updateTimeline(index, { title: event.target.value })} />
              </label>
              <label>
                이야기
                <textarea rows={3} value={item.body} onChange={(event) => updateTimeline(index, { body: event.target.value })} />
              </label>
              <button type="button" className="fields__ghost" onClick={() => removeTimeline(index)}>
                장면 삭제
              </button>
            </article>
          ))}
        </div>
        <button type="button" className="editor__next editor__next--soft" onClick={addTimeline}>
          스토리 장면 추가
        </button>
      </div>
    );
  }

  if (id === "venue") {
    return (
      <div className="fields">
        <label>
          예식장
          <input value={draft.venue.name} onChange={(event) => setVenue("name", event.target.value)} />
        </label>
        <label>
          홀 / 층
          <input value={draft.venue.hall} onChange={(event) => setVenue("hall", event.target.value)} />
        </label>
        <label>
          주소
          <input value={draft.venue.address} onChange={(event) => setVenue("address", event.target.value)} />
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
            <input value={draft.couple.groom.phone} onChange={(event) => setPerson("groom", "phone", event.target.value)} />
          </label>
          <label>
            신부 연락처
            <input value={draft.couple.bride.phone} onChange={(event) => setPerson("bride", "phone", event.target.value)} />
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
            <input value={draft.couple.groom.bank} onChange={(event) => setPerson("groom", "bank", event.target.value)} />
          </label>
          <label>
            신랑 계좌
            <input value={draft.couple.groom.account} onChange={(event) => setPerson("groom", "account", event.target.value)} />
          </label>
        </div>
        <div className="fields__row">
          <label>
            신부 은행
            <input value={draft.couple.bride.bank} onChange={(event) => setPerson("bride", "bank", event.target.value)} />
          </label>
          <label>
            신부 계좌
            <input value={draft.couple.bride.account} onChange={(event) => setPerson("bride", "account", event.target.value)} />
          </label>
        </div>
      </div>
    );
  }

  if (id === "notice") {
    return (
      <div className="fields">
        <label>
          안내 문구
          <textarea rows={5} value={draft.notice.join("\n")} onChange={(event) => setNoticeText(event.target.value)} />
        </label>
      </div>
    );
  }

  if (id === "ending") {
    return (
      <div className="fields">
        <label>
          마지막 문장
          <textarea rows={3} value={draft.ending} onChange={(event) => setTop("ending", event.target.value)} />
        </label>
      </div>
    );
  }

  return <p className="fields__hint">이 블록은 미리보기에서 하객이 직접 입력하거나 확인하는 영역입니다.</p>;
}

function MediaTuner({
  media,
  title,
  onChange,
  onRemove,
  onCover,
  onMoveUp,
  onMoveDown,
}: {
  media: MediaItem;
  title: string;
  onChange: (patch: Partial<MediaItem>) => void;
  onRemove: () => void;
  onCover?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <article className="media-tuner">
      <div className="media-tuner__preview">
        {media.type === "video" ? <video src={media.src} muted playsInline loop /> : <img src={media.src} alt={media.alt} />}
      </div>
      <div className="media-tuner__body">
        <div className="media-tuner__head">
          <strong>{title}</strong>
          <div>
            {onMoveUp && (
              <button type="button" onClick={onMoveUp} aria-label="위로 이동">
                ↑
              </button>
            )}
            {onMoveDown && (
              <button type="button" onClick={onMoveDown} aria-label="아래로 이동">
                ↓
              </button>
            )}
            {onCover && (
              <button type="button" onClick={onCover}>
                Cover
              </button>
            )}
            <button type="button" onClick={onRemove}>
              Delete
            </button>
          </div>
        </div>
        <label>
          캡션
          <input value={media.caption ?? ""} onChange={(event) => onChange({ caption: event.target.value })} />
        </label>
        <div className="fields__row fields__row--tight">
          <label>
            초점 X
            <input
              type="range"
              min="0"
              max="100"
              value={media.focusX ?? 50}
              onChange={(event) => onChange({ focusX: Number(event.target.value) })}
            />
          </label>
          <label>
            초점 Y
            <input
              type="range"
              min="0"
              max="100"
              value={media.focusY ?? 50}
              onChange={(event) => onChange({ focusY: Number(event.target.value) })}
            />
          </label>
        </div>
        <div className="fields__row fields__row--tight">
          <label>
            확대
            <input
              type="range"
              min="1"
              max="1.8"
              step="0.02"
              value={media.scale ?? 1}
              onChange={(event) => onChange({ scale: Number(event.target.value) })}
            />
          </label>
          <label>
            회전
            <input
              type="range"
              min="-12"
              max="12"
              value={media.rotate ?? 0}
              onChange={(event) => onChange({ rotate: Number(event.target.value) })}
            />
          </label>
        </div>
        {media.type === "image" && (
          <label>
            사진 모션
            <select
              value={media.effect ?? "cinematic"}
              onChange={(event) => onChange({ effect: event.target.value as MediaItem["effect"] })}
            >
              <option value="cinematic">Cinematic drift</option>
              <option value="kenburns">Ken Burns</option>
              <option value="handheld">Handheld</option>
              <option value="shutter">Shutter flash</option>
              <option value="still">Still</option>
            </select>
          </label>
        )}
      </div>
    </article>
  );
}

function StyleControls({
  styleConfig,
  onChange,
  compact = false,
}: {
  styleConfig: InvitationStyle;
  onChange: (value: InvitationStyle) => void;
  compact?: boolean;
}) {
  const patch = (value: Partial<InvitationStyle>) => onChange({ ...styleConfig, ...value });

  return (
    <div className={compact ? "stylebox stylebox--compact" : "stylebox"}>
      <div className="stylebox__head">
        <strong>세부 스타일</strong>
        <span>색 · 폰트 · 위치 · 곡률 · 움직임</span>
      </div>
      <div className="stylebox__grid">
        <div className="stylebox__group">
          <small>색감</small>
          <div className="swatches">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={styleConfig.accent === preset.accent ? "is-active" : ""}
                onClick={() => patch(preset)}
                style={{ "--swatch": preset.accent, "--swatch-paper": preset.paper } as CSSProperties}
                aria-label={`${preset.label} 색감`}
              />
            ))}
          </div>
        </div>
        <div className="stylebox__group">
          <small>폰트</small>
          <div className="segmented">
            {([
              ["serif", "Serif"],
              ["classic", "Classic"],
              ["modern", "Modern"],
            ] as [InvitationStyle["fontPair"], string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={styleConfig.fontPair === value ? "is-active" : ""}
                onClick={() => patch({ fontPair: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="stylebox__group">
          <small>사진 위치</small>
          <div className="segmented">
            {([
              ["top", "위"],
              ["center", "중앙"],
              ["bottom", "아래"],
            ] as [InvitationStyle["heroAlign"], string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={styleConfig.heroAlign === value ? "is-active" : ""}
                onClick={() => patch({ heroAlign: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="stylebox__range">
          <small>부드러움</small>
          <input
            type="range"
            min="10"
            max="34"
            value={styleConfig.radius}
            onChange={(event) => patch({ radius: Number(event.target.value) })}
          />
        </label>
        <div className="stylebox__group">
          <small>애니메이션</small>
          <div className="segmented">
            {([
              ["calm", "Calm"],
              ["float", "Float"],
              ["none", "Off"],
            ] as [InvitationStyle["motion"], string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={styleConfig.motion === value ? "is-active" : ""}
                onClick={() => patch({ motion: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="stylebox__group">
          <small>커버 모션</small>
          <div className="segmented">
            {([
              ["cinematic", "Cinema"],
              ["kenburns", "Zoom"],
              ["handheld", "Hand"],
              ["shutter", "Flash"],
              ["still", "Still"],
            ] as [InvitationStyle["coverEffect"], string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={styleConfig.coverEffect === value ? "is-active" : ""}
                onClick={() => patch({ coverEffect: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="stylebox__group">
          <small>갤러리</small>
          <div className="segmented">
            {([
              ["editorial", "Edit"],
              ["masonry", "Masonry"],
              ["filmstrip", "Film"],
              ["journey", "Story"],
            ] as [InvitationStyle["galleryLayout"], string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={styleConfig.galleryLayout === value ? "is-active" : ""}
                onClick={() => patch({ galleryLayout: value })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptMockup({
  template,
  compact = false,
  large = false,
}: {
  template: (typeof templates)[number];
  compact?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`mockup mockup--${template.concept} ${compact ? "mockup--compact" : ""} ${
        large ? "mockup--large" : ""
      }`}
      style={
        {
          "--mock-accent": template.accent,
          "--mock-paper": template.paper,
          "--mock-ink": template.ink,
        } as CSSProperties
      }
    >
      <div className="mockup__screen">
        <div className="mockup__nav">
          <span />
          <span />
          <span />
        </div>
        <div className="mockup__hero">
          {template.coverVideo ? (
            <video src={template.coverVideo} muted loop playsInline autoPlay />
          ) : (
            <img src={template.coverPhoto} alt="" />
          )}
          <div className="mockup__copy">
            <small>{template.mood}</small>
            <strong>Do Yun</strong>
            <em>& Seo Yeon</em>
          </div>
        </div>
        <div className="mockup__body">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
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
