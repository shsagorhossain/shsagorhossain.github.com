import type { Metadata } from "next";
import { OneLifestyleExperience } from "./one-lifestyle-experience";

export const metadata: Metadata = {
  title: "One Lifestyle BD - Commerce Platform | Sagor Hossain",
  description:
    "A full-stack case study of One Lifestyle BD, a production commerce platform connecting storefront discovery, checkout, payments, fulfillment, returns, reporting, and customer operations.",
  openGraph: {
    title: "One Lifestyle BD - Commerce Platform",
    description: "A production storefront and commerce operations system built for Bangladesh.",
    images: ["https://onelifestyle.com.bd/api/open-graph"],
  },
};

export default function OneLifestyleProjectPage() {
  return <OneLifestyleExperience />;
}
