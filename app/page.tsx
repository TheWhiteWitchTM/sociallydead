import { Directory } from "@/components/directory";
import { Hero } from "@/components/hero";
import { loadDirectory } from "@/lib/directory";
import { groupDirectory } from "@/lib/groups";

export default function HomePage() {
  const groups = groupDirectory(loadDirectory());
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
