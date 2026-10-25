#!/usr/bin/env node
// Download a small listing thumbnail for each directory id.
// Prefer an X or Bluesky profile image. If neither is available, use the
// website's Open Graph image, then the YouTube page's Open Graph image.
// GPL-2.0-only. See LICENSE.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const outDir = join(root, "public", "thumbs");
const catalogs = ["websites", "youtube", "x", "bluesky"];
const ua = "Mozilla/5.0 (compatible; SociallyDead/1.0; +https://sociallydead.me)";

function load(catalog) {
  return JSON.parse(readFileSync(join(dataDir, `${catalog}.json`), "utf8"));
}

function groups() {
  const map = new Map();
  for (const catalog of catalogs) {
    for (const entry of load(catalog)) {
      const group = map.get(entry.id) ?? { id: entry.id, presences: {} };
      group.presences[catalog] = entry;
      map.set(entry.id, group);
    }
  }
  return [...map.values()];
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": ua },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function xAvatar(entry) {
  if (!entry?.handle) return null;
  const handle = entry.handle.replace(/^@/, "");
  const data = await getJson(`https://api.fxtwitter.com/${encodeURIComponent(handle)}`);
  const url = data?.user?.avatar_url;
  if (typeof url !== "string" || !url.startsWith("http")) return null;
  return url.replace("_normal.", "_400x400.");
}

async function xFallback(entry) {
  if (!entry?.handle) return null;
  const handle = entry.handle.replace(/^@/, "");
  return `https://unavatar.io/x/${encodeURIComponent(handle)}`;
}

async function bskyAvatar(entry) {
  if (!entry?.handle) return null;
  const data = await getJson(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(entry.handle)}`,
  );
  return typeof data?.avatar === "string" ? data.avatar : null;
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .trim();
}

function metaContent(html, key) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const prop = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1];
    if (prop?.toLowerCase() !== key) continue;
    const content = tag.match(/content\s*=\s*["']([^"']+)["']/i)?.[1];
    if (content) return decode(content);
  }
  return null;
}

async function pageImage(pageUrl) {
  const response = await fetch(pageUrl, {
    headers: { accept: "text/html", "user-agent": ua },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${pageUrl}`);
  const html = (await response.text()).slice(0, 800_000);
  const found = metaContent(html, "og:image") || metaContent(html, "twitter:image") || linkIcon(html);
  if (!found) return null;
  return new URL(found, response.url).href;
}

function linkIcon(html) {
  const links = html.match(/<link\b[^>]*>/gi) || [];
  let best = null;
  let bestSize = 0;
  for (const tag of links) {
    const rel = tag.match(/rel\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase() ?? "";
    if (!/\b(?:apple-touch-icon|icon)\b/.test(rel)) continue;
    const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    const declared = Number(tag.match(/sizes\s*=\s*["'](\d+)x/i)?.[1] ?? 0);
    const size = declared || (rel.includes("apple") ? 180 : 32);
    if (size < bestSize) continue;
    bestSize = size;
    best = decode(href);
  }
  return best;
}

async function download(url) {
  const response = await fetch(url, {
    headers: { accept: "image/*,*/*", "user-agent": ua },
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const type = response.headers.get("content-type") || "";
  if (type.includes("text/html")) throw new Error(`not an image ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 80) throw new Error(`tiny image ${url}`);
  return sharp(bytes).resize(160, 160, { fit: "cover", position: "centre" }).webp({ quality: 82 }).toBuffer();
}

async function firstImage(candidates) {
  for (const candidate of candidates) {
    try {
      const url = await candidate();
      if (!url) continue;
      const image = await download(url);
      return image;
    } catch {
      // try the next source
    }
  }
  return null;
}

async function thumbFor(group) {
  const { presences } = group;
  return firstImage([
    () => xAvatar(presences.x),
    () => bskyAvatar(presences.bluesky),
    () => xFallback(presences.x),
    () => (presences.websites ? pageImage(presences.websites.url) : null),
    () => (presences.youtube ? pageImage(presences.youtube.url) : null),
  ]);
}

async function pool(items, limit, worker) {
  const queue = [...items];
  const runners = Array.from({ length: limit }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(runners);
}

mkdirSync(outDir, { recursive: true });
const refresh = process.argv.includes("--refresh");
const found = {};
const missed = [];

await pool(groups(), 4, async (group) => {
  const file = `${group.id}.webp`;
  if (!refresh && existsSync(join(outDir, file))) {
    found[group.id] = file;
    console.log(`keep  ${group.id}`);
    return;
  }
  const image = await thumbFor(group);
  if (!image) {
    missed.push(group.id);
    console.log(`miss  ${group.id}`);
    return;
  }
  writeFileSync(join(outDir, file), image);
  found[group.id] = file;
  console.log(`ok    ${group.id}`);
});

const ordered = Object.fromEntries(Object.keys(found).sort().map((id) => [id, found[id]]));
writeFileSync(join(dataDir, "thumbs.json"), `${JSON.stringify(ordered, null, 2)}\n`);
console.log(`${Object.keys(ordered).length} thumbs, ${missed.length} missing`);
if (missed.length) console.log(missed.join(", "));
