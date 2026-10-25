"use client";

import { GlobeIcon, MicIcon, NewsIcon, OrgIcon, PeopleIcon, PlayIcon, SearchIcon, SkyIcon, StarIcon, UkraineFlagIcon, XIcon } from "@/components/icons";
import { asset } from "@/lib/asset";
import { CATEGORIES, labelTag, SHELF_BLURB, SHELF_LABEL, sortTags } from "@/lib/categories";
import {
  DIRECTORY_FILTER,
  DIRECTORY_KIND,
  DIRECTORY_QUERY,
  isKind,
  type DirectoryFilterDetail,
  type DirectoryKind,
} from "@/lib/directory-filter";
import { type OrgGroup, type Presence } from "@/lib/groups";
import { CATALOGS, CATALOG_LABEL, type Catalog } from "@/lib/types";
import { UKRAINE_BLURB, UKRAINE_LABEL, supportsUkraine, type DirectoryShelf } from "@/lib/ukraine";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";

type Kind = DirectoryKind;
type SortMode = "az" | "new";

const KIND_LABEL: Record<Kind, string> = {
  all: "All",
  featured: "Featured",
  ...CATALOG_LABEL,
};

const KIND_ORDER: Kind[] = ["featured", "all", ...CATALOGS];
const SHELF_ICON = {
  people: PeopleIcon,
  shows: MicIcon,
  news: NewsIcon,
  organizations: OrgIcon,
} as const;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function indexLetter(name: string): string {
  const stripped = name.replace(/^the\s+/i, "");
  const letter = stripped.charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
}

function haystack(group: OrgGroup): string {
  const parts: Array<string | undefined> = [
    group.name,
    group.blurb,
    group.region,
    group.category,
    SHELF_LABEL[group.category],
    group.tags.join(" "),
    group.tags.map(labelTag).join(" "),
  ];
  for (const { entry } of group.presences) {
    parts.push(entry.name, entry.handle, entry.blurb, entry.url, entry.language, entry.region);
  }
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function compareGroups(a: OrgGroup, b: OrgGroup, mode: SortMode): number {
  const pin = Number(b.pin) - Number(a.pin);
  if (pin) return pin;
  if (mode === "new") {
    const byDate = (b.added ?? "").localeCompare(a.added ?? "");
    if (byDate) return byDate;
  }
  return a.name.localeCompare(b.name, "en");
}

function labelFor(entry: Presence["entry"]): string {
  if (entry.handle) return `@${entry.handle.replace(/^@/, "")}`;
  try {
    return new URL(entry.url).host.replace(/^www\./, "");
  } catch {
    return entry.url;
  }
}

function Glyph({ kind }: { kind: Catalog }) {
  if (kind === "websites") return <GlobeIcon />;
  if (kind === "youtube") return <PlayIcon />;
  if (kind === "x") return <XIcon />;
  return <SkyIcon />;
}

function primaryOf(group: OrgGroup, kind: Kind): Presence {
  if (kind !== "all" && kind !== "featured") {
    const picked = group.presences.find((item) => item.catalog === kind);
    if (picked) return picked;
  }
  return group.presences.find((item) => item.catalog === "websites") ?? group.presences[0];
}

function blurbFor(group: OrgGroup, kind: Kind): string {
  if (kind !== "all" && kind !== "featured") {
    const picked = group.presences.find((item) => item.catalog === kind);
    if (picked) return picked.entry.blurb;
  }
  return group.blurb;
}

function topTags(groups: OrgGroup[], selected: string | null): string[] {
  const counts = new Map<string, number>();
  for (const group of groups) {
    for (const tag of group.tags) {
      if (tag === "host") continue;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const tags = sortTags([...counts.keys()]);
  const top = tags.slice(0, 18);
  if (selected && !top.includes(selected)) top.push(selected);
  return top;
}

function placePop(event: SyntheticEvent<HTMLElement>) {
  const card = event.currentTarget;
  const pop = card.querySelector(".hover-card-pop");
  if (!(pop instanceof HTMLElement)) return;
  const rect = card.getBoundingClientRect();
  const width = Math.min(340, window.innerWidth - 24);
  const overflowRight = rect.left + width > window.innerWidth - 12;
  pop.style.left = overflowRight ? "auto" : "0px";
  pop.style.right = overflowRight ? "0px" : "auto";
  const below = window.innerHeight - rect.bottom;
  pop.classList.toggle("above", below < 220 && rect.top > 240);
}

function shelfHref(shelf: DirectoryShelf) {
  return shelf === "all" ? "/" : `/${shelf}/`;
}

function OrgCard({ group, kind }: { group: OrgGroup; kind: Kind }) {
  const primary = primaryOf(group, kind);
  const blurb = blurbFor(group, kind);
  const tags = group.tags.filter((item) => item !== "host");
  return (
    <article
      className={group.featured ? "hover-card is-featured" : "hover-card"}
      onMouseEnter={placePop}
      onFocusCapture={placePop}
    >
      <a className="hover-card-main" href={primary.entry.url} target="_blank" rel="noopener noreferrer">
        {group.thumb ? (
          <img className="card-thumb" src={asset(group.thumb)} alt="" width={80} height={80} loading="lazy" />
        ) : null}
        <span className="card-copy">
          <span className="card-title">{group.name}</span>
          <span className="card-meta">
            <span className="shelf-name">{SHELF_LABEL[group.category]}</span>
            <span className="handle">{labelFor(primary.entry)}</span>
            {group.region ? <span className="text-muted"> · {group.region}</span> : null}
          </span>
          <span className="card-blurb">{blurb}</span>
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span className="platform-row">
        {group.presences.map(({ catalog, entry }) => (
          <a
            key={catalog}
            className={`glyph ${catalog}${catalog === primary.catalog ? " is-primary" : ""}`}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${group.name} on ${CATALOG_LABEL[catalog]}, ${labelFor(entry)}`}
          >
            <Glyph kind={catalog} />
          </a>
        ))}
      </span>
      <div className="hover-card-pop" aria-hidden="true">
        <span className="pop-head">
          {group.thumb ? <img className="pop-thumb" src={asset(group.thumb)} alt="" width={112} height={112} /> : null}
          <span className="pop-head-copy">
            <span className="pop-kicker">
              {group.featured ? "Featured · " : ""}
              {SHELF_LABEL[group.category]}
              {" · "}
              {group.presences.map((item) => CATALOG_LABEL[item.catalog]).join(" · ")}
              {group.region ? ` · ${group.region}` : ""}
            </span>
            <span className="pop-title">{group.name}</span>
          </span>
        </span>
        <span className="pop-blurb">{blurb}</span>
        <span className="pop-links">
          {group.presences.map(({ catalog, entry }) => (
            <span key={catalog} className="pop-link">
              <span className={`glyph ${catalog}`}>
                <Glyph kind={catalog} />
              </span>
              <span>
                <span className="pop-link-name">{CATALOG_LABEL[catalog]}</span>
                <span className="pop-link-handle">{labelFor(entry)}</span>
              </span>
            </span>
          ))}
        </span>
        {tags.length > 0 ? (
          <span className="card-tags">
            {tags.map((item) => (
              <span key={item} className="chip static">
                {labelTag(item)}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function Listing({ groups, kind }: { groups: OrgGroup[]; kind: Kind }) {
  return (
    <ul className="listing-grid">
      {groups.map((group) => (
        <li key={group.id}>
          <OrgCard group={group} kind={kind} />
        </li>
      ))}
    </ul>
  );
}

export function Directory({ groups, shelf }: { groups: OrgGroup[]; shelf: DirectoryShelf }) {
  const [kind, setKind] = useState<Kind>("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("az");
  const searchRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);
  const queryReady = useRef(false);
  const queryFromHeader = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("kind");
      if (isKind(requested)) setKind(requested);
      const q = params.get("q");
      if (q) setQuery(q);
      const requestedTag = params.get("tag");
      if (requestedTag) setTag(requestedTag);
      const requestedLetter = params.get("letter")?.toUpperCase() ?? "";
      if (LETTERS.includes(requestedLetter)) setLetter(requestedLetter);
      if (params.get("sort") === "new") setSort("new");
      return;
    }

    const params = new URLSearchParams();
    const theme = new URLSearchParams(window.location.search).get("theme");
    if (theme === "light" || theme === "dark") params.set("theme", theme);
    if (kind !== "all") params.set("kind", kind);
    if (query.trim()) params.set("q", query.trim());
    if (tag) params.set("tag", tag);
    if (letter) params.set("letter", letter);
    if (sort !== "az") params.set("sort", sort);
    const next = params.toString();
    const url = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [kind, query, tag, letter, sort]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(DIRECTORY_KIND, { detail: kind }));
  }, [kind]);

  useEffect(() => {
    function onFilter(event: Event) {
      const detail = (event as CustomEvent<DirectoryFilterDetail>).detail ?? {};
      if (detail.reset) {
        setKind("all");
        setQuery("");
        setTag(null);
        setLetter(null);
        setSort("az");
        return;
      }
      if (detail.kind) setKind(detail.kind);
      if (typeof detail.query === "string") {
        const next = detail.query;
        setQuery((current) => {
          if (current === next) return current;
          queryFromHeader.current = true;
          return next;
        });
      }
    }
    window.addEventListener(DIRECTORY_FILTER, onFilter);
    return () => window.removeEventListener(DIRECTORY_FILTER, onFilter);
  }, []);

  useEffect(() => {
    if (!queryReady.current) {
      queryReady.current = true;
      return;
    }
    if (queryFromHeader.current) {
      queryFromHeader.current = false;
      return;
    }
    window.dispatchEvent(new CustomEvent(DIRECTORY_QUERY, { detail: query }));
  }, [query]);

  const onShelf = useMemo(() => {
    if (shelf === "all") return groups;
    if (shelf === "ukraine") return groups.filter(supportsUkraine);
    return groups.filter((group) => group.category === shelf);
  }, [groups, shelf]);

  const ukraineCount = useMemo(() => groups.filter(supportsUkraine).length, [groups]);

  const shelfCounts = useMemo(() => {
    const result = { all: groups.length, people: 0, shows: 0, news: 0, organizations: 0 };
    for (const group of groups) result[group.category] += 1;
    return result;
  }, [groups]);

  const counts = useMemo(() => {
    const result: Record<Kind, number> = {
      all: onShelf.length,
      featured: 0,
      websites: 0,
      youtube: 0,
      x: 0,
      bluesky: 0,
    };
    for (const group of onShelf) {
      if (group.featured) result.featured += 1;
      for (const { catalog } of group.presences) result[catalog] += 1;
    }
    return result;
  }, [onShelf]);

  const pool = useMemo(() => {
    if (kind === "all") return onShelf;
    if (kind === "featured") return onShelf.filter((group) => group.featured);
    return onShelf.filter((group) => group.presences.some((item) => item.catalog === kind));
  }, [onShelf, kind]);

  const presentLetters = useMemo(() => {
    const found = new Set<string>();
    for (const group of pool) found.add(indexLetter(group.name));
    return found;
  }, [pool]);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matched = pool.filter((group) => {
    if (tag && !group.tags.includes(tag)) return false;
    if (letter && indexLetter(group.name) !== letter) return false;
    if (terms.length === 0) return true;
    const hay = haystack(group);
    return terms.every((term) => hay.includes(term));
  });
  matched.sort((a, b) => compareGroups(a, b, sort));

  const tags = topTags(pool, tag);
  const filtering = Boolean(query.trim() || tag || letter || kind !== "all");
  const featured = matched.filter((group) => group.featured);
  const rest = matched.filter((group) => !group.featured);
  const ukraineRows = matched.filter(supportsUkraine);
  const sectioned = shelf === "all" && !query.trim() && !tag && !letter && kind !== "featured";

  function clearFilters() {
    setKind("all");
    setQuery("");
    setTag(null);
    setLetter(null);
  }

  return (
    <section id="directory" className="mx-auto max-w-[1180px] px-5 pt-2 pb-8">
      <h2 className="sr-only">Directory</h2>
      <div className="rule mb-5" aria-hidden="true">
        <span className={shelf === "ukraine" ? "with-flag" : undefined}>
          {shelf === "ukraine" ? <UkraineFlagIcon className="ua-flag" /> : null}
          {shelf === "all" ? "the desks" : shelf === "ukraine" ? UKRAINE_LABEL : SHELF_LABEL[shelf].toLowerCase()}
        </span>
      </div>
      {shelf === "ukraine" ? <p className="shelf-intro">{UKRAINE_BLURB}</p> : null}
      {shelf !== "all" && shelf !== "ukraine" ? <p className="shelf-intro">{SHELF_BLURB[shelf]}</p> : null}
      <div className="toolbar">
        <label className="search-wrap">
          <span className="sr-only">Search the directory</span>
          <SearchIcon />
          <input
            ref={searchRef}
            className="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search names, hosts, shows, tags"
            type="search"
            autoComplete="off"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          ) : null}
        </label>
        <div className="filter-line">
          <span className="filter-label" id="shelf-label">
            Browse
          </span>
          <div className="catalogs" role="navigation" aria-labelledby="shelf-label">
            <Link href={shelfHref("all")} aria-current={shelf === "all" ? "page" : undefined}>
              All
              <span className="count">{shelfCounts.all}</span>
            </Link>
            {CATEGORIES.map((item) => {
              const Icon = SHELF_ICON[item];
              const link = (
                <Link key={item} href={shelfHref(item)} aria-current={shelf === item ? "page" : undefined}>
                  <Icon />
                  {SHELF_LABEL[item]}
                  <span className="count">{shelfCounts[item]}</span>
                </Link>
              );
              if (item !== "people") return link;
              return (
                <Fragment key={item}>
                  {link}
                  <Link href={shelfHref("ukraine")} aria-current={shelf === "ukraine" ? "page" : undefined}>
                    <UkraineFlagIcon className="ua-flag" />
                    {UKRAINE_LABEL}
                    <span className="count">{ukraineCount}</span>
                  </Link>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="filter-line">
          <span className="filter-label" id="where-label">
            Where
          </span>
          <div className="catalogs" role="toolbar" aria-labelledby="where-label">
            {KIND_ORDER.map((item) => (
              <button key={item} type="button" aria-pressed={kind === item} onClick={() => setKind(item)}>
                {item === "featured" ? <StarIcon /> : null}
                {KIND_LABEL[item]}
                <span className="count">{counts[item]}</span>
              </button>
            ))}
            <button
              type="button"
              className="sort"
              onClick={() => setSort((current) => (current === "az" ? "new" : "az"))}
              aria-pressed={sort === "new"}
            >
              {sort === "az" ? "A–Z" : "Newest"}
            </button>
          </div>
        </div>
        <div className="alpha" role="toolbar" aria-label="Jump by letter">
          {LETTERS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={letter === item}
              disabled={!presentLetters.has(item)}
              onClick={() => setLetter((current) => (current === item ? null : item))}
            >
              {item}
            </button>
          ))}
        </div>
        {tags.length > 0 ? (
          <div className="tag-row">
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                aria-pressed={tag === item}
                onClick={() => setTag((current) => (current === item ? null : item))}
              >
                {labelTag(item)}
              </button>
            ))}
            {filtering ? (
              <button type="button" className="linkish" onClick={clearFilters}>
                Clear
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="result-line" aria-live="polite">
        {matched.length} {matched.length === 1 ? "listing" : "listings"}
        {shelf === "ukraine" ? ` in ${UKRAINE_LABEL}` : shelf !== "all" ? ` in ${SHELF_LABEL[shelf]}` : ""}
        {tag ? ` tagged ${labelTag(tag)}` : ""}
        {letter ? ` under ${letter}` : ""}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {featured.length === 0 && rest.length === 0 ? (
        <div className="panel empty-state">
          <p className="empty-title">Nothing under that name yet.</p>
          <p className="empty-hint">Try another word, or clear the filters.</p>
        </div>
      ) : (
        <>
          {kind !== "featured" && featured.length > 0 ? (
            <div className="featured-block">
              <h3 className="featured-label">
                <span className="section-mark">
                  <StarIcon /> Featured
                </span>
              </h3>
              <ul className="listing-grid">
                {featured.map((group) => (
                  <li key={`featured-${group.id}`}>
                    <OrgCard group={group} kind={kind} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {kind === "featured" ? <Listing groups={matched} kind={kind} /> : null}
          {kind !== "featured" && sectioned && ukraineRows.length > 0 ? (
            <section className="shelf-block" aria-labelledby="shelf-ukraine">
              <div className="shelf-heading">
                <h3 id="shelf-ukraine">
                  <span className="section-mark">
                    <UkraineFlagIcon className="ua-flag" /> {UKRAINE_LABEL}
                  </span>
                </h3>
                <Link href={shelfHref("ukraine")}>Open {UKRAINE_LABEL}</Link>
              </div>
              <Listing groups={ukraineRows} kind={kind} />
            </section>
          ) : null}
          {kind !== "featured" && sectioned
            ? CATEGORIES.map((item) => {
                const rows = rest.filter((group) => group.category === item && !supportsUkraine(group));
                if (rows.length === 0) return null;
                const Icon = SHELF_ICON[item];
                return (
                  <section key={item} className="shelf-block" aria-labelledby={`shelf-${item}`}>
                    <div className="shelf-heading">
                      <h3 id={`shelf-${item}`}>
                        <span className="section-mark">
                          <Icon /> {SHELF_LABEL[item]}
                        </span>
                      </h3>
                      <Link href={shelfHref(item)}>Open {SHELF_LABEL[item]}</Link>
                    </div>
                    <Listing groups={rows} kind={kind} />
                  </section>
                );
              })
            : null}
          {kind !== "featured" && !sectioned && rest.length > 0 ? <Listing groups={rest} kind={kind} /> : null}
        </>
      )}
    </section>
  );
}
