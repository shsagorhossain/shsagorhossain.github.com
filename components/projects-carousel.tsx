"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronsLeft,
  ChevronsRight,
  Code2,
  Database,
  ExternalLink,
  FolderKanban,
  Layers3,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, type PortfolioProject } from "@/data/projects";

const HOMEPAGE_PROJECT_LIMIT = 10;
const homepageProjects = projects.slice(0, HOMEPAGE_PROJECT_LIMIT);
const totalSlides = homepageProjects.length + 1;

export function ProjectsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentProject, setCurrentProject] = useState(0);
  const [loadingProject, setLoadingProject] = useState<string | null>(null);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".project-card");
    if (card) {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
      const nextProject = Math.min(totalSlides - 1, Math.round(track.scrollLeft / (card.offsetWidth + gap)));
      setCurrentProject(nextProject);
      setCanScrollLeft(nextProject > 0);
    }
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [updateControls]);

  useEffect(() => {
    const resetNavigationState = () => {
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
      setLoadingProject(null);
    };

    window.addEventListener("pageshow", resetNavigationState);

    return () => {
      window.removeEventListener("pageshow", resetNavigationState);
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
    };
  }, []);

  const scrollProjects = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".project-card");
    if (!track || !card) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const openProject = (event: ReactMouseEvent<HTMLAnchorElement>, project: PortfolioProject) => {
    const isPrimaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPrimaryClick || !project.href.startsWith("/") || loadingProject) return;

    event.preventDefault();
    setLoadingProject(project.title);

    navigationTimerRef.current = window.setTimeout(() => {
      navigationTimerRef.current = null;
      window.location.assign(project.href);
    }, reduceMotion ? 0 : 360);
  };

  return (
    <div className="project-carousel">
      <AnimatePresence>
        {loadingProject && (
          <motion.div
            className="project-route-status"
            role="status"
            aria-live="assertive"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
          >
            <span className="project-route-status-icon"><LoaderCircle size={19} /></span>
            <span>
              <small>Opening case study</small>
              <strong>{loadingProject}</strong>
            </span>
            <motion.i
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="project-track" ref={trackRef} aria-label="Featured projects">
        {homepageProjects.map((project, index) => {
          const isLoading = loadingProject === project.title;
          return (
            <motion.article
            className={`project-card ${isLoading ? "is-loading" : ""}`}
            key={project.title}
            initial={reduceMotion ? false : { opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, root: trackRef, amount: 0.08 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.21) }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <a className="project-image" href={project.href} aria-label={project.actionLabel} onClick={(event) => openProject(event, project)}>
              <Image src={project.image} alt={`${project.title} preview`} fill sizes="(max-width: 640px) 82vw, (max-width: 900px) 44vw, 30vw" />
              {project.badge && <span className="project-badge">{project.badge}</span>}
              <span className="project-image-action" aria-hidden="true">
                {isLoading ? <LoaderCircle className="project-loading-spinner" size={16} /> : <ExternalLink size={15} />}
              </span>
              <AnimatePresence>
                {isLoading && (
                  <motion.span
                    className="project-image-loading"
                    aria-hidden="true"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoaderCircle className="project-loading-spinner" size={25} />
                    <strong>Opening details</strong>
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
            <h3><a href={project.href} onClick={(event) => openProject(event, project)}>{project.title}</a></h3>
            <p>{project.description}</p>
            <div className="tag-list">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </motion.article>
          );
        })}

        <motion.article
          className="project-index-card"
          initial={reduceMotion ? false : { opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, root: trackRef, amount: 0.08 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          whileHover={reduceMotion ? undefined : { y: -5 }}
          aria-label="Continue to all projects"
        >
          <div className="project-index-backdrop" aria-hidden="true"><i /><i /><i /></div>
          <div className="project-index-header">
            <span><Sparkles size={12} />End of selection</span>
            <strong>{String(homepageProjects.length).padStart(2, "0")} / {String(homepageProjects.length).padStart(2, "0")}</strong>
          </div>
          <div className="project-index-gateway" aria-hidden="true">
            <motion.div
              className="project-index-orbit"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <span><Code2 size={14} /></span>
              <span><Database size={14} /></span>
              <span><Layers3 size={14} /></span>
            </motion.div>
            <motion.span
              className="project-index-core"
              animate={reduceMotion ? undefined : { scale: [1, 1.07, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FolderKanban size={29} />
            </motion.span>
          </div>
          <div className="project-index-copy">
            <span>Complete portfolio archive</span>
            <h3>You have reached the end of the featured selection.</h3>
            <p>
              Continue to the complete index for every case study, product story, and technical build.
            </p>
          </div>
          <Link className="project-index-action" href="/projects/">
            View All Projects
            <ArrowUpRight size={16} />
          </Link>
          <span className="project-index-edge" aria-hidden="true">Project index</span>
        </motion.article>
      </div>

      <div className="carousel-footer">
        <div className="carousel-position" aria-live="polite" aria-atomic="true">
          <strong>{String(currentProject + 1).padStart(2, "0")}</strong>
          <span aria-hidden="true" />
          {String(totalSlides).padStart(2, "0")}
        </div>
        <div className="carousel-controls">
          <button
            className="project-scroll-button project-scroll-left"
            type="button"
            aria-label="Scroll projects left"
            disabled={!canScrollLeft}
            onClick={() => scrollProjects(-1)}
          >
            <ChevronsLeft size={21} />
          </button>
          <button
            className="project-scroll-button project-scroll-right"
            type="button"
            aria-label="Scroll projects right"
            disabled={!canScrollRight}
            onClick={() => scrollProjects(1)}
          >
            <ChevronsRight size={21} />
          </button>
        </div>
      </div>
    </div>
  );
}
