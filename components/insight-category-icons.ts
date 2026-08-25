import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Bot,
  Braces,
  CloudCog,
  DatabaseZap,
  FolderKanban,
  GraduationCap,
  PanelsTopLeft,
  ServerCog,
  ShieldCheck,
} from "lucide-react";
import type { InsightCategoryId } from "@/data/insights";

export const insightCategoryIcons: Record<InsightCategoryId, LucideIcon> = {
  "software-engineering": Braces,
  "frontend-development": PanelsTopLeft,
  "backend-development": ServerCog,
  "ai-automation": Bot,
  "saas-development": AppWindow,
  "devops-cloud": CloudCog,
  "databases-performance": DatabaseZap,
  "security-reliability": ShieldCheck,
  "project-case-studies": FolderKanban,
  "engineering-lessons": GraduationCap,
};
