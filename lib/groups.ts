import { CATALOGS, type Catalog, type DirectoryData, type Entry } from "@/lib/types";

export type Presence = {
  catalog: Catalog;
  entry: Entry;
};

export type OrgGroup = {
  id: string;
  name: string;
  blurb: string;
  region?: string;
  tags: string[];
  added?: string;
  featured: boolean;
  pin: boolean;
  presences: Presence[];
  thumb?: string;
};

export function groupDirectory(data: DirectoryData): OrgGroup[] {
  const map = new Map<string, OrgGroup>();

  for (const catalog of CATALOGS) {
    for (const entry of data[catalog]) {
      let group = map.get(entry.id);
      if (!group) {
        group = {
          id: entry.id,
          name: entry.name,
          blurb: entry.blurb,
          tags: [],
          featured: false,
          pin: false,
          presences: [],
        };
        map.set(entry.id, group);
      }
      group.presences.push({ catalog, entry });
      if (entry.featured) group.featured = true;
      if (entry.pin) group.pin = true;
      if (entry.region && !group.region) group.region = entry.region;
      if (entry.added && (!group.added || entry.added > group.added)) group.added = entry.added;
      for (const tag of entry.tags) {
        if (!group.tags.includes(tag)) group.tags.push(tag);
      }
    }
  }

  for (const group of map.values()) {
    group.presences.sort((a, b) => CATALOGS.indexOf(a.catalog) - CATALOGS.indexOf(b.catalog));
    const preferred = group.presences.find((item) => item.catalog === "websites") ?? group.presences[0];
    group.name = preferred.entry.name;
    group.blurb = preferred.entry.blurb;
    if (preferred.entry.region) group.region = preferred.entry.region;
  }

  return [...map.values()];
}
