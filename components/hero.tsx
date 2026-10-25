import { SiteBanner } from "@/components/site-banner";

export function Hero({ total, noun = "public listings" }: { total: number; noun?: string }) {
  return (
    <section className="mast">
      <SiteBanner />
      <div className="mast-copy">
        <div className="mast-copy-inner">
          <p className="kicker">Directory of the resistance</p>
          <h1 className="lyric">
            what hatred breeds
            <span className="resist">you must resist</span>
          </h1>
          <p className="cite">
            <cite>The Crüxshadows</cite>
            {" · "}
            Resist
          </p>
          <p className="lede">
            People, shows, news, and organizations. Websites, YouTube, X, and Bluesky, pushing back on MAGA, the AfD,
            and the far right.
          </p>
          <p className="tally">
            {total} {noun}
          </p>
        </div>
      </div>
    </section>
  );
}
