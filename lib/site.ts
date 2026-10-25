import { readFileSync } from "node:fs";
import { join } from "node:path";

function basePath(): string {
  const raw =
    process.env.BASE_PATH !== undefined
      ? process.env.BASE_PATH.trim()
      : readFileSync(join(process.cwd(), "basepath.txt"), "utf8").trim();
  if (raw === "" || raw === "/") return "";
  if (!raw.startsWith("/")) return "";
  return raw.replace(/\/$/, "");
}

const base = basePath();

// sociallydead.me currently points at a paused host, so link previews that
// fetch the banner from that domain get text instead of the image. While the
// pages build is served under the project path, use that origin.
export const SITE_ORIGIN = base ? `https://thewhitewitchtm.github.io${base}` : "https://sociallydead.me";

export const SITE_URL = `${SITE_ORIGIN}/`;

export const OG_IMAGE = `${SITE_ORIGIN}/og.jpg`;
