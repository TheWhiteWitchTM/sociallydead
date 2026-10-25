import bluesky from "@/data/bluesky.json";
import websites from "@/data/websites.json";
import x from "@/data/x.json";
import youtube from "@/data/youtube.json";
import { CATALOGS, type Catalog, type DirectoryData, type Entry } from "@/lib/types";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseCatalog(raw: unknown, catalog: string): Entry[] {
  if (!Array.isArray(raw)) {
    throw new Error(`${catalog}.json must be an array`);
  }

  const ids = new Set<string>();
  const urls = new Set<string>();

  return raw.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`${catalog}[${index}] is not an object`);
    }
    const record = item as Record<string, unknown>;
    const id = text(record.id);
    const name = text(record.name);
    const url = text(record.url);
    const blurb = text(record.blurb);
    const where = `${catalog}[${index}]`;

    if (!id || !name || !url || !blurb) {
      throw new Error(`${where} needs id, name, url, and blurb`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      throw new Error(`${where} id must be a lowercase slug`);
    }
    if (!/^https?:\/\//.test(url)) {
      throw new Error(`${catalog} ${id}: url must start with http:// or https://`);
    }
    if (ids.has(id)) throw new Error(`${catalog}: duplicate id ${id}`);
    const urlKey = url.replace(/\/$/, "").toLowerCase();
    if (urls.has(urlKey)) throw new Error(`${catalog}: duplicate url ${url}`);
    ids.add(id);
    urls.add(urlKey);

    if (!Array.isArray(record.tags) || record.tags.some((tag) => typeof tag !== "string")) {
      throw new Error(`${catalog} ${id}: tags must be an array of strings`);
    }

    const entry: Entry = {
      id,
      name,
      url,
      blurb,
      tags: record.tags.map((tag) => tag.trim()).filter(Boolean),
    };
    const handle = text(record.handle);
    const region = text(record.region);
    const language = text(record.language);
    const added = text(record.added);
    if (handle) entry.handle = handle.replace(/^@/, "");
    if (region) entry.region = region;
    if (language) entry.language = language;
    if (added) entry.added = added;
    if (record.pin === true) entry.pin = true;
    return entry;
  });
}

const sources: Record<Catalog, unknown> = { websites, youtube, x, bluesky };

export function loadDirectory(): DirectoryData {
  const data = {} as DirectoryData;
  for (const catalog of CATALOGS) {
    data[catalog] = parseCatalog(sources[catalog], catalog);
  }
  return data;
}
