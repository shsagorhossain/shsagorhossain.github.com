"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";

const ServicesNetwork = dynamic(
  () => import("./services-network").then((module) => module.ServicesNetwork),
  { ssr: false, loading: () => <HomeSectionPlaceholder variant="services" /> },
);

const ProjectsCarousel = dynamic(
  () => import("./projects-carousel").then((module) => module.ProjectsCarousel),
  { ssr: false, loading: () => <HomeSectionPlaceholder variant="projects" /> },
);

const TestimonialsCarousel = dynamic(
  () => import("./testimonials-carousel").then((module) => module.TestimonialsCarousel),
  { ssr: false, loading: () => <HomeSectionPlaceholder variant="stories" /> },
);

const InsightsShowcase = dynamic(
  () => import("./insights-showcase").then((module) => module.InsightsShowcase),
  { ssr: false, loading: () => <HomeSectionPlaceholder variant="insights" /> },
);

const FaqExperience = dynamic(
  () => import("./faq-experience").then((module) => module.FaqExperience),
  { ssr: false, loading: () => <HomeSectionPlaceholder variant="faq" /> },
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

function DeferredHomeSection({
  component: Component,
  variant,
}: {
  component: ComponentType;
  variant: string;
}) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary || ready) return;

    if (!("IntersectionObserver" in window)) {
      const fallbackTimer = globalThis.setTimeout(() => setReady(true), 0);
      return () => globalThis.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "900px 0px", threshold: 0.01 },
    );

    observer.observe(boundary);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div className="home-deferred-section" ref={boundaryRef} data-home-module={variant} data-ready={ready}>
      {ready ? <Component /> : <HomeSectionPlaceholder variant={variant} />}
    </div>
  );
}

export function HomeServicesNetwork() {
  return <DeferredHomeSection component={ServicesNetwork} variant="services" />;
}

export function HomeProjectsCarousel() {
  return <DeferredHomeSection component={ProjectsCarousel} variant="projects" />;
}

export function HomeTestimonialsCarousel() {
  return <DeferredHomeSection component={TestimonialsCarousel} variant="stories" />;
}

export function HomeInsightsShowcase() {
  return <DeferredHomeSection component={InsightsShowcase} variant="insights" />;
}

export function HomeFaqExperience() {
  return <DeferredHomeSection component={FaqExperience} variant="faq" />;
}
