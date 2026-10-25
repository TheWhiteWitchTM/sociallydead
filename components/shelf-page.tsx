import { Directory } from "@/components/directory";
import { Hero } from "@/components/hero";
import thumbFiles from "@/data/thumbs.json";
import { SHELF_BLURB, SHELF_LABEL, SHELF_NOUN, type Shelf } from "@/lib/categories";
import { loadDirectory } from "@/lib/directory";
import { groupDirectory, type OrgGroup } from "@/lib/groups";
import { SITE_ORIGIN, SITE_URL } from "@/lib/site";

const thumbs = thumbFiles as Record<string, string>;

function withThumbs(groups: OrgGroup[]): OrgGroup[] {
  return groups.map((group) => {
    const file = thumbs[group.id];
    return file ? { ...group, thumb: `/thumbs/${file}` } : group;
  });
}

export function loadGroups(): OrgGroup[] {
  return withThumbs(groupDirectory(loadDirectory()));
}

export function ShelfPage({ shelf }: { shelf: Shelf | "all" }) {
  const groups = loadGroups();
  const visible = shelf === "all" ? groups : groups.filter((group) => group.category === shelf);
  const pageUrl = shelf === "all" ? SITE_URL : `${SITE_ORIGIN}/${shelf}/`;
  const name = shelf === "all" ? "SociallyDead" : `${SHELF_LABEL[shelf]} — SociallyDead`;
  const description =
    shelf === "all"
      ? "A directory of people, shows, news desks, and organizations pushing back on MAGA, the AfD, and the far right."
      : SHELF_BLURB[shelf];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: pageUrl,
    description,
    isPartOf: { "@type": "WebSite", name: "SociallyDead", url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: visible.length,
      itemListElement: visible
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "en"))
        .map((group, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: group.name,
          description: group.blurb,
          url: group.presences[0]?.entry.url,
        })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero total={visible.length} noun={shelf === "all" ? "public listings" : SHELF_NOUN[shelf]} />
      <Directory groups={groups} shelf={shelf} />
    </>
  );
}
