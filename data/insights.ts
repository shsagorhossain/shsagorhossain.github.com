export const insightCategories = [
  {
    id: "software-engineering",
    label: "Software Engineering",
    description: "Architecture, maintainability, testing, and production-ready systems.",
  },
  {
    id: "frontend-development",
    label: "Frontend Development",
    description: "Responsive interfaces, performance, accessibility, and modern React patterns.",
  },
  {
    id: "backend-development",
    label: "Backend Development",
    description: "APIs, services, background jobs, and dependable application logic.",
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    description: "Practical AI workflows, agents, integrations, and operational automation.",
  },
  {
    id: "saas-development",
    label: "SaaS Development",
    description: "Multi-tenant products, billing, onboarding, and sustainable product systems.",
  },
  {
    id: "devops-cloud",
    label: "DevOps & Cloud",
    description: "Deployment pipelines, infrastructure, observability, and release operations.",
  },
  {
    id: "databases-performance",
    label: "Databases & Performance",
    description: "Data modeling, query efficiency, caching, and application performance.",
  },
  {
    id: "security-reliability",
    label: "Security & Reliability",
    description: "Secure defaults, resilient workflows, permissions, and failure recovery.",
  },
  {
    id: "project-case-studies",
    label: "Project Case Studies",
    description: "Detailed breakdowns of real products, constraints, decisions, and outcomes.",
  },
  {
    id: "engineering-lessons",
    label: "Engineering Lessons",
    description: "Practical lessons collected while designing, shipping, and supporting software.",
  },
] as const;

export type InsightCategoryId = (typeof insightCategories)[number]["id"];

export type InsightSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type InsightPost = {
  slug: string;
  title: string;
  excerpt: string;
  lead: string;
  categoryId: InsightCategoryId;
  image: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  sections: InsightSection[];
};

export const insights: InsightPost[] = [
  {
    slug: "building-production-ready-software-beyond-the-happy-path",
    title: "Building Production-Ready Software Beyond the Happy Path",
    excerpt:
      "A practical framework for turning working features into software that remains observable, recoverable, and maintainable after launch.",
    lead:
      "A feature is not finished when the ideal request succeeds. It is finished when the team understands how it behaves under pressure, how it fails, and how it can be restored without guesswork.",
    categoryId: "software-engineering",
    image: "/insights/production-ready-software.webp",
    imageAlt: "Software architecture and observability workspace",
    author: "Sagor Hossain",
    publishedAt: "2026-08-24",
    readTime: "7 min read",
    tags: ["Architecture", "Reliability", "Delivery"],
    featured: true,
    sections: [
      {
        heading: "Working software is only the starting point",
        paragraphs: [
          "The happy path proves that an idea can work. Production readiness proves that the system can keep working when requests arrive twice, dependencies slow down, data is incomplete, or a release needs to be reversed.",
          "That difference changes engineering priorities. Error states, audit trails, permissions, retries, and deployment strategy become part of the feature rather than tasks postponed until after launch.",
        ],
      },
      {
        heading: "Define boundaries before adding layers",
        paragraphs: [
          "Clear ownership is more valuable than a large collection of abstractions. A module should have a focused responsibility, an explicit contract, and a predictable way to report failure. This keeps business rules from leaking into controllers, interface components, or background workers.",
          "I start by mapping the user action, the data it changes, the external services it depends on, and the events that other parts of the product must observe. The resulting boundaries make the code easier to test and safer to change.",
        ],
      },
      {
        heading: "Treat failure as a designed state",
        paragraphs: [
          "Distributed workflows rarely fail in a clean, all-or-nothing way. A payment may complete before a webhook arrives, an email provider may time out after accepting a message, or a user may retry while the first request is still processing.",
          "Idempotent operations, bounded retries, useful error messages, and recovery paths prevent these moments from becoming manual data repairs. The interface should also communicate what happened and what the user can do next.",
        ],
      },
      {
        heading: "Make important behavior visible",
        paragraphs: [
          "Logs are most useful when they explain a business event, not only a stack trace. Structured context such as an account, request, job, and integration identifier makes an incident traceable across services.",
          "Metrics and alerts should follow the workflows the product depends on: queue age, failed automation runs, payment reconciliation, response latency, and unusual permission failures. Visibility shortens debugging and helps the team improve the system with evidence.",
        ],
      },
      {
        heading: "Ship in slices that can be reversed",
        paragraphs: [
          "Small releases reduce uncertainty. Database changes can be made backward compatible, risky behavior can sit behind a feature flag, and migrations can be separated from the code that begins using them.",
          "A release plan should answer three questions before deployment: how success will be measured, how a problem will be detected, and how the change will be disabled or rolled back.",
        ],
      },
      {
        heading: "A compact production-readiness checklist",
        paragraphs: [
          "The exact checklist changes by product, but these questions catch many expensive omissions before customers do.",
        ],
        points: [
          "Are authorization and validation enforced at the system boundary?",
          "Can repeated requests run safely without duplicating side effects?",
          "Are slow dependencies, partial failures, and retries handled deliberately?",
          "Can the team trace a user action across the relevant services and jobs?",
          "Are database changes backward compatible and recoverable?",
          "Is there a clear success signal and a tested rollback path?",
        ],
      },
    ],
  },
];

export function getInsightCategory(categoryId: InsightCategoryId) {
  return insightCategories.find((category) => category.id === categoryId);
}
