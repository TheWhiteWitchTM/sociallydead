#!/usr/bin/env node
// SociallyDead directory editor. GPL-2.0-only. See LICENSE.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = resolve(process.env.DIRECTORY_DATA || join(root, "data"));

const CATALOGS = ["websites", "youtube", "x", "bluesky"];
const ALIASES = {
  web: "websites",
  website: "websites",
  websites: "websites",
  site: "websites",
  sites: "websites",
  yt: "youtube",
  youtube: "youtube",
  twitter: "x",
  x: "x",
  bsky: "bluesky",
  bluesky: "bluesky",
};
const ORDER = ["id", "name", "handle", "url", "blurb", "tags", "region", "language", "added", "featured", "pin"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function die(message, code = 1) {
  const error = new Error(message);
  error.exitCode = code;
  throw error;
}

function catalogName(value) {
  const name = ALIASES[String(value || "").toLowerCase()];
  if (!name) {
    die(`Unknown catalog "${value}". Use ${CATALOGS.join(", ")}.`);
  }
  return name;
}

function fileFor(catalog) {
  return join(dataDir, `${catalog}.json`);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slug(name) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "entry";
}

function uniqueId(entries, base) {
  if (!entries.some((entry) => entry.id === base)) return base;
  let n = 2;
  while (entries.some((entry) => entry.id === `${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

function orderEntry(entry) {
  const out = {};
  for (const key of ORDER) {
    if (entry[key] === undefined || entry[key] === "") continue;
    if ((key === "pin" || key === "featured") && entry[key] !== true) continue;
    out[key] = entry[key];
  }
  return out;
}

function load(catalog) {
  const file = fileFor(catalog);
  let raw;
  try {
    raw = readFileSync(file, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") die(`Missing ${file}`);
    throw error;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) die(`${catalog}.json must be a JSON array`);
    return parsed;
  } catch (error) {
    if (error.exitCode) throw error;
    die(`${catalog}.json is not valid JSON (${error.message})`);
  }
}

function save(catalog, entries) {
  const file = fileFor(catalog);
  writeFileSync(file, `${JSON.stringify(entries.map(orderEntry), null, 2)}\n`);
}

function urlKey(url) {
  return String(url).replace(/\/$/, "").toLowerCase();
}

function problemsFor(catalog, entries) {
  const problems = [];
  const ids = new Set();
  const urls = new Set();
  if (!Array.isArray(entries)) {
    return [`${catalog}.json must be an array`];
  }
  entries.forEach((entry, index) => {
    const where = `${catalog}[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      problems.push(`${where} is not an object`);
      return;
    }
    for (const key of ["id", "name", "url", "blurb"]) {
      if (typeof entry[key] !== "string" || !entry[key].trim()) {
        problems.push(`${where} needs a ${key}`);
      }
    }
    if (typeof entry.id === "string" && !SLUG.test(entry.id)) {
      problems.push(`${where} id must be a lowercase slug`);
    }
    if (typeof entry.url === "string" && !/^https?:\/\//.test(entry.url)) {
      problems.push(`${where} url must start with http:// or https://`);
    }
    if (typeof entry.blurb === "string" && entry.blurb.length > 500) {
      problems.push(`${where} blurb is longer than 500 characters`);
    }
    if (!Array.isArray(entry.tags) || entry.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      problems.push(`${where} tags must be an array of non-empty strings`);
    }
    for (const key of ["handle", "region", "language"]) {
      if (entry[key] !== undefined && typeof entry[key] !== "string") {
        problems.push(`${where} ${key} must be a string`);
      }
    }
    if (entry.added !== undefined && (typeof entry.added !== "string" || !DAY.test(entry.added))) {
      problems.push(`${where} added must be YYYY-MM-DD`);
    }
    if (entry.featured !== undefined && entry.featured !== true) {
      problems.push(`${where} featured must be true or omitted`);
    }
    if (entry.pin !== undefined && entry.pin !== true) {
      problems.push(`${where} pin must be true or omitted`);
    }
    if (typeof entry.id === "string") {
      if (ids.has(entry.id)) problems.push(`${catalog}: duplicate id ${entry.id}`);
      ids.add(entry.id);
    }
    if (typeof entry.url === "string") {
      const key = urlKey(entry.url);
      if (urls.has(key)) problems.push(`${catalog}: duplicate url ${entry.url}`);
      urls.add(key);
    }
  });
  return problems;
}

function validateAll() {
  const problems = [];
  for (const catalog of CATALOGS) {
    let entries;
    try {
      entries = load(catalog);
    } catch (error) {
      problems.push(error.message || String(error));
      continue;
    }
    problems.push(...problemsFor(catalog, entries));
  }
  return problems;
}

function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }
    const body = arg.slice(2);
    const eq = body.indexOf("=");
    if (eq !== -1) {
      flags[body.slice(0, eq)] = body.slice(eq + 1);
      continue;
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) flags[body] = true;
    else {
      flags[body] = next;
      i += 1;
    }
  }
  return { positionals, flags };
}

function flagText(flags, key) {
  if (!(key in flags)) return undefined;
  if (flags[key] === true) die(`--${key} needs a value`);
  return String(flags[key]);
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function applyFields(entry, flags, { creating }) {
  const name = flagText(flags, "name");
  const url = flagText(flags, "url");
  const handle = flagText(flags, "handle");
  const blurb = flagText(flags, "blurb");
  const region = flagText(flags, "region");
  const language = flagText(flags, "language");
  const added = flagText(flags, "added");
  const id = flagText(flags, "id");
  const tags = flagText(flags, "tags");

  if (name !== undefined) entry.name = name.trim();
  if (url !== undefined) entry.url = url.trim();
  if (blurb !== undefined) entry.blurb = blurb.trim();
  if (id !== undefined) entry.id = id.trim();
  if (tags !== undefined) entry.tags = parseTags(tags);
  if (handle !== undefined) entry.handle = handle.trim().replace(/^@/, "");
  if (region !== undefined) entry.region = region.trim();
  if (language !== undefined) entry.language = language.trim().toLowerCase();
  if (added !== undefined) entry.added = added.trim();
  if (flags.featured === true) entry.featured = true;
  if (flags.unfeature === true) delete entry.featured;
  if (flags.pin === true) entry.pin = true;
  if (flags.unpin === true) delete entry.pin;
  if (creating && !entry.added) entry.added = today();
  if (creating && !entry.tags) entry.tags = [];

  for (const key of ["handle", "region", "language"]) {
    if (entry[key] === "") delete entry[key];
  }
  return entry;
}

function printHelp() {
  console.log(`SociallyDead directory editor
Copyright (C) 2026 The White Witch
GPL-2.0-only. There is no warranty. See LICENSE.

Usage
  tools/edit-directory.sh list [catalog]
  tools/edit-directory.sh add <catalog> --name <name> --url <url> [options]
  tools/edit-directory.sh edit <catalog> <id> [options]
  tools/edit-directory.sh remove <catalog> <id> [--yes]
  tools/edit-directory.sh validate
  tools/edit-directory.sh

Catalogs: websites, youtube, x, bluesky
Aliases: web, yt, twitter, bsky

Options
  --name        Display name
  --url         https URL
  --handle      Profile handle, without @
  --blurb       One or two sentences, 500 characters at most
  --tags        Comma-separated tags. Replaces the whole list
  --region      Place name
  --language    Language code, such as en or de
  --id          Slug. Add builds one from the name when this is omitted
  --added       Date YYYY-MM-DD. Add uses today
  --featured    Show this listing in the featured row
  --unfeature   Remove the featured flag
  --pin         Keep this listing at the top of its catalog
  --unpin       Remove the pin
  --yes         Remove without asking

With no command, in a terminal, a short menu opens.
Set DIRECTORY_DATA to edit a different folder of JSON files.
`);
}

function printList(catalog, entries) {
  if (entries.length === 0) {
    console.log(`${catalog}: empty`);
    return;
  }
  const width = Math.max(...entries.map((entry) => entry.id.length));
  for (const entry of entries) {
    const mark = entry.featured ? "★ " : entry.pin ? "* " : "  ";
    console.log(`${mark}${entry.id.padEnd(width)}  ${entry.name}  ${entry.url}`);
  }
  console.log(`${entries.length} in ${catalog}`);
}

function commandList(arg) {
  if (!arg || arg === "all") {
    for (const catalog of CATALOGS) {
      console.log(`\n${catalog}`);
      printList(catalog, load(catalog));
    }
    return;
  }
  const catalog = catalogName(arg);
  printList(catalog, load(catalog));
}

function commandAdd(catalogArg, flags) {
  const catalog = catalogName(catalogArg);
  const entries = load(catalog);
  const entry = applyFields({}, flags, { creating: true });
  if (!entry.name || !entry.url) die("add needs --name and --url");
  if (!entry.blurb) entry.blurb = entry.name;
  if (!entry.id) entry.id = uniqueId(entries, slug(entry.name));
  entries.push(entry);
  const problems = problemsFor(catalog, entries);
  if (problems.length) die(problems.join("\n"));
  save(catalog, entries);
  console.log(`Added ${catalog}/${entry.id}`);
}

function commandEdit(catalogArg, id, flags) {
  if (!id) die("edit needs a catalog and an id");
  const catalog = catalogName(catalogArg);
  const entries = load(catalog);
  const index = entries.findIndex((entry) => entry.id === id);
  if (index === -1) die(`No ${id} in ${catalog}`);
  const before = JSON.stringify(entries[index]);
  entries[index] = applyFields({ ...entries[index] }, flags, { creating: false });
  if (JSON.stringify(entries[index]) === before) {
    console.log("No changes.");
    return;
  }
  const problems = problemsFor(catalog, entries);
  if (problems.length) die(problems.join("\n"));
  save(catalog, entries);
  console.log(`Updated ${catalog}/${entries[index].id}`);
}

async function commandRemove(catalogArg, id, flags) {
  if (!id) die("remove needs a catalog and an id");
  const catalog = catalogName(catalogArg);
  const entries = load(catalog);
  const entry = entries.find((item) => item.id === id);
  if (!entry) die(`No ${id} in ${catalog}`);
  if (flags.yes !== true && input.isTTY) {
    const rl = createInterface({ input, output });
    const answer = (await rl.question(`Remove ${catalog}/${id} (${entry.name})? [y/N] `)).trim().toLowerCase();
    rl.close();
    if (answer !== "y" && answer !== "yes") {
      console.log("Kept.");
      return;
    }
  } else if (flags.yes !== true) {
    die("Refusing to remove without --yes when there is no terminal.");
  }
  save(
    catalog,
    entries.filter((item) => item.id !== id),
  );
  console.log(`Removed ${catalog}/${id}`);
}

function commandValidate() {
  const problems = validateAll();
  if (problems.length) die(problems.join("\n"));
  const counts = CATALOGS.map((catalog) => `${load(catalog).length} ${catalog}`);
  console.log(`Valid. ${counts.join(", ")}.`);
}

async function ask(rl, label, fallback = "") {
  const hint = fallback ? ` [${fallback}]` : "";
  const answer = (await rl.question(`${label}${hint}: `)).trim();
  return answer || fallback;
}

async function interactive() {
  console.log(`SociallyDead directory editor
Copyright (C) 2026 The White Witch
GPL-2.0-only. There is no warranty. See LICENSE.
`);
  const rl = createInterface({ input, output });
  const menu = `1  List
2  Add
3  Edit
4  Remove
5  Validate
6  Quit`;
  try {
    for (;;) {
      console.log(menu);
      const choice = (await rl.question("> ")).trim().toLowerCase();
      if (choice === "6" || choice === "q" || choice === "quit") break;
      try {
      if (choice === "5" || choice === "validate") {
        const problems = validateAll();
        console.log(problems.length ? problems.join("\n") : "Valid.");
        continue;
      }
      if (choice === "1" || choice === "list") {
        const raw = (await ask(rl, "Catalog (blank for all)")).trim();
        commandList(raw);
        continue;
      }
      if (choice === "2" || choice === "add") {
        const catalog = await ask(rl, "Catalog");
        const name = await ask(rl, "Name");
        const url = await ask(rl, "URL");
        const handle = await ask(rl, "Handle");
        const blurb = await ask(rl, "Blurb");
        const tags = await ask(rl, "Tags, comma separated");
        const region = await ask(rl, "Region");
        const language = await ask(rl, "Language");
        const flags = { name, url };
        if (handle) flags.handle = handle;
        if (blurb) flags.blurb = blurb;
        if (tags) flags.tags = tags;
        if (region) flags.region = region;
        if (language) flags.language = language;
        commandAdd(catalog, flags);
        continue;
      }
      if (choice === "3" || choice === "edit") {
        const catalog = await ask(rl, "Catalog");
        const id = await ask(rl, "Id");
        console.log("Leave a field blank to keep it. Type - to clear handle, region, or language.");
        const flags = {};
        for (const key of ["name", "url", "handle", "blurb", "tags", "region", "language"]) {
          const value = await ask(rl, key);
          if (!value) continue;
          flags[key] = value === "-" ? "" : value;
        }
        const featured = (await ask(rl, "Featured? [y/n/blank]")).toLowerCase();
        if (featured === "y" || featured === "yes") flags.featured = true;
        if (featured === "n" || featured === "no") flags.unfeature = true;
        const pin = (await ask(rl, "Pin? [y/n/blank]")).toLowerCase();
        if (pin === "y" || pin === "yes") flags.pin = true;
        if (pin === "n" || pin === "no") flags.unpin = true;
        commandEdit(catalog, id, flags);
        continue;
      }
      if (choice === "4" || choice === "remove") {
        const catalog = await ask(rl, "Catalog");
        const id = await ask(rl, "Id");
        await commandRemove(catalog, id, {});
        continue;
      }
      console.log("Choose 1 to 6.");
      } catch (error) {
        console.error(error.message || String(error));
      }
    }
  } finally {
    rl.close();
  }
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    if (!input.isTTY) {
      printHelp();
      process.exit(1);
    }
    await interactive();
    return;
  }
  const { positionals, flags } = parseArgs(argv);
  const [command, ...rest] = positionals;
  if (command === "help" || command === "--help" || flags.help === true) {
    printHelp();
    return;
  }
  if (command === "list") {
    commandList(rest[0]);
    return;
  }
  if (command === "add") {
    if (!rest[0]) die("add needs a catalog");
    commandAdd(rest[0], flags);
    return;
  }
  if (command === "edit") {
    commandEdit(rest[0], rest[1], flags);
    return;
  }
  if (command === "remove" || command === "rm") {
    await commandRemove(rest[0], rest[1], flags);
    return;
  }
  if (command === "validate") {
    commandValidate();
    return;
  }
  die(`Unknown command "${command}". Try: list, add, edit, remove, validate`);
}

main().catch((error) => {
  console.error(error && error.message ? error.message : String(error));
  process.exit(error && error.exitCode ? error.exitCode : 1);
});
