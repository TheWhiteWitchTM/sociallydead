import { Directory } from "@/components/directory";
import { Hero } from "@/components/hero";
import thumbFiles from "@/data/thumbs.json";
import { SHELF_BLURB, SHELF_LABEL, SHELF_NOUN } from "@/lib/categories";
import { loadDirectory } from "@/lib/directory";
import { groupDirectory, type OrgGroup } from "@/lib/groups";
import { SITE_ORIGIN, SITE_URL } from "@/lib/site";
import { UKRAINE_BLURB, UKRAINE_LABEL, UKRAINE_NOUN, supportsUkraine, type DirectoryShelf } from "@/lib/ukraine";

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

function shelfName(shelf: DirectoryShelf): string {
  if (shelf === "all") return "SociallyDead";
  if (shelf === "ukraine") return `${UKRAINE_LABEL} — SociallyDead`;
  return `${SHELF_LABEL[shelf]} — SociallyDead`;
}

function shelfDescription(shelf: DirectoryShelf): string {
  if (shelf === "all") {
    return "A directory of people, shows, news desks, and organizations pushing back on MAGA, the AfD, and the far right.";
  }
  if (shelf === "ukraine") return UKRAINE_BLURB;
  return SHELF_BLURB[shelf];
}

export function ShelfPage({ shelf }: { shelf: DirectoryShelf }) {
  const groups = loadGroups();
  const visible =
    shelf === "all" ? groups : shelf === "ukraine" ? groups.filter(supportsUkraine) : groups.filter((group) => group.category === shelf);
  const pageUrl = shelf === "all" ? SITE_URL : `${SITE_ORIGIN}/${shelf}/`;
  const name = shelfName(shelf);
  const description = shelfDescription(shelf);
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
      <Hero
        total={visible.length}
        noun={shelf === "all" ? "public listings" : shelf === "ukraine" ? UKRAINE_NOUN : SHELF_NOUN[shelf]}
      />
      <Directory groups={groups} shelf={shelf} />
    </>
  );
}
