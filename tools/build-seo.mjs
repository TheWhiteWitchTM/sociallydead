#!/usr/bin/env node
// Write robots.txt, sitemap.xml, and rss.xml from the directory.
// GPL-2.0-only. See LICENSE.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalogs = ["websites", "youtube", "x", "bluesky"];
const shelves = [
  ["people", "People"],
  ["shows", "Shows"],
  ["news", "News"],
  ["organizations", "Organizations"],
];

function basePath() {
  const raw = readFileSync(join(root, "basepath.txt"), "utf8").trim();
  if (raw === "" || raw === "/" || !raw.startsWith("/")) return "";
  return raw.replace(/\/$/, "");
}

const origin = basePath() ? `https://thewhitewitchtm.github.io${basePath()}` : "https://sociallydead.me";

function load(catalog) {
  return JSON.parse(readFileSync(join(root, "data", `${catalog}.json`), "utf8"));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfc822(day) {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date, 12, 0, 0)).toUTCString();
}

const groups = new Map();
for (const catalog of catalogs) {
  for (const entry of load(catalog)) {
    const group = groups.get(entry.id) ?? { id: entry.id, presences: [] };
    group.presences.push({ catalog, entry });
    if (catalog === "websites" || !group.entry) group.entry = entry;
    if (entry.added && (!group.added || entry.added > group.added)) group.added = entry.added;
    groups.set(entry.id, group);
  }
}

const items = [...groups.values()].sort((a, b) => {
  const byDate = (b.added ?? "").localeCompare(a.added ?? "");
  if (byDate) return byDate;
  return a.entry.name.localeCompare(b.entry.name, "en");
});

const newest = items.reduce((max, item) => ((item.added ?? "") > max ? item.added : max), "2026-10-25");

const pages = [
  ["/", newest],
  ["/woozle-effect/", "2026-10-25"],
  ["/ukraine/", newest],
  ["/rss.xml", newest],
  ...shelves.map(([path]) => [`/${path}/`, newest]),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ([path, lastmod]) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const shelfLabel = Object.fromEntries(shelves);
const rssItems = items
  .map((item) => {
    const entry = item.entry;
    const directory = entry.category ? `${origin}/${entry.category}/` : `${origin}/`;
    const about = `${entry.blurb} Listed on SociallyDead.`;
    return `  <item>
    <title>${escapeXml(entry.name)}</title>
    <link>${escapeXml(entry.url)}</link>
    <guid isPermaLink="false">${escapeXml(item.id)}</guid>
    ${item.added ? `<pubDate>${rfc822(item.added)}</pubDate>` : ""}
    <category>${escapeXml(shelfLabel[entry.category] ?? entry.category ?? "Directory")}</category>
    <description>${escapeXml(about)} ${escapeXml(directory)}</description>
  </item>`;
  })
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SociallyDead</title>
    <link>${origin}/</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>New listings in the SociallyDead directory. People, shows, news, and organizations pushing back on MAGA, the AfD, and the far right.</description>
    <language>en</language>
    <lastBuildDate>${rfc822(newest)}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

writeFileSync(join(root, "public", "sitemap.xml"), sitemap);
writeFileSync(join(root, "public", "rss.xml"), rss);
writeFileSync(join(root, "public", "robots.txt"), robots);
console.log(`Wrote sitemap, rss, and robots for ${origin} (${items.length} listings).`);
