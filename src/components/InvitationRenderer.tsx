"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import type { CSSProperties, ElementType, FocusEvent, ReactNode } from "react";
import type { InvitationData, MediaItem } from "../data/invitationData";
import type { Concept, Template } from "../data/templates";

export const RENDER_BLOCKS = [
  "cover",
  "greeting",
  "datetime",
  "gallery",
  "story",
  "venue",
  "family",
  "account",
  "rsvp",
  "guestbook",
  "notice",
  "ending",
] as const;

export type RenderBlock = (typeof RENDER_BLOCKS)[number];

export type EditKey =
  | "cover.groom"
  | "cover.bride"
  | "cover.title"
  | "greeting.title"
  | "greeting.content"
  | "dateLabel"
  | "venue.name"
  | "venue.hall"
  | "venue.address"
  | "ending";

export interface InvitationStyle {
  accent: string;
  paper: string;
  ink: string;
  fontPair: "serif" | "classic" | "modern";
  heroAlign: "top" | "center" | "bottom";
  radius: number;
  motion: "calm" | "float" | "none";
  coverEffect: "cinematic" | "kenburns" | "handheld" | "shutter" | "still";
  galleryLayout: "masonry" | "editorial" | "filmstrip" | "journey";
}

interface Props {
  template: Template;
  data: InvitationData;
  enabledBlocks: string[];
  styleConfig?: InvitationStyle;
  activeBlock?: string | null;
  editable?: boolean;
  onSelectBlock?: (id: RenderBlock) => void;
  onEdit?: (key: EditKey, value: string) => void;
}

interface EditableTextProps {
  k: EditKey;
  value: string;
  editable: boolean;
  onEdit?: (key: EditKey, value: string) => void;
  tag?: "span" | "h2" | "p" | "b";
  className?: string;
  multiline?: boolean;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function toCalendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatShortDate(date: Date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getDday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function mediaFromTemplate(template: Template): MediaItem {
  if (template.coverVideo) {
    return {
      id: "template-cover-video",
      type: "video",
      src: template.coverVideo,
      alt: `${template.name} motion cover`,
      effect: "still",
    };
  }

  return {
    id: "template-cover",
    type: "image",
    src: template.coverPhoto,
    alt: "대표 웨딩 사진",
    focusX: 50,
    focusY: 50,
    scale: 1,
    rotate: 0,
    effect: "cinematic",
  };
}

function MediaView({
  media,
  className,
  fit = "cover",
}: {
  media: MediaItem;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const mediaFit = media.fit ?? fit;
  const mediaStyle = {
    "--media-x": `${media.focusX ?? 50}%`,
    "--media-y": `${media.focusY ?? 50}%`,
    "--media-scale": media.scale ?? 1,
    "--media-rotate": `${media.rotate ?? 0}deg`,
    objectFit: mediaFit,
    objectPosition: `${media.focusX ?? 50}% ${media.focusY ?? 50}%`,
  } as CSSProperties;
  const effect = media.type === "video" ? "still" : (media.effect ?? "cinematic");
  const mediaClass = `cv-media cv-media--${media.type} media-fx--${effect} ${className ?? ""}`.trim();

  if (media.type === "video") {
    return (
      <video
        className={mediaClass}
        src={media.src}
        autoPlay
        muted
        loop
        playsInline
        controls={fit === "contain"}
        style={mediaStyle}
      />
    );
  }

  return <img className={mediaClass} src={media.src} alt={media.alt} style={mediaStyle} />;
}

function EditableText({
  k,
  value,
  editable,
  onEdit,
  tag = "span",
  className,
  multiline = false,
}: EditableTextProps) {
  const Tag = tag as ElementType;
  if (!editable) return <Tag className={className}>{value}</Tag>;

  return (
    <Tag
      className={`${className ?? ""} cv-edit`.trim()}
      contentEditable
      suppressContentEditableWarning
      onClick={(event: { stopPropagation: () => void }) => event.stopPropagation()}
      onBlur={(event: FocusEvent<HTMLElement>) =>
        onEdit?.(k, multiline ? event.currentTarget.innerText : event.currentTarget.textContent ?? "")
      }
    >
      {value}
    </Tag>
  );
}

export default function InvitationRenderer({
  template,
  data,
  enabledBlocks,
  styleConfig,
  activeBlock,
  editable = false,
  onSelectBlock,
  onEdit,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const date = new Date(data.date);
  const dateShort = formatShortDate(date);
  const baseCoverMedia = data.cover.media ?? mediaFromTemplate(template);
  const coverMedia =
    baseCoverMedia.type === "image"
      ? { ...baseCoverMedia, effect: baseCoverMedia.effect ?? styleConfig?.coverEffect ?? "cinematic" }
      : baseCoverMedia;
  const gallery = data.gallery.length > 0 ? data.gallery : [coverMedia];
  const heroMedia = [coverMedia, ...gallery].slice(0, 5);
  const has = (id: RenderBlock) => enabledBlocks.includes(id);

  const style = {
    "--cv-accent": styleConfig?.accent ?? template.accent,
    "--cv-paper": styleConfig?.paper ?? template.paper,
    "--cv-ink": styleConfig?.ink ?? template.ink,
    "--cv-radius": `${styleConfig?.radius ?? 22}px`,
    "--cv-hero-pos":
      styleConfig?.heroAlign === "top"
        ? "50% 18%"
        : styleConfig?.heroAlign === "bottom"
          ? "50% 82%"
          : "50% 50%",
  } as CSSProperties;

  const calendarUrl = () => {
    const start = new Date(date);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const text = encodeURIComponent(`${data.cover.groom} & ${data.cover.bride} 결혼식`);
    const details = encodeURIComponent(`${data.dateLabel}\n${data.venue.name} ${data.venue.hall}`);
    const location = encodeURIComponent(`${data.venue.name}, ${data.venue.address}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${toCalendarStamp(
      start,
    )}/${toCalendarStamp(end)}&details=${details}&location=${location}`;
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    window.clearTimeout((copy as unknown as { timer?: number }).timer);
    setToast("복사했어요");
    (copy as unknown as { timer?: number }).timer = window.setTimeout(() => setToast(null), 1500);
  };

  const scrollTo = (id: string) => {
    rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sec = (key: RenderBlock, className: string, children: ReactNode) => (
    <section
      id={`sec-${key}`}
      data-block={key}
      className={`section ${className} ${activeBlock === key ? "is-active" : ""} ${
        editable ? "is-edit" : ""
      }`.trim()}
      onClick={editable ? () => onSelectBlock?.(key) : undefined}
    >
      {children}
    </section>
  );

  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent(data.venue.address)}`;

  return (
    <div
      className={`cv cv--${template.concept} cv-font--${styleConfig?.fontPair ?? "serif"} cv-motion--${
        styleConfig?.motion ?? "calm"
      }`}
      ref={rootRef}
      style={style}
    >
      <nav className="cv-nav" aria-label="청첩장 섹션">
        <button type="button" onClick={() => scrollTo("sec-greeting")}>
          초대
        </button>
        <button type="button" onClick={() => scrollTo("sec-datetime")}>
          일정
        </button>
        <button type="button" onClick={() => scrollTo("sec-gallery")}>
          사진
        </button>
        <button type="button" onClick={() => scrollTo("sec-story")}>
          스토리
        </button>
        <button type="button" onClick={() => scrollTo("sec-venue")}>
          장소
        </button>
        <button type="button" onClick={() => scrollTo("sec-rsvp")}>
          RSVP
        </button>
      </nav>

      <header
        id="sec-cover"
        data-block="cover"
        className={`cv-hero hero--${template.concept} ${activeBlock === "cover" ? "is-active" : ""} ${
          editable ? "is-edit" : ""
        }`.trim()}
        onClick={editable ? () => onSelectBlock?.("cover") : undefined}
      >
        <Hero
          concept={template.concept}
          data={data}
          cover={coverMedia}
          photos={heroMedia}
          dateShort={dateShort}
        />
      </header>

      {has("greeting") &&
        sec(
          "greeting",
          "sec-greeting",
          <>
            <span className="eyebrow">Invitation</span>
            <EditableText k="greeting.title" value={data.greeting.title} tag="h2" editable={editable} onEdit={onEdit} />
            <EditableText
              k="greeting.content"
              value={data.greeting.content}
              tag="p"
              className="cv-greet"
              multiline
              editable={editable}
              onEdit={onEdit}
            />
            <div className="cv-parents">
              <p>
                {data.couple.groom.father} · {data.couple.groom.mother}
                <span> 의 {data.couple.groom.relation} </span>
                <b>{data.couple.groom.name}</b>
              </p>
              <p>
                {data.couple.bride.father} · {data.couple.bride.mother}
                <span> 의 {data.couple.bride.relation} </span>
                <b>{data.couple.bride.name}</b>
              </p>
            </div>
          </>,
        )}

      {has("datetime") &&
        sec(
          "datetime",
          "sec-date",
          <>
            <span className="eyebrow">Save the date</span>
            <EditableText k="dateLabel" value={data.dateLabel} tag="h2" editable={editable} onEdit={onEdit} />
            <div className="cv-cal" aria-label="예식 날짜 달력">
              <div className="cv-cal__head">
                {WEEKDAYS.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>
              <div className="cv-cal__grid">
                {buildCalendar(date).map((cell, index) => (
                  <span key={`${cell ?? "blank"}-${index}`} className={cell === date.getDate() ? "is-day" : ""}>
                    {cell ?? ""}
                  </span>
                ))}
              </div>
            </div>
            <p className="cv-dday">
              {data.cover.groom} · {data.cover.bride}의 결혼식까지 <b>{getDday(date)}</b>
            </p>
            <button
              type="button"
              className="btn light full"
              onClick={(event) => {
                event.stopPropagation();
                window.open(calendarUrl(), "_blank", "noopener,noreferrer");
              }}
            >
              Google 캘린더에 저장
            </button>
          </>,
        )}

      {has("gallery") &&
        sec(
          "gallery",
          "sec-gallery",
          <>
            <span className="eyebrow">Gallery</span>
            <h2>우리의 장면</h2>
            <div className={`cv-gallery cv-gallery--${styleConfig?.galleryLayout ?? "masonry"}`}>
              {gallery.map((media, index) => (
                <button
                  key={`${media.id}-${index}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoom(media);
                  }}
                >
                  <MediaView media={media} />
                  {media.type === "video" && <span className="media-pill">Video</span>}
                  {media.caption && <span className="media-caption">{media.caption}</span>}
                </button>
              ))}
            </div>
          </>,
        )}

      {has("story") &&
        sec(
          "story",
          "sec-story",
          <>
            <span className="eyebrow">Journey</span>
            <h2>스크롤로 이어지는 우리의 장면</h2>
            <div className="cv-journey">
              {data.timeline.map((item, index) => {
                const media = gallery.find((entry) => entry.id === item.mediaId) ?? gallery[index % gallery.length] ?? coverMedia;

                return (
                  <article className="journey-card" key={`${item.date}-${item.title}`}>
                    <div className="journey-card__media">
                      <MediaView media={media} />
                    </div>
                    <div className="journey-card__copy">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <small>{item.date}</small>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </>,
        )}

      {has("venue") &&
        sec(
          "venue",
          "sec-venue",
          <>
            <span className="eyebrow">Location</span>
            <EditableText k="venue.name" value={data.venue.name} tag="h2" editable={editable} onEdit={onEdit} />
            <div className="info">
              <div className="row">
                <b>홀</b>
                <EditableText k="venue.hall" value={data.venue.hall} tag="span" editable={editable} onEdit={onEdit} />
              </div>
              <div className="row">
                <b>주소</b>
                <EditableText k="venue.address" value={data.venue.address} tag="span" editable={editable} onEdit={onEdit} />
              </div>
              {data.venue.transport.subway && (
                <div className="row">
                  <b>지하철</b>
                  <span>{data.venue.transport.subway}</span>
                </div>
              )}
              {data.venue.transport.bus && (
                <div className="row">
                  <b>버스</b>
                  <span>{data.venue.transport.bus}</span>
                </div>
              )}
              {data.venue.transport.parking && (
                <div className="row">
                  <b>주차</b>
                  <span>{data.venue.transport.parking}</span>
                </div>
              )}
            </div>
            <div className="btn-row">
              <button
                type="button"
                className="btn light"
                onClick={(event) => {
                  event.stopPropagation();
                  copy(data.venue.address);
                }}
              >
                주소 복사
              </button>
              <button
                type="button"
                className="btn"
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(mapUrl, "_blank", "noopener,noreferrer");
                }}
              >
                지도 열기
              </button>
            </div>
          </>,
        )}

      {has("family") &&
        sec(
          "family",
          "sec-family",
          <>
            <span className="eyebrow">Contact</span>
            <h2>연락하기</h2>
            <div className="cv-contact">
              {[data.couple.groom, data.couple.bride].map((person, index) => (
                <article key={person.name}>
                  <small>{index === 0 ? "신랑" : "신부"}</small>
                  <b>{person.name}</b>
                  <a href={`tel:${person.phone}`} onClick={(event) => event.stopPropagation()}>
                    {person.phone}
                  </a>
                </article>
              ))}
            </div>
          </>,
        )}

      {has("account") &&
        sec(
          "account",
          "sec-account",
          <>
            <span className="eyebrow">Gift</span>
            <h2>마음 전하실 곳</h2>
            {[data.couple.groom, data.couple.bride].map((person, index) => (
              <div className="copy" key={person.name}>
                <code>
                  {index === 0 ? "신랑" : "신부"} · {person.bank} {person.account}
                </code>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    copy(`${person.bank} ${person.account}`);
                  }}
                >
                  복사
                </button>
              </div>
            ))}
          </>,
        )}

      {has("rsvp") &&
        sec(
          "rsvp",
          "sec-rsvp",
          <>
            <span className="eyebrow">Reply</span>
            <h2>참석 의사 전달</h2>
            <form
              className="form"
              onClick={(event) => event.stopPropagation()}
              onSubmit={(event) => {
                event.preventDefault();
                event.currentTarget.reset();
                setToast("참석 의사를 전달했어요");
                window.setTimeout(() => setToast(null), 1500);
              }}
            >
              <input placeholder="성함" required />
              <select defaultValue="참석합니다">
                <option>참석합니다</option>
                <option>참석이 어렵습니다</option>
                <option>아직 미정입니다</option>
              </select>
              <textarea rows={3} placeholder="축하 메시지" />
              <button className="btn full" type="submit">
                전달하기
              </button>
            </form>
          </>,
        )}

      {has("guestbook") &&
        sec(
          "guestbook",
          "sec-guestbook",
          <>
            <span className="eyebrow">Guestbook</span>
            <h2>축하 메시지</h2>
            <div className="cv-book">
              <article>
                <b>지우</b>
                <p>두 사람의 새로운 계절을 진심으로 축하해. 지금처럼 서로의 편이 되어줘.</p>
              </article>
              <article>
                <b>민호</b>
                <p>초대장 너무 예쁘다. 결혼식 날 가장 먼저 축하하러 갈게.</p>
              </article>
            </div>
          </>,
        )}

      {has("notice") &&
        sec(
          "notice",
          "sec-notice",
          <>
            <span className="eyebrow">Notice</span>
            <h2>안내 말씀</h2>
            <ul className="cv-notice">
              {data.notice.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </>,
        )}

      {has("ending") &&
        sec(
          "ending",
          "sec-ending",
          <div className="cv-end">
            <EditableText k="ending" value={data.ending} tag="p" multiline editable={editable} onEdit={onEdit} />
            <b>
              {data.cover.groom} & {data.cover.bride}
            </b>
            <div className="cv-end__btns">
              <button
                type="button"
                className="btn full"
                onClick={(event) => {
                  event.stopPropagation();
                  copy("issue.cards/doyun-seoyeon");
                }}
              >
                청첩장 공유
              </button>
              <button
                type="button"
                className="btn light full"
                onClick={(event) => {
                  event.stopPropagation();
                  window.open(calendarUrl(), "_blank", "noopener,noreferrer");
                }}
              >
                캘린더 저장
              </button>
            </div>
          </div>,
        )}

      <div className="cv-footer">Made with Issue · {dateShort}</div>

      {zoom && (
        <div className="cv-zoom" onClick={() => setZoom(null)}>
          <div className="cv-zoom__inner">
            <MediaView media={zoom} fit="contain" />
          </div>
        </div>
      )}
      {toast && <div className="cv-toast">{toast}</div>}
    </div>
  );
}

function Hero({
  concept,
  data,
  cover,
  photos,
  dateShort,
}: {
  concept: Concept;
  data: InvitationData;
  cover: MediaItem;
  photos: MediaItem[];
  dateShort: string;
}) {
  const groom = data.cover.groom;
  const bride = data.cover.bride;
  const venue = data.venue.name;

  switch (concept) {
    case "lumiere":
      return (
        <div className="hero-lumiere">
          <div className="hero-kicker">{data.cover.kicker}</div>
          <div className="lumiere-frame">
            <MediaView media={cover} />
          </div>
          <h1>
            {groom}
            <span>&</span>
            {bride}
          </h1>
          <p>{data.cover.title}</p>
          <div className="hero-meta">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "serene":
      return (
        <div className="hero-serene">
          <div className="serene-photo">
            <MediaView media={cover} />
          </div>
          <div className="serene-copy">
            <span>{data.cover.kicker}</span>
            <h1>
              {groom}
              <br />
              {bride}
            </h1>
            <p>{dateShort}</p>
          </div>
        </div>
      );

    case "botanica":
      return (
        <div className="hero-botanica">
          <div className="botanica-line" />
          <div className="botanica-photo">
            <MediaView media={cover} />
          </div>
          <div className="botanica-copy">
            <span>Blooming together</span>
            <h1>
              {groom}
              <br />
              <em>and</em>
              <br />
              {bride}
            </h1>
            <p>
              {dateShort}
              <br />
              {venue}
            </p>
          </div>
        </div>
      );

    case "atelier":
      return (
        <div className="hero-atelier">
          <div className="atelier-note">
            <span>{data.cover.kicker}</span>
            <h1>{data.cover.title}</h1>
            <p>
              {groom} and {bride}
              <br />
              {dateShort}
            </p>
          </div>
          <div className="atelier-photo">
            <MediaView media={cover} />
          </div>
        </div>
      );

    case "nocturne":
      return (
        <div className="hero-nocturne">
          <MediaView media={cover} className="nocturne-bg" />
          <div className="nocturne-shade" />
          <div className="nocturne-copy">
            <span>{dateShort}</span>
            <h1>
              {groom}
              <br />
              & {bride}
            </h1>
            <p>{venue}</p>
          </div>
        </div>
      );

    case "vellum":
      return (
        <div className="hero-vellum">
          <div className="vellum-stack">
            {photos.slice(0, 3).map((media, index) => (
              <div className={`vellum-photo vellum-photo--${index + 1}`} key={`${media.id}-${index}`}>
                <MediaView media={media} />
              </div>
            ))}
          </div>
          <div className="vellum-card">
            <span>{data.cover.kicker}</span>
            <h1>
              {groom}
              <br />& {bride}
            </h1>
            <p>{dateShort}</p>
          </div>
        </div>
      );

    case "newspaper":
      return (
        <div className="hero-newspaper">
          <div className="news-mast">
            <span>Wedding Special Edition</span>
            <h1>
              {groom}
              <br />& {bride}
            </h1>
            <p>{data.cover.title}</p>
          </div>
          <div className="news-photo">
            <MediaView media={cover} />
            <b>{dateShort}</b>
          </div>
          <div className="news-foot">
            <span>Exclusive invitation</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "mosaic":
      return (
        <div className="hero-mosaic">
          <div className="mosaic-head">
            <span>Pieces of our day</span>
            <span>{dateShort}</span>
          </div>
          <h1>
            Our
            <br />
            Mosaic
          </h1>
          <div className="mosaic-grid">
            {[cover, photos[1] ?? cover, photos[2] ?? cover, photos[3] ?? cover, photos[4] ?? cover].map(
              (media, index) => (
                <div className={`mosaic-cell mosaic-cell--${index + 1}`} key={`${media.id}-${index}`}>
                  <MediaView media={media} />
                </div>
              ),
            )}
            <div className="mosaic-type">
              {groom}
              <br />& {bride}
            </div>
          </div>
        </div>
      );

    case "comic":
      return (
        <div className="hero-comic">
          <div className="comic-top">
            <span>EP.01</span>
            <span>WEDDING DAY</span>
          </div>
          <h1>
            Our
            <br />
            Next
            <br />
            Cut
          </h1>
          <div className="comic-panels">
            <div className="comic-panel comic-panel--wide">
              <MediaView media={cover} />
              <span className="speech speech--left">초대합니다</span>
            </div>
            <div className="comic-panel">
              <MediaView media={photos[1] ?? cover} />
            </div>
            <div className="comic-panel">
              <MediaView media={photos[2] ?? cover} />
              <span className="speech speech--right">같이 와요</span>
            </div>
          </div>
          <div className="comic-date">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "vogue":
      return (
        <div className="hero-vogue">
          <div className="vogue-top">
            <strong>Vows</strong>
            <span>
              {dateShort}
              <br />
              Wedding Issue
            </span>
          </div>
          <div className="vogue-photo">
            <MediaView media={cover} />
          </div>
          <div className="vogue-line vogue-line--left">
            <small>cover story</small>
            Two people, one quiet promise.
          </div>
          <div className="vogue-line vogue-line--right">
            <small>special</small>
            Modern wedding invitation.
          </div>
          <div className="vogue-names">
            <h1>
              {groom}
              <br />& {bride}
            </h1>
            <p>{venue}</p>
          </div>
        </div>
      );

    case "film":
      return (
        <div className="hero-film">
          <div className="film-meta">
            <span>ROLL 06 / FRAME 15</span>
            <span>{dateShort}</span>
          </div>
          <h1>
            One
            <br />
            <em>fine</em> Day
          </h1>
          <div className="film-strip">
            {[cover, photos[1] ?? cover, photos[2] ?? cover].map((media, index) => (
              <div className="film-frame" key={`${media.id}-${index}`}>
                <MediaView media={media} />
              </div>
            ))}
          </div>
          <div className="film-meta">
            <span>{groom} & {bride}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "museum":
      return (
        <div className="hero-museum">
          <div className="museum-top">
            <span>Permanent Collection</span>
            <span>Gallery 06</span>
          </div>
          <div className="museum-title">
            <small>An exhibition of two hearts</small>
            <h1>
              The Art
              <br />
              of Us
            </h1>
          </div>
          <div className="museum-frame">
            <MediaView media={cover} />
          </div>
          <div className="museum-label">
            <b>{groom} & {bride}</b>
            <span>{dateShort}</span>
          </div>
        </div>
      );

    case "boarding":
      return (
        <div className="hero-boarding">
          <div className="boarding-ticket">
            <div className="boarding-photo">
              <MediaView media={cover} />
              <span>Wedding Boarding Pass</span>
            </div>
            <div className="boarding-body">
              <h1>
                To Our
                <br />
                Wedding
              </h1>
              <div className="boarding-cells">
                <div><small>from</small><b>{groom}</b></div>
                <div><small>to</small><b>{bride}</b></div>
                <div><small>gate</small><b>{data.venue.hall.replace(/[^0-9F]/g, "") || "3F"}</b></div>
                <div><small>date</small><b>{dateShort.slice(5)}</b></div>
                <div><small>seat</small><b>With us</b></div>
                <div><small>city</small><b>Seoul</b></div>
              </div>
              <div className="boarding-barcode" />
            </div>
          </div>
        </div>
      );

    case "letter":
      return (
        <div className="hero-letter">
          <div className="letter-seal">
            {groom.slice(0, 1)}
            <br />
            {bride.slice(0, 1)}
          </div>
          <div className="letter-photo">
            <MediaView media={cover} />
          </div>
          <span>with love and gratitude</span>
          <h1>
            {groom}
            <br />& {bride}
          </h1>
          <div className="letter-bottom">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "archive":
      return (
        <div className="hero-archive">
          <div className="archive-bar">
            <span>our_wedding.zip</span>
            <span>{dateShort}</span>
          </div>
          <div className="archive-folder">
            <h1>
              Wedding
              <br />
              Archive
            </h1>
            <div className="archive-photo-soft">
              <MediaView media={cover} />
            </div>
            <div className="archive-files">
              <span>date.txt</span>
              <span>place.map</span>
              <span>rsvp.app</span>
            </div>
          </div>
        </div>
      );

    case "botanical":
      return (
        <div className="hero-botanical">
          <div className="botanical-head">
            <span>Botanical Wedding</span>
            <span>{dateShort}</span>
          </div>
          <div className="botanical-stage">
            <div className="botanical-orbit" />
            <div className="botanical-photo">
              <MediaView media={cover} />
            </div>
            <h1>
              Bloom
              <br />
              Together
            </h1>
          </div>
          <div className="botanical-bottom">
            <span>{groom} & {bride}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "poster":
      return (
        <div className="hero-poster">
          <MediaView media={cover} className="poster-bg" />
          <div className="poster-veil" />
          <div className="poster-top">
            <span>We are getting married</span>
            <span>{dateShort}</span>
          </div>
          <h1>
            {groom}
            <em>/</em>
            {bride}
          </h1>
          <div className="poster-bottom">{venue}</div>
        </div>
      );

    case "collage":
      return (
        <div className="hero-collage">
          <div className="collage-head">Scrapbook / Our Wedding</div>
          <div className="collage-stage">
            {[cover, photos[1] ?? cover, photos[2] ?? cover].map((media, index) => (
              <div className={`collage-cut collage-cut--${index + 1}`} key={`${media.id}-${index}`}>
                <MediaView media={media} />
              </div>
            ))}
            <h1>
              {groom}
              <br />& {bride}
            </h1>
            <span className="collage-sticker">{dateShort}</span>
          </div>
        </div>
      );

    case "riso":
      return (
        <div className="hero-riso">
          <div className="riso-photo">
            <MediaView media={cover} />
          </div>
          <div className="riso-grain" />
          <div className="riso-top">
            <span>Riso print / 2 colors</span>
            <span>{dateShort}</span>
          </div>
          <h1 data-text={`${groom} & ${bride}`}>
            {groom} & {bride}
          </h1>
          <div className="riso-bottom">{venue}</div>
        </div>
      );

    case "sportychic":
      return (
        <div className="hero-sporty">
          <h1>sporty chic</h1>
          <div className="sporty-photo">
            <MediaView media={cover} />
          </div>
          <div className="sporty-label">
            <span>{dateShort}</span>
            <b>{groom} & {bride}</b>
          </div>
          <p>{venue}</p>
        </div>
      );

    case "sonic":
      return (
        <div className="hero-sonic">
          <div className="sonic-frame">
            <h1>
              IN-VOWS
              <br />
              IN-VOWS
              <br />
              IN-VOWS
            </h1>
            <div className="sonic-photo">
              <MediaView media={cover} />
            </div>
            <p>
              {groom} & {bride}
              <br />
              {dateShort}
            </p>
          </div>
        </div>
      );

    case "street":
      return (
        <div className="hero-street">
          <MediaView media={cover} className="street-bg" />
          <div className="street-paper street-paper--one">POWER</div>
          <div className="street-paper street-paper--two">ATTITUDE</div>
          <div className="street-paper street-paper--three">LOVE</div>
          <div className="street-copy">
            <span>{dateShort}</span>
            <h1>
              {groom}
              <br />& {bride}
            </h1>
            <p>{venue}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
