"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Database,
  MonitorCog,
  Rocket,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

type Service = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  deliverables: string[];
  stack: string[];
  icon: LucideIcon;
  tone: string;
  path: string;
};

const services: Service[] = [
  {
    id: "web",
    title: "Web Development",
    shortLabel: "Fast, scalable web apps",
    description:
      "Responsive, production-ready websites engineered for speed, usability, and growth.",
    deliverables: ["Custom architecture", "Responsive build", "Performance tuning"],
    stack: ["Next.js", "React", "Tailwind CSS"],
    icon: MonitorCog,
    tone: "blue",
    path: "M500 260 C405 225 345 155 185 112",
  },
  {
    id: "backend",
    title: "Backend Development",
    shortLabel: "Secure systems and APIs",
    description:
      "Reliable backend platforms built around clean architecture, secure data, and scalable APIs.",
    deliverables: ["REST API design", "Database modeling", "Secure authentication"],
    stack: ["Python", "Django", "PostgreSQL"],
    icon: Database,
    tone: "green",
    path: "M500 260 C595 225 655 155 815 112",
  },
  {
    id: "frontend",
    title: "Frontend Development",
    shortLabel: "Polished product interfaces",
    description:
      "Accessible, responsive interfaces that turn complex product flows into clear experiences.",
    deliverables: ["Design implementation", "Reusable components", "Smooth interactions"],
    stack: ["React", "Next.js", "TypeScript"],
    icon: Smartphone,
    tone: "purple",
    path: "M500 260 C405 300 345 370 185 410",
  },
  {
    id: "api",
    title: "API Integration",
    shortLabel: "Connected product workflows",
    description:
      "Dependable third-party integrations and custom workflows that keep your product connected.",
    deliverables: ["Third-party APIs", "Webhooks and events", "Workflow automation"],
    stack: ["REST", "Webhooks", "Automation"],
    icon: Rocket,
    tone: "yellow",
    path: "M500 260 C595 300 655 370 815 410",
  },
];

export function ServicesNetwork() {
  const nodeLayerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const activeService = services[activeIndex];
  const ActiveIcon = activeService.icon;

  useEffect(() => {
    if (pinned || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % services.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [pinned]);

  useEffect(() => {
    const layer = nodeLayerRef.current;
    if (!layer || !window.matchMedia("(max-width: 640px)").matches) return;

    const node = layer.children[activeIndex] as HTMLElement | undefined;
    if (!node) return;

    layer.scrollTo({
      left: node.offsetLeft - (layer.clientWidth - node.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [activeIndex]);

  const selectService = (index: number, shouldPin = false) => {
    setActiveIndex(index);
    if (shouldPin) setPinned(true);
  };

  return (
    <div className={`service-network tone-${activeService.tone}`}>
      <svg className="service-connections" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
        {services.map((service, index) => (
          <g key={service.id} className={`connection tone-${service.tone} ${index === activeIndex ? "active" : ""}`}>
            <path d={service.path} pathLength="1" />
            <circle r="4">
              <animateMotion
                dur={`${4.8 + index * 0.45}s`}
                begin={`${index * -0.9}s`}
                repeatCount="indefinite"
                path={service.path}
              />
            </circle>
          </g>
        ))}
      </svg>

      <div className="service-node-layer" ref={nodeLayerRef} onPointerDown={() => setPinned(true)}>
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <button
              className={`service-node node-${service.id} tone-${service.tone} ${index === activeIndex ? "active" : ""}`}
              type="button"
              key={service.id}
              aria-pressed={index === activeIndex}
              onMouseEnter={() => selectService(index)}
              onFocus={() => selectService(index)}
              onClick={() => selectService(index, true)}
            >
              <span className="service-node-icon"><Icon size={20} /></span>
              <span>
                <strong>{service.title}</strong>
                <small>{service.shortLabel}</small>
              </span>
            </button>
          );
        })}
      </div>

      <article className="service-console">
        <header>
          <span className="service-console-mark"><Code2 size={21} /></span>
          <span>
            <strong>Sagor Studio</strong>
            <small><i /> Available for work</small>
          </span>
        </header>

        <div className="service-console-content" key={activeService.id} aria-live="polite">
          <span className="service-number">Service {String(activeIndex + 1).padStart(2, "0")}</span>
          <div className="service-title-row">
            <span><ActiveIcon size={20} /></span>
            <h3>{activeService.title}</h3>
          </div>
          <p>{activeService.description}</p>
          <ul>
            {activeService.deliverables.map((item) => (
              <li key={item}><Check size={14} />{item}</li>
            ))}
          </ul>
          <div className="service-stack">
            {activeService.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <a href={`mailto:shsagor.11s@gmail.com?subject=${encodeURIComponent(activeService.title)}%20project`}>
          Discuss This Service
          <ArrowUpRight size={16} />
        </a>
      </article>
    </div>
  );
}
