"use client";

import { asset } from "@/lib/asset";
import { prefersReducedMotion } from "@/lib/directory-filter";
import { useEffect, useLayoutEffect, useState } from "react";

const READ_MS = 16000;
const STORAGE_KEY = "sd-banner";

export function SiteBanner() {
  const [open, setOpen] = useState(true);
  const [live, setLive] = useState(false);
  const [timing, setTiming] = useState(false);
  const [folding, setFolding] = useState(false);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "collapsed") setOpen(false);
    const frame = requestAnimationFrame(() => setLive(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!live || !open) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "open") return;
    if (prefersReducedMotion()) return;
    setTiming(true);
    const timer = window.setTimeout(() => {
      setTiming(false);
      setFolding(true);
      setOpen(false);
      remember(false);
    }, READ_MS);
    return () => {
      window.clearTimeout(timer);
      setTiming(false);
    };
  }, [live, open]);

  function remember(next: boolean) {
    sessionStorage.setItem(STORAGE_KEY, next ? "open" : "collapsed");
    document.documentElement.classList.toggle("banner-collapsed", !next);
  }

  function toggle() {
    const next = !open;
    remember(next);
    if (next) setFolding(false);
    else {
      setFolding(false);
      requestAnimationFrame(() => setFolding(true));
    }
    setOpen(next);
  }

  const frameClass = [
    "site-banner-frame",
    open ? "is-open" : "is-collapsed",
    live ? "is-live" : "",
    folding ? "is-folding" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={frameClass} aria-expanded={open} onClick={toggle}>
      <img
        className="site-banner"
        src={asset("/banner.jpeg")}
        alt="SociallyDead.me. Directory of the resistance. Curated resources opposing MAGA, the AfD, and far-right extremism."
        width={1712}
        height={592}
      />
      {timing ? <span className="banner-timer" aria-hidden="true" /> : null}
      <span className="banner-reveal" aria-hidden="true">
        Open
      </span>
      <span className="sr-only">{open ? "Collapse the banner" : "Show the full banner"}</span>
    </button>
  );
}
