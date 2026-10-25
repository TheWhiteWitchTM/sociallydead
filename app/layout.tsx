import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OG_IMAGE, SITE_ORIGIN, SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const themeBoot = `(function(){try{var q=new URLSearchParams(location.search).get("theme");var t=(q==="light"||q==="dark")?q:localStorage.getItem("sd-theme");if(t!=="light"&&t!=="dark")t="dark";if(q==="light"||q==="dark")localStorage.setItem("sd-theme",q);document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

const description =
  "A directory of people, shows, news desks, and organizations pushing back on MAGA, the AfD, and the far right. Websites, YouTube, X, and Bluesky.";

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SociallyDead",
  url: SITE_URL,
  description,
  publisher: { "@type": "Organization", name: "SociallyDead", url: SITE_URL },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_ORIGIN}/`),
  title: {
    default: "SociallyDead — what hatred breeds you must resist",
    template: "%s — SociallyDead",
  },
  description,
  applicationName: "SociallyDead",
  authors: [{ name: "The White Witch" }],
  keywords: [
    "SociallyDead",
    "directory",
    "far right",
    "MAGA",
    "AfD",
    "Bluesky",
    "resistance",
    "late night",
    "fact check",
    "watchdog",
  ],
  openGraph: {
    title: "SociallyDead — Directory of the resistance",
    description,
    url: SITE_URL,
    siteName: "SociallyDead",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "SociallyDead. Directory of the resistance.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SociallyDead — Directory of the resistance",
    description,
    images: [{ url: OG_IMAGE, alt: "SociallyDead. Directory of the resistance." }],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_ORIGIN}/rss.xml` },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-13S6Z9KCX9" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-13S6Z9KCX9');`}
        </Script>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
