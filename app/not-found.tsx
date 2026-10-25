import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[720px] px-5 py-20">
      <p className="kicker">404</p>
      <h1 className="lyric">
        what hatred breeds
        <span className="resist">you must resist</span>
      </h1>
      <p className="cite">
        <cite>The Crüxshadows</cite>
        {" · "}
        Resist
      </p>
      <p className="lede">This page is not in the directory.</p>
      <p className="mt-6">
        <Link href="/" className="font-extrabold text-blue">
          Back to the directory
        </Link>
      </p>
    </section>
  );
}
