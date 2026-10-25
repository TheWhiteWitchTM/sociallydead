import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

function resolveBasePath(): string {
  if (process.env.BASE_PATH !== undefined) {
    const value = process.env.BASE_PATH.trim();
    if (value === "" || value === "/") return "";
    if (!value.startsWith("/")) {
      throw new Error("BASE_PATH must be empty or start with /");
    }
    return value.replace(/\/$/, "");
  }

  const raw = readFileSync(join(process.cwd(), "basepath.txt"), "utf8").trim();
  if (raw === "" || raw === "/") return "";
  if (!raw.startsWith("/")) {
    throw new Error("basepath.txt must be empty or start with /");
  }
  return raw.replace(/\/$/, "");
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
