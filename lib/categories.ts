export const CATEGORIES = ["people", "shows", "news", "organizations"] as const;

export type Shelf = (typeof CATEGORIES)[number];

export const SHELF_LABEL: Record<Shelf, string> = {
  people: "People",
  shows: "Shows",
  news: "News",
  organizations: "Organizations",
};

export const SHELF_BLURB: Record<Shelf, string> = {
  people: "Hosts, reporters, and writers pushing back on MAGA, the AfD, and the far right.",
  shows: "Late-night talk, political satire, and programs with a public desk.",
  news: "Newsrooms, newsletters, and fact-checkers.",
  organizations: "Legal groups, watchdogs, researchers, and campaigns.",
};

export const SHELF_NOUN: Record<Shelf, string> = {
  people: "people",
  shows: "shows",
  news: "news desks",
  organizations: "organizations",
};

const TAG_LABEL: Record<string, string> = {
  antisemitism: "Antisemitism",
  ukraine: "Ukraine",
  disinformation: "Disinformation",
  europe: "Europe",
  extremism: "Extremism",
  "fact-check": "Fact-check",
  germany: "Germany",
  host: "Host",
  international: "International",
  journalism: "Journalism",
  "late-night": "Late night",
  legal: "Legal",
  organizing: "Organizing",
  research: "Research",
  satire: "Satire",
  "united-kingdom": "United Kingdom",
  "united-states": "United States",
  watchdog: "Watchdog",
};

const TAG_FIRST = [
  "ukraine",
  "late-night",
  "satire",
  "journalism",
  "fact-check",
  "extremism",
  "legal",
  "organizing",
  "watchdog",
  "research",
  "disinformation",
];

export function isShelf(value: string | null | undefined): value is Shelf {
  return (CATEGORIES as readonly string[]).includes(value ?? "");
}

export function labelTag(tag: string): string {
  return TAG_LABEL[tag] ?? tag.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sortTags(tags: string[]): string[] {
  return [...tags].sort((a, b) => {
    const ai = TAG_FIRST.indexOf(a);
    const bi = TAG_FIRST.indexOf(b);
    if (ai !== -1 || bi !== -1) {
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      if (ai !== bi) return ai - bi;
    }
    return labelTag(a).localeCompare(labelTag(b), "en");
  });
}
