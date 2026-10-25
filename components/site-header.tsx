"use client";

import { SearchIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { asset } from "@/lib/asset";
import {
  DIRECTORY_KIND,
  DIRECTORY_QUERY,
  kindFromLocation,
  prefersReducedMotion,
  requestDirectoryFilter,
  type DirectoryKind,
} from "@/lib/directory-filter";
import { CATALOG_LABEL, CATALOGS, type Catalog } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";

const DESKS: { kind: DirectoryKind; title: string }[] = [
  { kind: "all", title: "All desks" },
  ...CATALOGS.map((kind) => ({ kind, title: CATALOG_LABEL[kind as Catalog] })),
];

function here(pathname: string, href: string) {
  const current = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return current === target;
}

export function SiteHeader() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desksOpen, setDesksOpen] = useState(false);
  const [active, setActive] = useState<DirectoryKind>("all");
  const [query, setQuery] = useState("");
  const deskOn = active !== "all" && active !== "featured";

  useEffect(() => {
    setActive(kindFromLocation());
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) setQuery(initial);
    function onKind(event: Event) {
      const next = (event as CustomEvent<DirectoryKind>).detail;
      if (next) setActive(next);
    }
    function onQuery(event: Event) {
      setQuery((event as CustomEvent<string>).detail ?? "");
    }
    function onPointer(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setDesksOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setDesksOpen(false);
        return;
      }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      setMenuOpen(true);
      window.setTimeout(() => document.getElementById("nav-search")?.focus(), 0);
    }
    window.addEventListener(DIRECTORY_KIND, onKind);
    window.addEventListener(DIRECTORY_QUERY, onQuery);
    document.addEventListener("click", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(DIRECTORY_KIND, onKind);
      window.removeEventListener(DIRECTORY_QUERY, onQuery);
      document.removeEventListener("click", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setMenuOpen(false);
    setDesksOpen(false);
  }

  function scrollToDirectory() {
    const directory = document.getElementById("directory");
    if (!directory) return false;
    directory.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return true;
  }

  function onHome(event: ReactMouseEvent<HTMLAnchorElement>) {
    close();
    if (!document.getElementById("directory")) return;
    event.preventDefault();
    requestDirectoryFilter({ reset: true });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  function onDirectory(event: ReactMouseEvent<HTMLAnchorElement>) {
    close();
    if (!scrollToDirectory()) return;
    event.preventDefault();
  }

  function onSearchChange(value: string) {
    setQuery(value);
    if (document.getElementById("directory")) requestDirectoryFilter({ query: value });
  }

  function onSearchKey(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const q = query.trim();
    if (!document.getElementById("directory")) {
      const home = asset("/");
      window.location.assign(q ? `${home}?q=${encodeURIComponent(q)}#directory` : `${home}#directory`);
      return;
    }
    scrollToDirectory();
  }

  function choose(kind: DirectoryKind) {
    close();
    if (!document.getElementById("directory")) {
      const home = asset("/");
      window.location.assign(kind === "all" ? home : `${home}?kind=${kind}#directory`);
      return;
    }
    requestDirectoryFilter({ kind });
    scrollToDirectory();
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary" ref={navRef}>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <ul id="site-menu" className={menuOpen ? "open" : undefined}>
          <li>
            <Link href="/" className="brand" onClick={onHome}>
              SociallyDead
            </Link>
          </li>
          <li>
            <Link href="/#directory" onClick={onDirectory}>
              Directory
            </Link>
          </li>
          <li className="dropdown">
            <button
              type="button"
              className={`dropdown-toggle${deskOn ? " is-active" : ""}`}
              aria-expanded={desksOpen}
              aria-haspopup="true"
              onClick={() => setDesksOpen((open) => !open)}
            >
              Desks
            </button>
            <ul className={`dropdown-menu${desksOpen ? " open" : ""}`}>
              {DESKS.map((item) => (
                <li key={item.kind} className={item.kind === "websites" ? "before-split" : undefined}>
                  <button type="button" aria-pressed={active === item.kind} onClick={() => choose(item.kind)}>
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <Link
              href="/woozle-effect"
              className={here(pathname, "/woozle-effect") ? "is-current" : undefined}
              onClick={close}
            >
              Woozle effect
            </Link>
          </li>
          <li>
            <a href="https://thewhitewitchtm.github.io/LibreSky/" target="_blank" rel="noopener noreferrer">
              LibreSky
            </a>
          </li>
          <li>
            <label className="nav-search">
              <span className="sr-only">Search the directory</span>
              <SearchIcon />
              <input
                id="nav-search"
                value={query}
                onChange={(event) => onSearchChange(event.target.value)}
                onKeyDown={onSearchKey}
                placeholder="Search"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
              />
            </label>
          </li>
        </ul>
        <a
          className="contribute"
          href="https://www.paypal.com/ncp/payment/4P85EQRES3RGU"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribute
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
