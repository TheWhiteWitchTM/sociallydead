"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { asset } from "@/lib/asset";
import {
  DIRECTORY_KIND,
  kindFromLocation,
  prefersReducedMotion,
  requestDirectoryFilter,
  type DirectoryKind,
} from "@/lib/directory-filter";
import { CATALOG_LABEL, CATALOGS, type Catalog } from "@/lib/types";
import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

const DESKS: { kind: DirectoryKind; title: string }[] = [
  { kind: "all", title: "All desks" },
  ...CATALOGS.map((kind) => ({ kind, title: CATALOG_LABEL[kind as Catalog] })),
];

export function SiteHeader() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desksOpen, setDesksOpen] = useState(false);
  const [active, setActive] = useState<DirectoryKind>("all");

  useEffect(() => {
    setActive(kindFromLocation());
    function onKind(event: Event) {
      const next = (event as CustomEvent<DirectoryKind>).detail;
      if (next) setActive(next);
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
      }
    }
    window.addEventListener(DIRECTORY_KIND, onKind);
    document.addEventListener("click", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(DIRECTORY_KIND, onKind);
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
              className={`dropdown-toggle${active !== "all" ? " is-active" : ""}`}
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
            <a href="https://thewhitewitchtm.github.io/whitewitch/" target="_blank" rel="noopener noreferrer">
              The White Witch™
            </a>
          </li>
          <li>
            <a href="https://thewhitewitchtm.github.io/LibreSky/" target="_blank" rel="noopener noreferrer">
              LibreSky
            </a>
          </li>
        </ul>
        <a
          className="coffee"
          href="https://www.paypal.com/ncp/payment/4P85EQRES3RGU"
          target="_blank"
          rel="noopener noreferrer"
        >
          ☕ Buy me a coffee
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
