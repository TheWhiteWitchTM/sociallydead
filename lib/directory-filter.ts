import { CATALOGS, type Catalog } from "@/lib/types";

export type DirectoryKind = "all" | "featured" | Catalog;

export const DIRECTORY_FILTER = "sd-directory-filter";
export const DIRECTORY_KIND = "sd-directory-kind";
export const DIRECTORY_QUERY = "sd-directory-query";
export const HOME_MAST = "sd-home-mast";

export type DirectoryFilterDetail = {
  kind?: DirectoryKind;
  query?: string;
  reset?: boolean;
};

export function isKind(value: string | null): value is DirectoryKind {
  return value === "all" || value === "featured" || (CATALOGS as readonly string[]).includes(value ?? "");
}

export function kindFromLocation(): DirectoryKind {
  if (typeof window === "undefined") return "all";
  const requested = new URLSearchParams(window.location.search).get("kind");
  return isKind(requested) ? requested : "all";
}

export function requestDirectoryFilter(detail: DirectoryFilterDetail) {
  window.dispatchEvent(new CustomEvent(DIRECTORY_FILTER, { detail }));
}

function replaceHash(hash: string) {
  const next = `${location.pathname}${location.search}${hash}`;
  if (`${location.pathname}${location.search}${location.hash}` === next) return;
  history.replaceState(null, "", next);
}

export function hideHomeMast() {
  if (!document.querySelector(".mast")) return;
  document.documentElement.classList.add("mast-off");
  replaceHash("#directory");
  window.dispatchEvent(new CustomEvent(HOME_MAST, { detail: "hide" }));
}

export function showHomeMast() {
  if (!document.querySelector(".mast")) return;
  document.documentElement.classList.remove("mast-off");
  replaceHash("");
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
