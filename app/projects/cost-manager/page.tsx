import type { Metadata } from "next";
import { CostManagerExperience } from "./cost-manager-experience";

export const metadata: Metadata = {
  title: "Personal Cost Management System | Sagor Hossain",
  description:
    "A desktop application case study for a Python, CustomTkinter, and SQLite personal finance system covering transaction tracking, budget awareness, and reporting.",
};

export default function CostManagerProjectPage() {
  return <CostManagerExperience />;
}
