import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://sociallydead.me"),
  title: {
    default: "SociallyDead — what hatred breeds you must resist",
    template: "%s — SociallyDead",
  },
  description:
    "A directory of websites, YouTube channels, and X and Bluesky profiles pushing back on MAGA, the AfD, and the far right.",
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
  ],
  openGraph: {
    title: "SociallyDead — Directory of the resistance",
    description:
      "Websites, YouTube channels, and profiles on X and Bluesky pushing back on MAGA, the AfD, and the far right.",
    url: "https://sociallydead.me",
    siteName: "SociallyDead",
    type: "website",
    images: [
      {
        url: "/banner.jpeg",
        width: 1024,
        height: 360,
        alt: "SociallyDead.me directory of the resistance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SociallyDead — Directory of the resistance",
    description:
      "Websites, YouTube channels, and profiles on X and Bluesky pushing back on MAGA, the AfD, and the far right.",
    images: ["/banner.jpeg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://sociallydead.me" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body>
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
        <a className="skip" href="#directory">
          Skip to the directory
        </a>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
