import type { Metadata } from "next";
import { BounceZipExperience } from "./bouncezip-experience";

export const metadata: Metadata = {
  title: "BounceZip - Email Verification Platform | Sagor Hossain",
  description:
    "A full-stack case study of BounceZip, a production email-verification SaaS for real-time, bulk, catch-all, and API workflows.",
  openGraph: {
    title: "BounceZip - Email Verification Platform",
    description:
      "A production verification platform built to protect deliverability before every send.",
    images: ["/projects/bouncezip.webp"],
  },
};

export default function BounceZipProjectPage() {
  return <BounceZipExperience />;
}
