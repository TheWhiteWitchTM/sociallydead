import { Corner } from "@/components/icons";
import { asset } from "@/lib/asset";

export function Hero({ total }: { total: number }) {
  return (
    <section className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 pt-10 pb-4 lg:grid-cols-[1.12fr_0.88fr] lg:pt-16">
      <div>
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
        <p className="dream">Waking up from a dream into another day</p>
        <p className="lede">
          Websites, YouTube channels, and profiles on X and Bluesky. A public list of desks and voices
          pushing back on MAGA, the AfD, and the far right.
        </p>
        <p className="mt-4 mb-0 text-sm font-bold tracking-wide text-gold uppercase">
          {total} public listings
        </p>
      </div>
      <figure className="frame m-0">
        <Corner place="nw" />
        <Corner place="ne" />
        <Corner place="se" />
        <Corner place="sw" />
        <img
          src={asset("/banner.jpeg")}
          alt="SociallyDead.me. Directory of the resistance. Curated resources opposing MAGA, the AfD, and far-right extremism."
          width={1024}
          height={572}
        />
      </figure>
    </section>
  );
}
