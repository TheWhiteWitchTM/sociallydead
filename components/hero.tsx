import { asset } from "@/lib/asset";

export function Hero({ total, noun = "public listings" }: { total: number; noun?: string }) {
  return (
    <section className="mast">
      <img
        className="site-banner"
        src={asset("/banner.jpeg")}
        alt="SociallyDead.me. Directory of the resistance. Curated resources opposing MAGA, the AfD, and far-right extremism."
        width={1712}
        height={592}
      />
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
