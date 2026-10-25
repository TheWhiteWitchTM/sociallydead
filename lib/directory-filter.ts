import { CATALOGS, type Catalog } from "@/lib/types";

export type DirectoryKind = "all" | Catalog;

export const DIRECTORY_FILTER = "sd-directory-filter";
export const DIRECTORY_KIND = "sd-directory-kind";

export type DirectoryFilterDetail = {
  kind?: DirectoryKind;
  reset?: boolean;
};

export function isKind(value: string | null): value is DirectoryKind {
  return value === "all" || (CATALOGS as readonly string[]).includes(value ?? "");
}

export function kindFromLocation(): DirectoryKind {
  if (typeof window === "undefined") return "all";
  const requested = new URLSearchParams(window.location.search).get("kind");
  return isKind(requested) ? requested : "all";
}

export function requestDirectoryFilter(detail: DirectoryFilterDetail) {
  window.dispatchEvent(new CustomEvent(DIRECTORY_FILTER, { detail }));
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
