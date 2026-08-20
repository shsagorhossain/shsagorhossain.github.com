import type { Metadata } from "next";
import { MslLabExperience } from "./msl-lab-experience";

export const metadata: Metadata = {
  title: "MSL Lab - Staff Operations Platform | Sagor Hossain",
  description:
    "A full-stack case study of MSL Lab, a private admin and staff operations platform connecting delivery, infrastructure, customer communication, billing, tasks, and AI-assisted workflows.",
  openGraph: {
    title: "MSL Lab - Staff Operations Platform",
    description: "The private operating system behind Mohuls product and service delivery.",
    images: ["https://shsagorhossain.github.io/projects/msl-lab.webp"],
  },
};

export default function MslLabProjectPage() {
  return <MslLabExperience />;
}
