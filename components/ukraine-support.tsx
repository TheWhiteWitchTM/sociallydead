"use client";

import { UkraineFlagIcon } from "@/components/icons";
import { asset } from "@/lib/asset";
import { UKRAINE_BLURB, UKRAINE_LINKS, UKRAINE_OFFICIAL_LIST, UKRAINE_PATH } from "@/lib/ukraine";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

function placePop(button: HTMLElement, pop: HTMLElement) {
  const margin = 12;
  const width = Math.min(360, window.innerWidth - margin * 2);
  pop.style.width = `${width}px`;
  const anchor = button.getBoundingClientRect();
  const height = pop.getBoundingClientRect().height;
  let left = anchor.left + anchor.width / 2 - width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  let top = anchor.top - height - 10;
  if (top < margin || top > maxTop) {
    const below = anchor.bottom + 10;
    top = below >= margin && below <= maxTop ? below : maxTop;
  }
  pop.style.left = `${left}px`;
  pop.style.top = `${top}px`;
}

export function UkraineSupport() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const dialogId = useId();

  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !popRef.current) return;
    placePop(buttonRef.current, popRef.current);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    function onPlace() {
      if (buttonRef.current && popRef.current) placePop(buttonRef.current, popRef.current);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onPlace);
    window.addEventListener("scroll", onPlace, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onPlace);
      window.removeEventListener("scroll", onPlace, true);
    };
  }, [open]);

  return (
    <span className="footer-cheer" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="footer-cheer-btn"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ua-blue">🇺🇦 Ukraine is my friend.</span> <span className="ua-gold">Slava Ukraini!</span>
        <span className="ua-caret" aria-hidden="true">
          {" "}
          ▾
        </span>
        <span className="sr-only"> Open verified ways to contribute.</span>
      </button>
      {open ? (
        <div ref={popRef} id={dialogId} className="ua-pop" role="dialog" aria-labelledby={titleId}>
          <div className="ua-pop-head">
            <UkraineFlagIcon className="ua-flag" />
            <h2 id={titleId}>Support Ukraine</h2>
            <button type="button" className="ua-pop-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </div>
          <p className="ua-pop-lead">
            Verified ways to contribute. UNITED24 and the National Bank of Ukraine are state channels. The charities are
            ones Ukraine names on its official donate page.
          </p>
          <ul className="ua-links">
            {UKRAINE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <span className="ua-link-name">{link.name}</span>
                  <span className="ua-link-detail">{link.detail}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="ua-pop-note">
            <a href={UKRAINE_OFFICIAL_LIST} target="_blank" rel="noopener noreferrer">
              Official list, and a warning about fake fundraisers.
            </a>
          </p>
          <p className="ua-pop-note">
            <a href={asset(UKRAINE_PATH)}>{UKRAINE_BLURB}</a>
          </p>
        </div>
      ) : null}
    </span>
  );
}
