import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticleExperience } from "./insight-article-experience";
import { getInsightBySlug, insights } from "@/data/insights";

type InsightPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) return {};

  return {
    title: `${insight.title} | Sagor Hossain`,
    description: insight.excerpt,
    authors: [{ name: insight.author }],
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.excerpt,
      publishedTime: insight.publishedAt,
      authors: [insight.author],
      tags: insight.tags,
      images: [{ url: insight.image, alt: insight.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: insight.title,
      description: insight.excerpt,
      images: [insight.image],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    image: `https://shsagorhossain.github.io${insight.image}`,
    datePublished: insight.publishedAt,
    author: {
      "@type": "Person",
      name: insight.author,
      url: "https://shsagorhossain.github.io/",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />
      <InsightArticleExperience insight={insight} />
    </>
  );
}
