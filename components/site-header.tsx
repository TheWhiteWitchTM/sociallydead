import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="mark" aria-hidden="true">
            <span>
              S<span className="text-sky">D</span>
            </span>
          </span>
          <span>
            <span className="wordmark">
              Socially<span className="text-sky">D</span>ead
            </span>
            <span className="mt-0.5 hidden text-[11px] font-bold tracking-[0.16em] text-muted uppercase sm:block">
              sociallydead.me
            </span>
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
