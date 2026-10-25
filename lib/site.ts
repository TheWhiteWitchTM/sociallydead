import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

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

export const SHARE_ALT = "SociallyDead. Directory of the resistance.";

export function shareMeta(input: {
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = input.image ?? OG_IMAGE;
  const imageAlt = input.imageAlt ?? SHARE_ALT;
  return {
    openGraph: {
      title: input.title,
      description: input.description,
      url: input.url,
      siteName: "SociallyDead",
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
