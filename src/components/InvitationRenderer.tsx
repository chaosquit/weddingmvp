"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import type { InvitationData } from "../data/invitationData";
import type {
  CoverMotion,
  FontFamily,
  Template,
  TemplatePalette,
} from "../data/templates";

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

export type EditKey =
  | "cover.title"
  | "cover.groom"
  | "cover.bride"
  | "greeting.title"
  | "greeting.content"
  | "dateLabel"
  | "venue.name"
  | "venue.hall"
  | "venue.address"
  | "ending";

export interface Override {
  palette?: Partial<TemplatePalette>;
  font?: FontFamily;
  motion?: CoverMotion;
}

interface Props {
  template: Template;
  data: InvitationData;
  enabledBlocks: string[];
  galleryMode?: GalleryMode;
  activeBlock?: string | null;
  editable?: boolean;
  override?: Override;
  onSelectBlock?: (id: RenderBlock) => void;
  onEdit?: (key: EditKey, value: string) => void;
}

const fontVar: Record<FontFamily, string> = {
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
  editable = false,
  override,
  onSelectBlock,
  onEdit,
}: Props) {
  const has = (id: RenderBlock) => enabledBlocks.includes(id);
  const t = template;
  const isMag = t.category === "magazine";
  const palette: TemplatePalette = { ...t.palette, ...(override?.palette ?? {}) };
  const font = override?.font ?? t.font;
  const motion = override?.motion ?? t.motion;

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
    "--ink": palette.ink,
    "--paper": palette.paper,
    "--accent": palette.accent,
    "--soft": palette.soft,
    "--line": palette.line,
    "--inv-font": fontVar[font],
  } as CSSProperties;

  // inline-editable text node
  const E = ({
    k,
    value,
    tag = "span",
    className,
    multiline = false,
  }: {
    k: EditKey;
    value: string;
    tag?: "span" | "h1" | "h2" | "p" | "strong";
    className?: string;
    multiline?: boolean;
  }) => {
    const Tag = tag as ElementType;
    if (!editable) {
      return <Tag className={className}>{value}</Tag>;
    }
    return (
      <Tag
        className={`${className ?? ""} inv-edit`.trim()}
        contentEditable
        suppressContentEditableWarning
        onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
        onBlur={(e: { currentTarget: HTMLElement }) => {
          const text = multiline
            ? e.currentTarget.innerText
            : e.currentTarget.textContent ?? "";
          onEdit?.(k, text);
        }}
      >
        {value}
      </Tag>
    );
  };

  const sectionProps = (key: RenderBlock, extra = "") => ({
    id: `sec-${key}`,
    "data-block": key,
    className: `inv-sec ${extra} ${activeBlock === key ? "is-active" : ""} ${
      editable ? "is-edit" : ""
    }`.trim(),
    onClick: editable ? () => onSelectBlock?.(key) : undefined,
  });

  const SectionLabel = ({ children }: { children: ReactNode }) => (
    <span className="inv-eyebrow">{children}</span>
  );

  return (
    <div
      className={`inv inv--${t.category} cover--${t.cover} font--${font} motion-${motion} ${
        t.uppercase ? "is-upper" : ""
      } ${t.grain ? "has-grain" : ""}`}
      style={style}
    >
      {/* ── COVER ── */}
      <section {...sectionProps("cover", "inv-cover")}>
        <div
          className="inv-cover__photo"
          style={{ backgroundImage: `url(${t.coverPhoto})` }}
        />
        <div className="inv-cover__veil" />
        <div className="inv-cover__inner">
          <span className="inv-kicker">{kicker}</span>
          <h1 className="inv-cover__names">
            <E k="cover.groom" value={data.cover.groom} tag="span" className="inv-cover__name" />
            <em>&amp;</em>
            <E k="cover.bride" value={data.cover.bride} tag="span" className="inv-cover__name" />
          </h1>
          <div className="inv-cover__meta">
            <span>{data.dateLabel.split(" 오")[0]}</span>
            <i />
            <span>{data.venue.name}</span>
          </div>
          {isMag && <span className="inv-cover__label">{t.accentLabel}</span>}
        </div>
        {motion === "grain" && <div className="inv-cover__grain" />}
      </section>

      {/* ── MAGAZINE MARQUEE TICKER ── */}
      {isMag && (
        <div className="inv-ticker" aria-hidden>
          <div className="inv-ticker__track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                {data.cover.groom} <b>&amp;</b> {data.cover.bride}
                <i>✦</i>
                {data.dateLabel.split(" 오")[0]}
                <i>✦</i>
                {data.venue.name}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── GREETING ── */}
      {has("greeting") && (
        <section {...sectionProps("greeting")}>
          <SectionLabel>Invitation</SectionLabel>
          <E k="greeting.title" value={data.greeting.title} tag="h2" className="inv-h2" />
          <E
            k="greeting.content"
            value={data.greeting.content}
            tag="p"
            className="inv-greeting"
            multiline
          />
          <div className="inv-couple-line">
            <span>
              {data.couple.groom.father} · {data.couple.groom.mother}
            </span>
            <small>의 {data.couple.groom.relation}</small>
            <strong>{data.couple.groom.name}</strong>
          </div>
          <div className="inv-couple-line">
            <span>
              {data.couple.bride.father} · {data.couple.bride.mother}
            </span>
            <small>의 {data.couple.bride.relation}</small>
            <strong>{data.couple.bride.name}</strong>
          </div>
        </section>
      )}

      {/* ── DATE / CALENDAR / D-DAY ── */}
      {has("datetime") && (
        <section {...sectionProps("datetime")}>
          <SectionLabel>Save the date</SectionLabel>
          <E k="dateLabel" value={data.dateLabel} tag="h2" className="inv-h2" />
          <div className="inv-calendar">
            <div className="inv-calendar__head">
              {weekday.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
            <div className="inv-calendar__grid">
              {cells.map((c, i) => (
                <span key={i} className={c === date.getDate() ? "is-day" : ""}>
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
        <section {...sectionProps("timeline")}>
          <SectionLabel>Our story</SectionLabel>
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
        <section {...sectionProps("gallery")}>
          <SectionLabel>Gallery</SectionLabel>
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
        <section {...sectionProps("venue")}>
          <SectionLabel>Location</SectionLabel>
          <E k="venue.name" value={data.venue.name} tag="h2" className="inv-h2" />
          <p className="inv-venue__hall">
            <E k="venue.hall" value={data.venue.hall} tag="span" />
            <br />
            <E k="venue.address" value={data.venue.address} tag="span" />
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
        <section {...sectionProps("family")}>
          <SectionLabel>Family</SectionLabel>
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
        <section {...sectionProps("account")}>
          <SectionLabel>Gift</SectionLabel>
          <h2 className="inv-h2">축의금 전하기</h2>
          {[data.couple.groom, data.couple.bride].map((p, i) => (
            <div className="inv-account" key={p.name}>
              <div>
                <span>
                  {i === 0 ? "신랑" : "신부"} {p.name}
                </span>
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
        <section {...sectionProps("rsvp")}>
          <SectionLabel>RSVP</SectionLabel>
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
        <section {...sectionProps("guestbook")}>
          <SectionLabel>Guestbook</SectionLabel>
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
        <section {...sectionProps("notice")}>
          <SectionLabel>Notice</SectionLabel>
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
        <section {...sectionProps("ending", "inv-end")}>
          <div
            className="inv-end__photo"
            style={{ backgroundImage: `url(${data.gallery[data.gallery.length - 1]})` }}
          />
          <div className="inv-end__veil" />
          <div className="inv-end__inner">
            <E k="ending" value={data.ending} tag="p" multiline />
            <strong>
              {data.cover.groom} &amp; {data.cover.bride}
            </strong>
            {isMag && (
              <div className="inv-barcode" aria-hidden>
                <i />
                <span>ISSUE No.0912 — 2026</span>
              </div>
            )}
            <button type="button" className="inv-share">
              청첩장 공유하기
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
