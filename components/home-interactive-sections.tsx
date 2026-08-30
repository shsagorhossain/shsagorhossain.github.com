"use client";

import dynamic from "next/dynamic";

const ServicesNetwork = dynamic(
  () => import("./services-network").then((module) => module.ServicesNetwork),
  { loading: () => <HomeSectionPlaceholder variant="services" /> },
);

const ProjectsCarousel = dynamic(
  () => import("./projects-carousel").then((module) => module.ProjectsCarousel),
  { loading: () => <HomeSectionPlaceholder variant="projects" /> },
);

const TestimonialsCarousel = dynamic(
  () => import("./testimonials-carousel").then((module) => module.TestimonialsCarousel),
  { loading: () => <HomeSectionPlaceholder variant="stories" /> },
);

const InsightsShowcase = dynamic(
  () => import("./insights-showcase").then((module) => module.InsightsShowcase),
  { loading: () => <HomeSectionPlaceholder variant="insights" /> },
);

const FaqExperience = dynamic(
  () => import("./faq-experience").then((module) => module.FaqExperience),
  { loading: () => <HomeSectionPlaceholder variant="faq" /> },
);

function HomeSectionPlaceholder({ variant }: { variant: string }) {
  return (
    <div className={`home-section-placeholder home-section-placeholder-${variant}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function HomeServicesNetwork() {
  return <ServicesNetwork />;
}

export function HomeProjectsCarousel() {
  return <ProjectsCarousel />;
}

export function HomeTestimonialsCarousel() {
  return <TestimonialsCarousel />;
}

export function HomeInsightsShowcase() {
  return <InsightsShowcase />;
}

export function HomeFaqExperience() {
  return <FaqExperience />;
}
