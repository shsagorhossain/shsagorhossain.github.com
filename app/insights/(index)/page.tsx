import type { Metadata } from "next";
import { InsightsIndexExperience } from "../insights-index-experience";
import { insights } from "@/data/insights";

export const metadata: Metadata = {
  title: "Insights Index | Sagor Hossain",
  description:
    "Explore Sagor Hossain's engineering field notes on software architecture, reliable systems, APIs, background jobs, and building production-ready products.",
  alternates: { canonical: "/insights/" },
  openGraph: {
    title: "Insights Index | Sagor Hossain",
    description:
      "Practical engineering notes shaped by designing, shipping, and operating modern software products.",
    images: [
      {
        url: "/insights/modular-monolith-architecture.webp",
        alt: "Sagor Hossain's engineering Insights Index",
      },
    ],
  },
};

export default function InsightsPage() {
  const insightListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sagor Hossain Insights Index",
    numberOfItems: insights.length,
    itemListElement: insights.map((insight, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://shsagorhossain.github.io/insights/${insight.slug}/`,
      name: insight.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insightListSchema).replace(/</g, "\\u003c") }}
      />
      <InsightsIndexExperience />
    </>
  );
}
