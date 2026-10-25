"use client";

import { GlobeIcon, PlayIcon, SearchIcon, SkyIcon, XIcon } from "@/components/icons";
import {
  CATALOGS,
  CATALOG_LABEL,
  type Catalog,
  type DirectoryData,
  type Entry,
} from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

type Kind = "all" | Catalog;
type SortMode = "az" | "new";

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

export function Directory({ data }: { data: DirectoryData }) {
  const [kind, setKind] = useState<Kind>("all");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("az");

  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("kind");
      if (requested === "all" || (CATALOGS as readonly string[]).includes(requested ?? "")) {
        setKind(requested as Kind);
      }
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

  return (
    <section id="directory" className="mx-auto max-w-[1120px] px-5 pt-6 pb-4">
      <div className="rule mb-6" aria-hidden="true">
        <span>resist</span>
      </div>
      <div className="toolbar">
        <div className="catalogs" role="toolbar" aria-label="Catalogs">
          {(["all", ...CATALOGS] as Kind[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={kind === item}
              onClick={() => setKind(item)}
            >
              {KIND_LABEL[item]}
              <span className="count">{counts[item]}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
          <label className="search-wrap min-w-0 flex-1">
            <span className="sr-only">Search the directory</span>
            <SearchIcon />
            <input
              className="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search names, handles, places, tags"
              type="search"
            />
          </label>
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
          <div className="flex flex-wrap gap-2 pb-4">
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
                className="linkish ml-1 text-sm"
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

      <p className="mt-2 mb-4 text-sm text-muted" aria-live="polite">
        {matched.length} {matched.length === 1 ? "listing" : "listings"}
        {tag ? ` tagged ${tag}` : ""}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {matched.length === 0 ? (
        <div className="panel px-6 py-10 text-center">
          <p className="m-0 font-display text-3xl italic">Nothing under that name yet.</p>
          <p className="mt-2 mb-0 text-muted">Try another word, or clear the filters.</p>
        </div>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
          {matched.map(({ catalog, entry }) => (
            <li key={`${catalog}-${entry.id}`}>
              <a
                className="card px-4 py-4"
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="flex items-start gap-3">
                  <span className={`glyph ${catalog}`}>
                    <Glyph kind={catalog} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-[15px] leading-snug font-extrabold tracking-tight">{entry.name}</span>
                      <span className="out" aria-hidden="true">
                        ↗
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-sm">
                      <span className="handle">{labelFor(catalog, entry)}</span>
                      <span className="text-muted">
                        {" · "}
                        {CATALOG_LABEL[catalog]}
                        {entry.region ? ` · ${entry.region}` : ""}
                      </span>
                    </span>
                    <span className="mt-2 block text-[15px] leading-relaxed">{entry.blurb}</span>
                    {entry.tags.length > 0 || entry.pin ? (
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {entry.pin ? <span className="chip static host">Host</span> : null}
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
      )}

      <div className="panel mt-8 px-5 py-5 sm:px-6">
        <h2 className="m-0 text-base font-extrabold tracking-tight">Add a desk</h2>
        <p className="mt-2 mb-0 max-w-3xl leading-relaxed text-muted">
          The lists are JSON: <code>data/websites.json</code>, <code>data/youtube.json</code>,{" "}
          <code>data/x.json</code>, and <code>data/bluesky.json</code>. Edit them with{" "}
          <code>tools/edit-directory.sh</code>, then open a pull request. A listing is a pointer to a
          public site or profile. It is not a claim that every post from that account matches this
          directory.
        </p>
        <p className="mt-3 mb-0">
          <a className="font-extrabold text-blue" href="https://github.com/TheWhiteWitchTM/sociallydead">
            github.com/TheWhiteWitchTM/sociallydead
          </a>
        </p>
      </div>
    </section>
  );
}
