import type { Metadata } from "next";
import { MohulsExperience } from "./mohuls-experience";

export const metadata: Metadata = {
  title: "Mohuls - Business Software Ecosystem | Sagor Hossain",
  description:
    "A full-stack case study of Mohuls, a connected business software ecosystem spanning seven products, customer accounts, marketplace journeys, and internal operations.",
  openGraph: {
    title: "Mohuls - Business Software Ecosystem",
    description:
      "A production multi-product platform built for connected business operations.",
    images: ["/projects/mohuls.webp"],
  },
};

export default function MohulsProjectPage() {
  return <MohulsExperience />;
}
