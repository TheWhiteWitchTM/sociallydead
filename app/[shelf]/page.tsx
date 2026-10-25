import { ShelfPage } from "@/components/shelf-page";
import { CATEGORIES, isShelf, SHELF_BLURB, SHELF_LABEL, type Shelf } from "@/lib/categories";
import { SITE_ORIGIN, shareMeta } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CATEGORIES.map((shelf) => ({ shelf }));
}

export const dynamicParams = false;

type Props = { params: Promise<{ shelf: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shelf } = await params;
  if (!isShelf(shelf)) return {};
  const label = SHELF_LABEL[shelf];
  const description = SHELF_BLURB[shelf];
  const url = `${SITE_ORIGIN}/${shelf}/`;
  return {
    title: label,
    description,
    alternates: { canonical: url },
    ...shareMeta({
      title: `${label} — SociallyDead`,
      description,
      url,
    }),
  };
}

export default async function ShelfRoute({ params }: Props) {
  const { shelf } = await params;
  if (!isShelf(shelf)) notFound();
  return <ShelfPage shelf={shelf as Shelf} />;
}
