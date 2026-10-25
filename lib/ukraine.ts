import type { Shelf } from "@/lib/categories";

export type DirectoryShelf = Shelf | "all" | "ukraine";

export const UKRAINE_TAG = "ukraine";
export const UKRAINE_LABEL = "Ukraine";
export const UKRAINE_BLURB = "People in this directory who stand with Ukraine.";
export const UKRAINE_NOUN = "people who stand with Ukraine";
export const UKRAINE_PATH = "/ukraine/";

/** State channels, plus funds named on Ukraine's official donate page. */
export const UKRAINE_OFFICIAL_LIST = "https://war.ukraine.ua/donate/";

export const UKRAINE_LINKS: { href: string; name: string; detail: string }[] = [
  {
    href: "https://u24.gov.ua/",
    name: "UNITED24",
    detail: "Official platform of the President of Ukraine. Defence, medical aid, demining, and rebuilding.",
  },
  {
    href: "https://bank.gov.ua/en/about/support-the-armed-forces/",
    name: "National Bank of Ukraine",
    detail: "The state's account for the armed forces.",
  },
  {
    href: "https://savelife.in.ua/en/",
    name: "Come Back Alive",
    detail: "Ukrainian foundation equipping the defence forces since 2014.",
  },
  {
    href: "https://prytulafoundation.org/en",
    name: "Serhii Prytula Foundation",
    detail: "Equipment, supplies, and humanitarian aid.",
  },
  {
    href: "https://www.hospitallers.life/needs-hospitallers",
    name: "Hospitallers",
    detail: "Volunteer medics for wounded defenders.",
  },
  {
    href: "https://razomforukraine.org/razom-emergency-response/",
    name: "Razom",
    detail: "Emergency medical and humanitarian aid.",
  },
  {
    href: "https://novaukraine.org/donate/",
    name: "Nova Ukraine",
    detail: "Humanitarian aid from a U.S. nonprofit.",
  },
];

export function supportsUkraine(group: { category: string; tags: string[] }): boolean {
  return group.category === "people" && group.tags.includes(UKRAINE_TAG);
}
