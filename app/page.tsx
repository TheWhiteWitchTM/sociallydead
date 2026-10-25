import { Directory } from "@/components/directory";
import { Hero } from "@/components/hero";
import thumbFiles from "@/data/thumbs.json";
import { loadDirectory } from "@/lib/directory";
import { groupDirectory, type OrgGroup } from "@/lib/groups";

const thumbs = thumbFiles as Record<string, string>;

function withThumbs(groups: OrgGroup[]): OrgGroup[] {
  return groups.map((group) => {
    const file = thumbs[group.id];
    return file ? { ...group, thumb: `/thumbs/${file}` } : group;
  });
}

export default function HomePage() {
  const groups = withThumbs(groupDirectory(loadDirectory()));
  const total = groups.length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SociallyDead",
    url: "https://sociallydead.me",
    description:
      "A directory of websites, YouTube channels, and X and Bluesky profiles pushing back on MAGA, the AfD, and the far right.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero total={total} />
      <Directory groups={groups} />
    </>
  );
}
