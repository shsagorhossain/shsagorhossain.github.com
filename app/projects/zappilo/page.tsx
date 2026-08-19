import type { Metadata } from "next";
import { ZappiloExperience } from "./zappilo-experience";

export const metadata: Metadata = {
  title: "Zappilo - AI Communication Platform | Sagor Hossain",
  description:
    "A full-stack case study of Zappilo, an AI-powered customer communication platform for WhatsApp, CRM, automation, scheduling, and commerce.",
  openGraph: {
    title: "Zappilo - AI Communication Platform",
    description: "A connected customer operations platform built around WhatsApp.",
    images: ["https://www.zappilo.com/seo/homepage-social.jpg"],
  },
};

export default function ZappiloProjectPage() {
  return <ZappiloExperience />;
}
