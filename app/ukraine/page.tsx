import { ShelfPage } from "@/components/shelf-page";
import { SITE_ORIGIN, shareMeta } from "@/lib/site";
import { UKRAINE_BLURB, UKRAINE_LABEL } from "@/lib/ukraine";
import type { Metadata } from "next";

const url = `${SITE_ORIGIN}/ukraine/`;

export const metadata: Metadata = {
  title: UKRAINE_LABEL,
  description: UKRAINE_BLURB,
  alternates: { canonical: url },
  ...shareMeta({
    title: `${UKRAINE_LABEL} — SociallyDead`,
    description: UKRAINE_BLURB,
    url,
  }),
};

export default function UkrainePage() {
  return <ShelfPage shelf="ukraine" />;
}
