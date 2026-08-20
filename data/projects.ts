export type ProjectCategory = "Product" | "Web" | "Desktop";

export type PortfolioProject = {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  tags: string[];
  href: string;
  actionLabel: string;
  actionText: string;
  badge?: string;
  category: ProjectCategory;
  discipline: string;
  stage: string;
  accent: "blue" | "green" | "purple" | "yellow" | "cyan" | "pink";
  featured?: boolean;
};

export const projects: PortfolioProject[] = [
  {
    number: "01",
    title: "Zappilo - AI Communication Platform",
    shortTitle: "Zappilo",
    description: "WhatsApp conversations, AI workforce, CRM, automation, and scheduling in one connected product.",
    image: "/projects/zappilo/homepage-social.webp",
    tags: ["Next.js", "React", "Django"],
    href: "/projects/zappilo/",
    actionLabel: "View Zappilo case study",
    actionText: "View case study",
    badge: "Case Study",
    category: "Product",
    discipline: "Full-stack SaaS",
    stage: "Live product",
    accent: "blue",
    featured: true,
  },
  {
    number: "02",
    title: "MSL Lab - WhatsApp Marketing",
    shortTitle: "MSL Lab",
    description: "WhatsApp marketing with contact management, campaigns, delivery workflows, and analytics.",
    image: "/projects/msl-lab.webp",
    tags: ["Django", "React", "PostgreSQL"],
    href: "#contact",
    actionLabel: "Ask about MSL Lab - WhatsApp Marketing",
    actionText: "Discuss project",
    category: "Product",
    discipline: "Campaign platform",
    stage: "Selected build",
    accent: "green",
  },
  {
    number: "03",
    title: "Personal Cost Management System",
    shortTitle: "Cost Manager",
    description: "Desktop software for managing personal finances, expense records, and reporting efficiently.",
    image: "/projects/cost-manager/dashboard.webp",
    tags: ["Python", "CustomTkinter", "SQLite"],
    href: "/projects/cost-manager/",
    actionLabel: "View Personal Cost Management case study",
    actionText: "View case study",
    badge: "Case Study",
    category: "Desktop",
    discipline: "Finance utility",
    stage: "Selected build",
    accent: "yellow",
    featured: true,
  },
  {
    number: "04",
    title: "One Lifestyle BD - E-Commerce Platform",
    shortTitle: "One Lifestyle BD",
    description: "A production commerce platform for catalog, checkout, payments, delivery operations, returns, reporting, and customer management.",
    image: "/projects/one-lifestyle.webp",
    tags: ["Next.js", "Django", "PostgreSQL"],
    href: "/projects/one-lifestyle/",
    actionLabel: "View One Lifestyle BD case study",
    actionText: "View case study",
    badge: "Case Study",
    category: "Product",
    discipline: "Commerce platform",
    stage: "Live product",
    accent: "cyan",
    featured: true,
  },
];
