type IconProps = { className?: string };

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 L20 20.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15.5 3.8a7.8 7.8 0 1 0 4.7 12.6A8.2 8.2 0 0 1 15.5 3.8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Corner({ place }: { place: "nw" | "ne" | "se" | "sw" }) {
  return (
    <svg className={`corner ${place}`} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M6 36 V10 H32" strokeWidth="1.4" />
      <path d="M12 22 C20 12, 24 16, 34 8" strokeWidth="1" />
      <path d="M10 10 h3 M10 10 v3" strokeWidth="1.2" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.4 12h15.2M6 8.2h12M6 15.8h12" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.2 9.1v5.8l5-2.9z" fill="currentColor" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 5.5 10.7 12 5.2 18.5h2.1l4.2-4.8 3.5 4.8H19l-5.9-7.8 5.3-6.2h-2.1l-3.9 4.5-3.2-4.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.4 14.55 8.7 20.3 9.4 16.05 13.35 17.15 19.1 12 16.3 6.85 19.1 7.95 13.35 3.7 9.4 9.45 8.7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8.1" r="2.35" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15.6" cy="8.7" r="1.85" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.6 18.6c.55-2.7 2.35-4.15 4.4-4.15s3.85 1.45 4.4 4.15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13.15 14.7c1.15-.45 2.25-.5 3.2-.1 1.45.6 2.35 1.9 2.75 3.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="3.2" width="6" height="10.2" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7.2 11.2a4.8 4.8 0 0 0 9.6 0M12 16v3.4M9.1 19.6h5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 6.2h9.2v11.2H7.1A2.1 2.1 0 0 1 5 15.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 8.1H19v8.4a2.1 2.1 0 0 1-2.1 2.1H8.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.3 9.2h4.5M7.3 12h4.5M7.3 14.6h2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function OrgIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10.1 12 5.2l8 4.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.3 10.2V17M9.9 10.2V17M14.1 10.2V17M17.7 10.2V17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4.4 17.3h15.2M5.2 19.4h13.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SkyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.2c1.6 1.8 2.2 3.4 2.2 5.1 1.5-.3 2.8.2 3.6 1.4.9 1.3.8 3-.2 4.3-1.6 2.1-4 3.6-5.6 4.6-1.6-1-4-2.5-5.6-4.6-1-1.3-1.1-3-.2-4.3.8-1.2 2.1-1.7 3.6-1.4 0-1.7.6-3.3 2.2-5.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 8.2v9" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
