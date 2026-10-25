import { asset } from "@/lib/asset";

export function Hero({ total }: { total: number }) {
  return (
    <section className="mast">
      <img
        className="site-banner"
        src={asset("/banner.jpeg")}
        alt="SociallyDead.me. Directory of the resistance. Curated resources opposing MAGA, the AfD, and far-right extremism."
        width={1024}
        height={572}
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
          Websites, YouTube channels, and profiles on X and Bluesky. Desks and voices pushing back on MAGA, the
          AfD, and the far right.
        </p>
        <p className="tally">{total} public listings</p>
      </div>
    </section>
  );
}
