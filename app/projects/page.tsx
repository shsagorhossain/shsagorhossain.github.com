import type { Metadata } from "next";
import { ProjectsExperience } from "./projects-experience";

export const metadata: Metadata = {
  title: "Selected Projects | Sagor Hossain",
  description:
    "Explore Sagor Hossain's selected full-stack products, web applications, dashboards, and desktop software.",
};

export default function ProjectsPage() {
  return <ProjectsExperience />;
}
