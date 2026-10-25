import { UkraineSupport } from "@/components/ukraine-support";
import { asset } from "@/lib/asset";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="colophon">
      <div className="footer-links">
        <a href="mailto:thewhitewitchtm@google.com">✉️ E-Mail</a>
        <span aria-hidden="true">•</span>
        <a href="https://youtube.com/@TheWhiteWitchTM" target="_blank" rel="noopener noreferrer">
          🎥 YouTube
        </a>
        <span aria-hidden="true">•</span>
        <a href="https://x.com/TheWhiteWitchTM" target="_blank" rel="noopener noreferrer">
          🐦 X
        </a>
        <span aria-hidden="true">•</span>
        <a href="https://bsky.app/profile/thewhitewitchtm.sociallydead.me" target="_blank" rel="noopener noreferrer">
          🦋 Bluesky
        </a>
        <span aria-hidden="true">•</span>
        <a href="https://thewhitewitchtm.github.io/LibreSky/" target="_blank" rel="noopener noreferrer">
          🌤️ LibreSky
        </a>
        <span aria-hidden="true">•</span>
        <a href="https://github.com/TheWhiteWitchTM" target="_blank" rel="noopener noreferrer">
          🐙 GitHub
        </a>
        <span aria-hidden="true">•</span>
        <a href={asset("/rss.xml")}>📡 RSS</a>
        <span aria-hidden="true">•</span>
        <UkraineSupport />
      </div>
      <p className="footer-note">SociallyDead · visits counted with Google Analytics (G-13S6Z9KCX9) · GPL-2.0</p>
    </footer>
  );
}
