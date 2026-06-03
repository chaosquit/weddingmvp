"use client";

import { useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import type { InvitationData } from "../data/invitationData";
import type { Concept, Template } from "../data/templates";

export const RENDER_BLOCKS = [
  "cover",
  "greeting",
  "datetime",
  "gallery",
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

interface Props {
  template: Template;
  data: InvitationData;
  enabledBlocks: string[];
  activeBlock?: string | null;
  editable?: boolean;
  onSelectBlock?: (id: RenderBlock) => void;
  onEdit?: (key: EditKey, value: string) => void;
}

function buildCalendar(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i += 1) cells.push(null);
  for (let d = 1; d <= days; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function InvitationRenderer({
  template,
  data,
  enabledBlocks,
  activeBlock,
  editable = false,
  onSelectBlock,
  onEdit,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const has = (id: RenderBlock) => enabledBlocks.includes(id);
  const date = new Date(data.date);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dateShort = `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
  const timeText = data.dateLabel.includes("오")
    ? "오" + data.dateLabel.split(" 오")[1]
    : "";

  const ping = (msg: string) => {
    setToast(msg);
    window.clearTimeout((ping as unknown as { _t?: number })._t);
    (ping as unknown as { _t?: number })._t = window.setTimeout(
      () => setToast(null),
      1600,
    );
  };
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    ping("복사되었습니다");
  };
  const calendarUrl = () => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const s = `${y}${pad(m)}${pad(d)}T033000Z`;
    const e = `${y}${pad(m)}${pad(d)}T060000Z`;
    const text = encodeURIComponent(`${data.cover.groom} & ${data.cover.bride} 결혼식`);
    const det = encodeURIComponent(`${data.dateLabel}\n${data.venue.name} ${data.venue.hall}`);
    const loc = encodeURIComponent(`${data.venue.name}, ${data.venue.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${s}/${e}&details=${det}&location=${loc}`;
  };
  const scrollTo = (id: string) =>
    rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // inline-editable node (used in the shared body)
  const E = ({
    k,
    value,
    tag = "span",
    className,
    multiline = false,
  }: {
    k: EditKey;
    value: string;
    tag?: "span" | "h2" | "p" | "b";
    className?: string;
    multiline?: boolean;
  }) => {
    const Tag = tag as ElementType;
    if (!editable) return <Tag className={className}>{value}</Tag>;
    return (
      <Tag
        className={`${className ?? ""} cv-edit`.trim()}
        contentEditable
        suppressContentEditableWarning
        onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
        onBlur={(e: { currentTarget: HTMLElement }) =>
          onEdit?.(k, multiline ? e.currentTarget.innerText : e.currentTarget.textContent ?? "")
        }
      >
        {value}
      </Tag>
    );
  };

  const sec = (key: RenderBlock, cls: string, children: ReactNode) => (
    <section
      id={`sec-${key}`}
      data-block={key}
      className={`section ${cls} ${activeBlock === key ? "is-active" : ""} ${
        editable ? "is-edit" : ""
      }`.trim()}
      onClick={editable ? () => onSelectBlock?.(key) : undefined}
    >
      {children}
    </section>
  );

  const Eyebrow = ({ children }: { children: ReactNode }) => (
    <span className="eyebrow">{children}</span>
  );

  const gallery = data.gallery;
  const heroPhotos = [template.coverPhoto, ...gallery];

  return (
    <div className={`cv cv--${template.concept}`} ref={rootRef}>
      <nav className="cv-nav">
        <button type="button" onClick={() => scrollTo("sec-greeting")}>Invite</button>
        <button type="button" onClick={() => scrollTo("sec-gallery")}>Photos</button>
        <button type="button" onClick={() => scrollTo("sec-venue")}>Map</button>
        <button type="button" onClick={() => scrollTo("sec-rsvp")}>RSVP</button>
      </nav>

      {/* ───────── HERO (bespoke per concept) ───────── */}
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
          cover={template.coverPhoto}
          photos={heroPhotos}
          dateShort={dateShort}
        />
      </header>

      {/* ───────── SHARED THEMED BODY ───────── */}
      {has("greeting") &&
        sec(
          "greeting",
          "sec-greeting",
          <>
            <Eyebrow>Invitation</Eyebrow>
            <E k="greeting.title" value={data.greeting.title} tag="h2" />
            <E k="greeting.content" value={data.greeting.content} tag="p" className="cv-greet" multiline />
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
            <Eyebrow>Save the date</Eyebrow>
            <E k="dateLabel" value={data.dateLabel} tag="h2" />
            <div className="cv-cal">
              <div className="cv-cal__head">
                {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className="cv-cal__grid">
                {buildCalendar(date).map((c, i) => (
                  <span key={i} className={c === d ? "is-day" : ""}>
                    {c ?? ""}
                  </span>
                ))}
              </div>
            </div>
            <p className="cv-dday">
              {data.cover.groom} ♥ {data.cover.bride} · 결혼식까지{" "}
              <b>
                D-
                {Math.max(0, Math.round((date.getTime() - new Date("2026-06-03").getTime()) / 86_400_000))}
              </b>
            </p>
            <button type="button" className="btn light full" onClick={() => window.open(calendarUrl(), "_blank")}>
              구글 캘린더에 저장
            </button>
          </>,
        )}

      {has("gallery") &&
        sec(
          "gallery",
          "sec-gallery",
          <>
            <Eyebrow>Gallery</Eyebrow>
            <h2>우리의 순간</h2>
            <div className="cv-gallery">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(src);
                  }}
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          </>,
        )}

      {has("venue") &&
        sec(
          "venue",
          "sec-venue",
          <>
            <Eyebrow>Location</Eyebrow>
            <E k="venue.name" value={data.venue.name} tag="h2" />
            <div className="info">
              <div className="row">
                <b>홀</b>
                <E k="venue.hall" value={data.venue.hall} tag="span" />
              </div>
              <div className="row">
                <b>주소</b>
                <E k="venue.address" value={data.venue.address} tag="span" />
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
            <button
              type="button"
              className="btn light full"
              onClick={(e) => {
                e.stopPropagation();
                copy(data.venue.address);
              }}
            >
              주소 복사
            </button>
          </>,
        )}

      {has("family") &&
        sec(
          "family",
          "sec-family",
          <>
            <Eyebrow>Contact</Eyebrow>
            <h2>연락하기</h2>
            <div className="cv-contact">
              {[data.couple.groom, data.couple.bride].map((p, i) => (
                <article key={p.name}>
                  <small>{i === 0 ? "신랑" : "신부"}</small>
                  <b>{p.name}</b>
                  <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()}>
                    📞 {p.phone}
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
            <Eyebrow>Gift</Eyebrow>
            <h2>마음 전하실 곳</h2>
            {[data.couple.groom, data.couple.bride].map((p, i) => (
              <div className="copy" key={p.name}>
                <code>
                  {i === 0 ? "신랑" : "신부"} · {p.bank} {p.account}
                </code>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copy(`${p.bank} ${p.account}`);
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
            <Eyebrow>Reply</Eyebrow>
            <h2>참석 의사 전달</h2>
            <form
              className="form"
              onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => {
                e.preventDefault();
                (e.currentTarget as HTMLFormElement).reset();
                ping("참석 의사가 전달되었습니다");
              }}
            >
              <input placeholder="성함" />
              <select>
                <option>참석합니다</option>
                <option>참석이 어렵습니다</option>
                <option>아직 미정입니다</option>
              </select>
              <textarea rows={3} placeholder="축하 메시지" />
              <button className="btn full" type="submit">
                회신하기
              </button>
            </form>
          </>,
        )}

      {has("guestbook") &&
        sec(
          "guestbook",
          "sec-guestbook",
          <>
            <Eyebrow>Guestbook</Eyebrow>
            <h2>축하 메시지</h2>
            <div className="cv-book">
              <article>
                <b>지윤</b>
                <p>두 사람의 시작을 진심으로 축하해! 늘 지금처럼 따뜻하길.</p>
              </article>
              <article>
                <b>민호</b>
                <p>드디어! 행복하게 잘 살자 친구야 🤍</p>
              </article>
            </div>
          </>,
        )}

      {has("notice") &&
        sec(
          "notice",
          "sec-notice",
          <>
            <Eyebrow>Notice</Eyebrow>
            <h2>안내 말씀</h2>
            <ul className="cv-notice">
              {data.notice.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>,
        )}

      {has("ending") &&
        sec(
          "ending",
          "sec-ending",
          <div className="cv-end">
            <E k="ending" value={data.ending} tag="p" multiline />
            <b>
              {data.cover.groom} &amp; {data.cover.bride}
            </b>
            <div className="cv-end__btns">
              <button
                type="button"
                className="btn full"
                onClick={(e) => {
                  e.stopPropagation();
                  copy("issue.cards/doyun-seoyeon");
                }}
              >
                청첩장 공유
              </button>
              <button
                type="button"
                className="btn light full"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(calendarUrl(), "_blank");
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
          <img src={zoom} alt="" />
        </div>
      )}
      {toast && <div className="cv-toast">{toast}</div>}
    </div>
  );
}

/* ════════════════════════════ BESPOKE HEROES ════════════════════════════ */
function Hero({
  concept,
  data,
  cover,
  photos,
  dateShort,
}: {
  concept: Concept;
  data: InvitationData;
  cover: string;
  photos: string[];
  dateShort: string;
}) {
  const g = data.cover.groom;
  const b = data.cover.bride;
  const venue = data.venue.name;
  const img = (src: string, alt = "") => (
    <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
  );

  switch (concept) {
    case "newspaper":
      return (
        <div className="news-hero">
          <div className="np-top">
            <div className="np-kicker">Wedding Invitation — Special Edition</div>
            <h1>
              {g} &amp; {b}
              <br />결혼합니다
            </h1>
            <div className="np-strip">
              <span>Exclusive Photos</span>
              <span>Ceremony Details</span>
              <span>Love Story</span>
            </div>
          </div>
          <div className="scrap-photo tape">
            {img(cover)}
            <div className="date-tag">{dateShort}</div>
          </div>
          <div className="np-title2">The Wedding of the Year</div>
          <span className="stamp">Approved</span>
        </div>
      );

    case "mosaic":
      return (
        <div className="mo-hero">
          <div className="mo-head">
            <span>Wedding Pieces</span>
            <span>{dateShort}</span>
          </div>
          <h1>
            Pieces of
            <br />Our Day
          </h1>
          <div className="mo-grid">
            <div className="mo-tile mo1">
              {img(cover)}
              <div className="mo-name">
                {g}
                <br />
                {b}
              </div>
            </div>
            <div className="mo-tile mo2">{img(photos[1])}</div>
            <div className="mo-tile mo3">서로 다른 조각이 모여 하나의 장면이 되었습니다.</div>
            <div className="mo-tile mo4">{img(photos[2])}</div>
            <div className="mo-tile mo5">{img(photos[3])}</div>
            <div className="mo-tile mo6">{img(photos[4])}</div>
            <div className="mo-tile mo7">&amp;</div>
          </div>
        </div>
      );

    case "comic":
      return (
        <div className="co-hero">
          <div className="co-top">
            <span>EP.01</span>
            <span>WEDDING DAY</span>
          </div>
          <h1>
            Our
            <br />Next
            <br />Cut!
          </h1>
          <div className="panels">
            <div className="panel wide">
              {img(cover)}
              <div className="bubble b1">드디어<br />결혼해요!</div>
            </div>
            <div className="panel">
              {img(photos[1])}
              <div className="sfx">LOVE!</div>
            </div>
            <div className="panel">
              {img(photos[2])}
              <div className="bubble b2">같이<br />와줘요</div>
            </div>
            <div className="panel wide">{img(photos[3])}</div>
          </div>
          <div className="co-date">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "vogue":
      return (
        <div className="vo-hero">
          <div className="vo-top">
            <div className="logo">Vows</div>
            <div className="cover-meta">
              {dateShort}
              <br />Seoul Wedding
              <br />No.001
            </div>
          </div>
          <div className="cover-photo">{img(cover)}</div>
          <div className="coverline cl1">
            <small>cover story</small>
            Two people, one quiet promise.
          </div>
          <div className="coverline cl2">
            <small>invitation</small>
            Romantic but never ordinary.
          </div>
          <div className="cover-names">
            <h1>
              {g}
              <br />&amp; {b}
            </h1>
            <p>
              <span>{dateShort}</span>
              <span>{venue}</span>
            </p>
          </div>
        </div>
      );

    case "film":
      return (
        <div className="fi-hero">
          <div className="film-meta">
            <span>ROLL 06 / FRAME 15</span>
            <span>WEDDING FILM</span>
          </div>
          <h1>
            One <span>fine</span> Day
          </h1>
          <div className="strip">
            <div className="frame">{img(cover)}</div>
            <div className="frame">{img(photos[1])}</div>
            <div className="frame">{img(photos[2])}</div>
          </div>
          <div className="film-meta">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "museum":
      return (
        <div className="mu-hero">
          <div className="mu-top">
            <span>Permanent Collection</span>
            <span>Gallery 06</span>
          </div>
          <div className="mu-title">
            <small>an exhibition of two hearts</small>
            <h1>
              The Art
              <br />of Us
            </h1>
          </div>
          <div className="mu-frame">{img(cover)}</div>
          <div className="mu-label">
            <div>
              <b>
                {g} &amp; {b}, {dateShort.slice(0, 4)}
              </b>{" "}
              기억과 약속, 그리고 가족의 축복.
            </div>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "boarding":
      return (
        <div className="bo-hero">
          <div className="ticket">
            <div className="ticket-img">
              {img(cover)}
              <span className="ticket-stamp">WEDDING BOARDING PASS</span>
            </div>
            <div className="ticket-body">
              <h1>
                To Our
                <br />Wedding
              </h1>
              <div className="ticket-rows">
                <div className="t-cell"><small>from</small><b>{g}</b></div>
                <div className="t-cell"><small>to</small><b>{b}</b></div>
                <div className="t-cell"><small>gate</small><b>{data.venue.hall.replace(/[^0-9F]/g, "") || "3F"}</b></div>
                <div className="t-cell"><small>date</small><b>{dateShort.slice(5)}</b></div>
                <div className="t-cell"><small>time</small><b>{(data.dateLabel.match(/\d+시( \d+분)?/) || ["12:30"])[0]}</b></div>
                <div className="t-cell"><small>seat</small><b>With Us</b></div>
              </div>
              <div className="barcode" />
            </div>
          </div>
        </div>
      );

    case "letter":
      return (
        <div className="le-hero">
          <div className="letter-mark">
            {g.slice(0, 1)}
            <br />
            {b.slice(0, 1)}
          </div>
          <div className="letter-center">
            <div className="letter-photo">{img(cover)}</div>
            <div className="letter-script">with love and gratitude</div>
            <h1>
              {g}
              <br />&amp; {b}
            </h1>
          </div>
          <div className="letter-foot">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "archive":
      return (
        <div className="ar-hero">
          <div className="osbar">
            <span>our_wedding.zip</span>
            <span>{dateShort}</span>
          </div>
          <div className="tabs">
            <div className="tab">HOME</div>
            <div className="tab">GALLERY</div>
            <div className="tab">INFO</div>
          </div>
          <div className="folder-card">
            <h1>
              Wedding
              <br />Archive
            </h1>
            <div className="archive-photo">{img(cover)}</div>
            <div className="file-icons">
              <div className="file">date.txt<br />{dateShort.slice(5)}</div>
              <div className="file">place.map<br />seoul</div>
              <div className="file">rsvp.exe<br />open</div>
            </div>
          </div>
        </div>
      );

    case "botanical":
      return (
        <div className="bt-hero">
          <div className="bt-head">
            <span>Botanical Wedding</span>
            <span>June Issue</span>
          </div>
          <div className="bt-layout">
            <div className="leaf l1" />
            <div className="leaf l2" />
            <div className="bt-frame" />
            <div className="bt-photo">{img(cover)}</div>
            <h1>
              Bloom
              <br />Together
            </h1>
          </div>
          <div className="bt-date">
            <span>{dateShort}</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    case "poster":
      return (
        <div className="po-hero">
          <div className="po-photo">{img(cover)}</div>
          <div className="po-veil" />
          <div className="po-top">
            <span>WE ARE GETTING MARRIED</span>
            <span>NO.01 / 2026</span>
          </div>
          <h1 className="po-title">
            {g}
            <span className="po-slash">/</span>
            {b}
          </h1>
          <div className="po-side">JUST MARRIED</div>
          <div className="po-foot">
            <div className="po-bar" />
            <div className="po-meta">
              <span>{dateShort}</span>
              <span>{venue}</span>
            </div>
          </div>
        </div>
      );

    case "collage":
      return (
        <div className="cl-hero">
          <div className="cl-head">SCRAPBOOK / 2026 ✶ OUR WEDDING ✶</div>
          <div className="cl-stage">
            <div className="cl-cut cut1 tape">{img(cover)}</div>
            <div className="cl-cut cut2 tape">{img(photos[1])}</div>
            <div className="cl-cut cut3">{img(photos[2])}</div>
            <div className="cl-name">
              {g}
              <br />&amp; {b}
            </div>
            <div className="cl-sticker st1">LOVE ♥</div>
            <div className="cl-sticker st2">{dateShort}</div>
            <div className="cl-arrow">↗ save the date!</div>
          </div>
        </div>
      );

    case "riso":
      return (
        <div className="ri-hero">
          <div className="ri-photo">{img(cover)}</div>
          <div className="ri-grain" />
          <div className="ri-top">
            <span>RISO PRINT · 2 COLORS</span>
            <span>{dateShort}</span>
          </div>
          <h1 className="ri-title" data-text={`${g} & ${b}`}>
            {g} &amp; {b}
          </h1>
          <div className="ri-foot">
            <span>WE ARE GETTING MARRIED</span>
            <span>{venue}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
