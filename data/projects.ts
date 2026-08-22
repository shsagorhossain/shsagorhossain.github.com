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
    title: "MSL Lab - Staff Operations Platform",
    shortTitle: "MSL Lab",
    description: "Private admin and staff operations for product delivery, infrastructure, CRM, billing, communications, tasks, and AI-assisted workflows.",
    image: "/projects/msl-lab.webp",
    tags: ["React", "Django", "PostgreSQL"],
    href: "/projects/msl-lab/",
    actionLabel: "View MSL Lab case study",
    actionText: "View case study",
    badge: "Case Study",
    category: "Product",
    discipline: "Staff operations",
    stage: "Private production",
    accent: "green",
    featured: true,
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
  {
    number: "05",
    title: "Mohuls - Business Software Ecosystem",
    shortTitle: "Mohuls",
    description: "A connected public software ecosystem for product discovery, customer accounts, marketplace journeys, and seven focused business applications.",
    image: "/projects/mohuls.webp",
    tags: ["Next.js", "React", "TypeScript"],
    href: "/projects/mohuls/",
    actionLabel: "View Mohuls case study",
    actionText: "View case study",
    badge: "Case Study",
    category: "Product",
    discipline: "Multi-product SaaS",
    stage: "Live ecosystem",
    accent: "purple",
    featured: true,
  },
];
