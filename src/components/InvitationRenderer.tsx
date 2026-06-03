"use client";

import type { CSSProperties } from "react";
import type { InvitationData } from "../data/invitationData";
import type { Template } from "../data/templates";

export type GalleryMode = "grid" | "slide" | "pinterest";

export const RENDER_BLOCKS = [
  "cover",
  "greeting",
  "datetime",
  "timeline",
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

interface Props {
  template: Template;
  data: InvitationData;
  enabledBlocks: string[];
  galleryMode?: GalleryMode;
  activeBlock?: string | null;
}

const fontVar: Record<Template["font"], string> = {
  serif: "var(--font-serif), var(--font-display), serif",
  sans: "var(--font-sans-kr), var(--font-geist-sans), sans-serif",
  display: "var(--font-display), var(--font-serif), serif",
};

function buildCalendar(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
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
  galleryMode = "pinterest",
  activeBlock,
}: Props) {
  const has = (id: RenderBlock) => enabledBlocks.includes(id);
  const t = template;
  const date = new Date(data.date);
  const today = new Date("2026-06-03");
  const dday = Math.max(
    0,
    Math.round((date.getTime() - today.getTime()) / 86_400_000),
  );
  const cells = buildCalendar(date);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"];
  const kicker = data.cover.kicker || t.kicker;

  const style = {
    "--ink": t.palette.ink,
    "--paper": t.palette.paper,
    "--accent": t.palette.accent,
    "--soft": t.palette.soft,
    "--line": t.palette.line,
    "--inv-font": fontVar[t.font],
  } as CSSProperties;

  const sectionClass = (key: RenderBlock, extra = "") =>
    `inv-sec ${extra} ${activeBlock === key ? "is-active" : ""}`.trim();

  return (
    <div
      className={`inv inv--${t.category} cover--${t.cover} font--${t.font} ${
        t.uppercase ? "is-upper" : ""
      } ${t.grain ? "has-grain" : ""}`}
      style={style}
    >
      {/* ── COVER ── */}
      <section
        id="sec-cover"
        data-block="cover"
        className={sectionClass("cover", "inv-cover")}
      >
        <div
          className="inv-cover__photo"
          style={{ backgroundImage: `url(${t.coverPhoto})` }}
        />
        <div className="inv-cover__veil" />
        <div className="inv-cover__inner">
          <span className="inv-kicker">{kicker}</span>
          <h1 className="inv-cover__names">
            {data.cover.groom}
            <em>&amp;</em>
            {data.cover.bride}
          </h1>
          <div className="inv-cover__meta">
            <span>{data.dateLabel.split(" 오")[0]}</span>
            <i />
            <span>{data.venue.name}</span>
          </div>
          {t.category === "magazine" && (
            <span className="inv-cover__label">{t.accentLabel}</span>
          )}
        </div>
      </section>

      {/* ── GREETING ── */}
      {has("greeting") && (
        <section
          id="sec-greeting"
          data-block="greeting"
          className={sectionClass("greeting")}
        >
          <span className="inv-eyebrow">Invitation</span>
          <h2 className="inv-h2">{data.greeting.title}</h2>
          <p className="inv-greeting">{data.greeting.content}</p>
          <div className="inv-couple-line">
            <span>{data.couple.groom.father} · {data.couple.groom.mother}</span>
            <small>의 {data.couple.groom.relation}</small>
            <strong>{data.couple.groom.name}</strong>
          </div>
          <div className="inv-couple-line">
            <span>{data.couple.bride.father} · {data.couple.bride.mother}</span>
            <small>의 {data.couple.bride.relation}</small>
            <strong>{data.couple.bride.name}</strong>
          </div>
        </section>
      )}

      {/* ── DATE / CALENDAR / D-DAY ── */}
      {has("datetime") && (
        <section
          id="sec-datetime"
          data-block="datetime"
          className={sectionClass("datetime")}
        >
          <span className="inv-eyebrow">Save the date</span>
          <h2 className="inv-h2">{data.dateLabel}</h2>
          <div className="inv-calendar">
            <div className="inv-calendar__head">
              {weekday.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="inv-calendar__grid">
              {cells.map((c, i) => (
                <span
                  key={i}
                  className={c === date.getDate() ? "is-day" : ""}
                >
                  {c ?? ""}
                </span>
              ))}
            </div>
          </div>
          <p className="inv-dday">
            {data.cover.groom} ♥ {data.cover.bride}의 결혼식{" "}
            <strong>D-{dday}</strong>
          </p>
        </section>
      )}

      {/* ── TIMELINE ── */}
      {has("timeline") && (
        <section
          id="sec-timeline"
          data-block="timeline"
          className={sectionClass("timeline")}
        >
          <span className="inv-eyebrow">Our story</span>
          <h2 className="inv-h2">우리의 이야기</h2>
          <ol className="inv-timeline">
            {data.timeline.map((item) => (
              <li key={item.date}>
                <span className="inv-timeline__date">{item.date}</span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── GALLERY ── */}
      {has("gallery") && (
        <section
          id="sec-gallery"
          data-block="gallery"
          className={sectionClass("gallery")}
        >
          <span className="inv-eyebrow">Gallery</span>
          <h2 className="inv-h2">우리의 순간</h2>
          <div className={`inv-gallery mode-${galleryMode}`}>
            {data.gallery.map((src, i) => (
              <figure key={src + i} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        </section>
      )}

      {/* ── VENUE / DIRECTIONS ── */}
      {has("venue") && (
        <section
          id="sec-venue"
          data-block="venue"
          className={sectionClass("venue")}
        >
          <span className="inv-eyebrow">Location</span>
          <h2 className="inv-h2">{data.venue.name}</h2>
          <p className="inv-venue__hall">
            {data.venue.hall}
            <br />
            {data.venue.address}
          </p>
          <div className="inv-map" aria-hidden>
            <span>📍 {data.venue.name}</span>
          </div>
          <dl className="inv-transport">
            {data.venue.transport.subway && (
              <div>
                <dt>지하철</dt>
                <dd>{data.venue.transport.subway}</dd>
              </div>
            )}
            {data.venue.transport.bus && (
              <div>
                <dt>버스</dt>
                <dd>{data.venue.transport.bus}</dd>
              </div>
            )}
            {data.venue.transport.parking && (
              <div>
                <dt>주차</dt>
                <dd>{data.venue.transport.parking}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ── FAMILY / CONTACT ── */}
      {has("family") && (
        <section
          id="sec-family"
          data-block="family"
          className={sectionClass("family")}
        >
          <span className="inv-eyebrow">Family</span>
          <h2 className="inv-h2">마음 전하실 곳</h2>
          <div className="inv-contact">
            {[data.couple.groom, data.couple.bride].map((p, i) => (
              <article key={p.name}>
                <span>{i === 0 ? "신랑측" : "신부측"}</span>
                <strong>{p.name}</strong>
                <small>{p.relation}</small>
                <a href={`tel:${p.phone}`}>📞 {p.phone}</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── ACCOUNT ── */}
      {has("account") && (
        <section
          id="sec-account"
          data-block="account"
          className={sectionClass("account")}
        >
          <span className="inv-eyebrow">Gift</span>
          <h2 className="inv-h2">축의금 전하기</h2>
          {[data.couple.groom, data.couple.bride].map((p, i) => (
            <div className="inv-account" key={p.name}>
              <div>
                <span>{i === 0 ? "신랑" : "신부"} {p.name}</span>
                <strong>
                  {p.bank} {p.account}
                </strong>
              </div>
              <button type="button">복사</button>
            </div>
          ))}
        </section>
      )}

      {/* ── RSVP ── */}
      {has("rsvp") && (
        <section
          id="sec-rsvp"
          data-block="rsvp"
          className={sectionClass("rsvp")}
        >
          <span className="inv-eyebrow">RSVP</span>
          <h2 className="inv-h2">참석 의사 전달</h2>
          <p className="inv-sub">소중한 걸음 전, 참석 여부를 알려주세요.</p>
          <div className="inv-rsvp">
            <button type="button" className="is-primary">
              참석할게요
            </button>
            <button type="button">함께하지 못해요</button>
          </div>
        </section>
      )}

      {/* ── GUESTBOOK ── */}
      {has("guestbook") && (
        <section
          id="sec-guestbook"
          data-block="guestbook"
          className={sectionClass("guestbook")}
        >
          <span className="inv-eyebrow">Guestbook</span>
          <h2 className="inv-h2">축하 메시지</h2>
          <div className="inv-guestbook">
            <article>
              <strong>지윤</strong>
              <p>두 사람의 시작을 진심으로 축하해! 늘 지금처럼 따뜻하길.</p>
            </article>
            <article>
              <strong>민호</strong>
              <p>드디어! 행복하게 잘 살자 친구야 🤍</p>
            </article>
          </div>
          <button type="button" className="inv-ghost">
            축하 메시지 남기기
          </button>
        </section>
      )}

      {/* ── NOTICE ── */}
      {has("notice") && (
        <section
          id="sec-notice"
          data-block="notice"
          className={sectionClass("notice")}
        >
          <span className="inv-eyebrow">Notice</span>
          <h2 className="inv-h2">안내 말씀</h2>
          <ul className="inv-notice">
            {data.notice.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── ENDING ── */}
      {has("ending") && (
        <section
          id="sec-ending"
          data-block="ending"
          className={sectionClass("ending", "inv-end")}
        >
          <div
            className="inv-end__photo"
            style={{ backgroundImage: `url(${data.gallery[0]})` }}
          />
          <div className="inv-end__veil" />
          <div className="inv-end__inner">
            <p>{data.ending}</p>
            <strong>
              {data.cover.groom} &amp; {data.cover.bride}
            </strong>
            <button type="button" className="inv-share">
              청첩장 공유하기
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
