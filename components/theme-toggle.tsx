"use client";

import { MoonIcon, SunIcon } from "@/components/icons";

export function ThemeToggle() {
  function toggle() {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sd-theme", next);
    } catch {
      /* private mode */
    }
  }

  return (
    <button type="button" className="toggle" onClick={toggle}>
      <span className="when-dark">
        <SunIcon /> Light
      </span>
      <span className="when-light">
        <MoonIcon /> Dark
      </span>
    </button>
  );
}
