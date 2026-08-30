import type { Metadata } from "next";
import { LeadsFridayExperience } from "./leadsfriday-experience";

export const metadata: Metadata = {
  title: "LeadsFriday - B2B Lead Generation Platform | Sagor Hossain",
  description:
    "A full-stack case study of LeadsFriday, a pay-as-you-go B2B lead scraping, enrichment, verification, and delivery platform.",
  openGraph: {
    title: "LeadsFriday - B2B Lead Generation Platform",
    description:
      "A production lead-generation workspace connecting discovery, enrichment, verification, billing, and delivery.",
    images: ["/projects/leadsfriday/login.webp"],
  },
};

export default function LeadsFridayProjectPage() {
  return <LeadsFridayExperience />;
}
