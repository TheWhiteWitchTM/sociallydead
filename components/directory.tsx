"use client";

import { GlobeIcon, PlayIcon, SearchIcon, SkyIcon, XIcon } from "@/components/icons";
import {
  DIRECTORY_FILTER,
  DIRECTORY_KIND,
  isKind,
  type DirectoryFilterDetail,
  type DirectoryKind,
} from "@/lib/directory-filter";
import {
  CATALOGS,
  CATALOG_LABEL,
  type Catalog,
  type DirectoryData,
  type Entry,
} from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

type Kind = DirectoryKind;
type SortMode = "az" | "new";
type Row = { catalog: Catalog; entry: Entry };

const KIND_LABEL: Record<Kind, string> = {
  all: "All",
  ...CATALOG_LABEL,
};

function haystack(entry: Entry): string {
  return [entry.name, entry.handle, entry.blurb, entry.region, entry.language, entry.tags.join(" "), entry.url]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function compare(a: Entry, b: Entry, mode: SortMode): number {
  const pin = Number(Boolean(b.pin)) - Number(Boolean(a.pin));
  if (pin) return pin;
  if (mode === "new") {
    const byDate = (b.added ?? "").localeCompare(a.added ?? "");
    if (byDate) return byDate;
  }
  return a.name.localeCompare(b.name, "en");
}

function labelFor(kind: Catalog, entry: Entry): string {
  if (entry.handle) return `@${entry.handle.replace(/^@/, "")}`;
  try {
    return new URL(entry.url).host.replace(/^www\./, "");
  } catch {
    return kind;
  }
}

function Glyph({ kind }: { kind: Catalog }) {
  if (kind === "websites") return <GlobeIcon />;
  if (kind === "youtube") return <PlayIcon />;
  if (kind === "x") return <XIcon />;
  return <SkyIcon />;
}

function topTags(entries: Entry[], selected: string | null): string[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const tags = [...counts.keys()].sort(
    (a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || a.localeCompare(b),
  );
  const top = tags.slice(0, 16);
  if (selected && !top.includes(selected)) top.push(selected);
  return top;
}

function hostGroups(rows: Row[]): Row[][] {
  const groups: Row[][] = [];
  const index = new Map<string, Row[]>();
  for (const row of rows) {
    if (!row.entry.pin) continue;
    const key = row.entry.name;
    let group = index.get(key);
    if (!group) {
      group = [];
      index.set(key, group);
      groups.push(group);
    }
    group.push(row);
  }
  for (const group of groups) {
    group.sort((a, b) => CATALOGS.indexOf(a.catalog) - CATALOGS.indexOf(b.catalog));
  }
  return groups;
}

function HostShelf({ group }: { group: Row[] }) {
  const blurb = (group.find((row) => row.catalog === "websites") ?? group[0]).entry.blurb;
  return (
    <aside className="host-shelf" aria-label={group[0].entry.name}>
      <p className="kicker">Kept by</p>
      <h3 className="host-name">{group[0].entry.name}</h3>
      <p className="host-blurb">{blurb}</p>
      <div className="host-links">
        {group.map(({ catalog, entry }) => (
          <a key={catalog} className="host-link" href={entry.url} target="_blank" rel="noopener noreferrer">
            <span className={`glyph ${catalog}`}>
              <Glyph kind={catalog} />
            </span>
            <span className="min-w-0">
              <span className="host-link-kind">{CATALOG_LABEL[catalog]}</span>
              <span className="host-link-handle">{labelFor(catalog, entry)}</span>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function Directory({ data }: { data: DirectoryData }) {
  const [kind, setKind] = useState<Kind>("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("az");
  const searchRef = useRef<HTMLInputElement>(null);
  const hydrated = useRef(false);

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
      if (params.get("sort") === "new") setSort("new");
      return;
    }

    const params = new URLSearchParams();
    const theme = new URLSearchParams(window.location.search).get("theme");
    if (theme === "light" || theme === "dark") params.set("theme", theme);
    if (kind !== "all") params.set("kind", kind);
    if (query.trim()) params.set("q", query.trim());
    if (tag) params.set("tag", tag);
    if (sort !== "az") params.set("sort", sort);
    const next = params.toString();
    const url = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [kind, query, tag, sort]);

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
        setSort("az");
        return;
      }
      if (detail.kind) setKind(detail.kind);
    }
    window.addEventListener(DIRECTORY_FILTER, onFilter);
    return () => window.removeEventListener(DIRECTORY_FILTER, onFilter);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const result: Record<Kind, number> = {
      all: 0,
      websites: data.websites.length,
      youtube: data.youtube.length,
      x: data.x.length,
      bluesky: data.bluesky.length,
    };
    result.all = CATALOGS.reduce((sum, catalog) => sum + result[catalog], 0);
    return result;
  }, [data]);

  const pool = useMemo(() => {
    const catalogs = kind === "all" ? CATALOGS : [kind];
    return catalogs.flatMap((catalog) => data[catalog].map((entry) => ({ catalog, entry })));
  }, [data, kind]);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matched = pool.filter(({ entry }) => {
    if (tag && !entry.tags.includes(tag)) return false;
    if (terms.length === 0) return true;
    const hay = haystack(entry);
    return terms.every((term) => hay.includes(term));
  });
  matched.sort((a, b) => compare(a.entry, b.entry, sort) || a.catalog.localeCompare(b.catalog));

  const tags = topTags(
    pool.map((item) => item.entry),
    tag,
  );
  const filtering = Boolean(query.trim() || tag || kind !== "all");
  const hosts = hostGroups(matched);
  const rest = matched.filter((row) => !row.entry.pin);

  return (
    <section id="directory" className="mx-auto max-w-[1180px] px-5 pt-2 pb-8">
      <h2 className="sr-only">Directory</h2>
      <div className="rule mb-5" aria-hidden="true">
        <span>the desks</span>
      </div>
      <div className="toolbar">
        <label className="search-wrap">
          <span className="sr-only">Search the directory</span>
          <SearchIcon />
          <input
            ref={searchRef}
            className="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search names, handles, tags"
            type="search"
            autoComplete="off"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          ) : null}
        </label>
        <div className="catalogs" role="toolbar" aria-label="Catalogs">
          {(["all", ...CATALOGS] as Kind[]).map((item) => (
            <button key={item} type="button" aria-pressed={kind === item} onClick={() => setKind(item)}>
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
                {item}
              </button>
            ))}
            {filtering ? (
              <button
                type="button"
                className="linkish"
                onClick={() => {
                  setKind("all");
                  setQuery("");
                  setTag(null);
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="result-line" aria-live="polite">
        {matched.length} {matched.length === 1 ? "listing" : "listings"}
        {tag ? ` tagged ${tag}` : ""}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {hosts.length === 0 && rest.length === 0 ? (
        <div className="panel empty-state">
          <p className="empty-title">Nothing under that name yet.</p>
          <p className="empty-hint">Try another word, or clear the filters.</p>
        </div>
      ) : (
        <>
          {hosts.map((group) => (
            <HostShelf key={group[0].entry.name} group={group} />
          ))}
          {rest.length > 0 ? (
            <ul className="listing-grid">
              {rest.map(({ catalog, entry }) => (
                <li key={`${catalog}-${entry.id}`}>
                  <a className="card" href={entry.url} target="_blank" rel="noopener noreferrer">
                    <span className="card-row">
                      <span className={`glyph ${catalog}`}>
                        <Glyph kind={catalog} />
                      </span>
                      <span className="card-body">
                        <span className="card-title-row">
                          <span className="card-title">{entry.name}</span>
                          <span className="out" aria-hidden="true">
                            ↗
                          </span>
                        </span>
                        <span className="card-meta">
                          <span className="handle">{labelFor(catalog, entry)}</span>
                          <span className="text-muted">
                            {" · "}
                            {CATALOG_LABEL[catalog]}
                            {entry.region ? ` · ${entry.region}` : ""}
                          </span>
                        </span>
                        <span className="card-blurb">{entry.blurb}</span>
                        {entry.tags.length > 0 ? (
                          <span className="card-tags">
                            {entry.tags
                              .filter((item) => item !== "host")
                              .map((item) => (
                                <span key={item} className="chip static">
                                  {item}
                                </span>
                              ))}
                          </span>
                        ) : null}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
