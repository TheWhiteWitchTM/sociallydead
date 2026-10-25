export const CATALOGS = ["websites", "youtube", "x", "bluesky"] as const;

export type Catalog = (typeof CATALOGS)[number];

export const CATALOG_LABEL: Record<Catalog, string> = {
  websites: "Websites",
  youtube: "YouTube",
  x: "X",
  bluesky: "Bluesky",
};

export type Entry = {
  id: string;
  name: string;
  url: string;
  handle?: string;
  blurb: string;
  tags: string[];
  region?: string;
  language?: string;
  added?: string;
  featured?: boolean;
  pin?: boolean;
};

export type DirectoryData = Record<Catalog, Entry[]>;
