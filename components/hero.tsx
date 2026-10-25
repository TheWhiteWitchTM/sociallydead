import { SiteBanner } from "@/components/site-banner";

export function Hero({
  total,
  noun = "public listings",
  banner = false,
}: {
  total: number;
  noun?: string;
  banner?: boolean;
}) {
  return (
    <section className={banner ? "mast" : "mast mast-plain"}>
      {banner ? <SiteBanner /> : null}
      <div className="mast-copy">
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
    </section>
  );
}
