"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  LoaderCircle,
  Menu,
  Rocket,
  Smile,
  Star,
  X,
} from "lucide-react";
import {
  SiDjango,
  SiDocker,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSqlite,
  SiTypescript,
} from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { projects, type PortfolioProject } from "@/data/projects";
import styles from "./projects.module.css";

type SortMode = "featured" | "az" | "za";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/projects/" },
  { label: "Skills", href: "/#skills" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

const techIcons = {
  "Next.js": SiNextdotjs,
  React: SiReact,
  Django: SiDjango,
  PostgreSQL: SiPostgresql,
  Python: SiPython,
  SQLite: SiSqlite,
  TypeScript: SiTypescript,
  Docker: SiDocker,
};

const metrics = [
  { value: "20+", label: "Projects Completed", icon: Rocket, tone: "blue" },
  { value: "15+", label: "Happy Clients", icon: Smile, tone: "cyan" },
  { value: "2+", label: "Years Experience", icon: Code2, tone: "purple" },
  { value: String(projects.length).padStart(2, "0"), label: "Selected Projects", icon: Star, tone: "yellow" },
] as const;

function destinationFor(project: PortfolioProject) {
  return project.href === "#contact" ? "/#contact" : project.href;
}

function categoryLabel(project: PortfolioProject) {
  if (project.category === "Desktop") return "Desktop Application";
  if (project.category === "Product") return "Product Platform";
  return "Web Application";
}

export function ProjectsExperience() {
  const reduceMotion = useReducedMotion();
  const navigationTimerRef = useRef<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openingProject, setOpeningProject] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();

  const sortedProjects = useMemo(() => [...projects].sort((first, second) => {
    if (sortMode === "az") return first.title.localeCompare(second.title);
    if (sortMode === "za") return second.title.localeCompare(first.title);
    return Number(Boolean(second.featured)) - Number(Boolean(first.featured))
      || first.number.localeCompare(second.number);
  }), [sortMode]);

  useEffect(() => () => {
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const openProject = (event: ReactMouseEvent<HTMLAnchorElement>, project: PortfolioProject) => {
    const destination = destinationFor(project);
    const isPrimaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (!isPrimaryClick || !destination.startsWith("/projects/") || openingProject) return;

    event.preventDefault();
    setOpeningProject(project.title);
    navigationTimerRef.current = window.setTimeout(() => {
      window.location.assign(destination);
    }, reduceMotion ? 0 : 360);
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <div className={styles.pageTexture} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>

          <nav className={styles.desktopNav} aria-label="Project page navigation">
            {navLinks.map((link) => (
              <Link className={link.label === "Projects" ? styles.activeNav : undefined} href={link.href} key={link.label}>{link.label}</Link>
            ))}
          </nav>

          <a className={styles.talkButton} href="mailto:shsagor.11s@gmail.com">Let&apos;s Talk<ArrowUpRight size={15} /></a>
          <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((current) => !current)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className={styles.mobileNavLayer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
            <motion.nav aria-label="Mobile project page navigation" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {navLinks.map((link, index) => (
                <motion.div initial={reduceMotion ? false : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * 0.035 }} key={link.label}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2, "0")}</span>{link.label}<ArrowUpRight size={16} /></Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openingProject && (
          <motion.div className={styles.routeStatus} role="status" aria-live="assertive" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}>
            <LoaderCircle className={styles.spinner} size={20} />
            <span><small>Opening case study</small><strong>{openingProject}</strong></span>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0.01 : 0.7 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className={`${styles.hero} ${styles.shell}`}>
          <motion.div className={styles.heroCopy} initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className={styles.eyebrow}><BriefcaseBusiness size={13} />My Work</span>
            <h1>All <span>Projects</span></h1>
            <p>Explore a curated selection of projects built for clients and personal ventures. Each one represents a distinct challenge, solution, and impact.</p>
          </motion.div>

          <motion.div className={styles.heroSignal} initial={reduceMotion ? false : { opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.12 }} aria-hidden="true">
            <svg viewBox="0 0 620 165" preserveAspectRatio="none">
              <path className={styles.signalPathBack} d="M4 102 C102 22 162 145 254 90 S410 127 616 24" />
              <path className={styles.signalPathFront} d="M4 110 C112 52 172 124 264 79 S420 137 616 44" pathLength="1" />
              <circle r="7"><animateMotion dur="5s" repeatCount="indefinite" path="M4 110 C112 52 172 124 264 79 S420 137 616 44" /></circle>
            </svg>
            <span><Code2 size={38} /></span>
          </motion.div>
        </section>

        <section className={`${styles.metrics} ${styles.shell}`} aria-label="Portfolio metrics">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div className={styles[metric.tone]} initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 + index * 0.07 }} key={metric.label}>
                <span><Icon size={23} /></span><div><strong>{metric.value}</strong><small>{metric.label}</small></div>
              </motion.div>
            );
          })}
        </section>

        <section className={`${styles.projectsSection} ${styles.shell}`} aria-label="All projects">
          <div className={styles.projectToolbar}>
            <div><span />Showing {sortedProjects.length} projects</div>
            <label><span>Sort by:</span><select aria-label="Sort projects" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}><option value="featured">Featured First</option><option value="az">Title A-Z</option><option value="za">Title Z-A</option></select></label>
          </div>
          <motion.div className={styles.projectGrid} layout>
            <AnimatePresence mode="popLayout">
              {sortedProjects.map((project, index) => {
                const destination = destinationFor(project);
                const isOpening = openingProject === project.title;
                return (
                  <motion.article className={`${styles.projectCard} ${styles[project.accent]} ${isOpening ? styles.opening : ""}`} key={project.title} layout initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42, delay: Math.min(index * 0.045, 0.18) }} whileHover={reduceMotion ? undefined : { y: -6 }}>
                    <a className={styles.projectMedia} href={destination} aria-label={project.actionLabel} onClick={(event) => openProject(event, project)}>
                      <Image src={project.image} alt={`${project.title} preview`} fill sizes="(max-width: 620px) 90vw, (max-width: 980px) 43vw, 23vw" />
                      <span className={styles.categoryBadge}>{categoryLabel(project)}</span>
                      <span className={styles.mediaAction} aria-hidden="true">{isOpening ? <LoaderCircle className={styles.spinner} size={16} /> : <ArrowUpRight size={17} />}</span>
                      {isOpening && <span className={styles.mediaLoading} aria-hidden="true"><LoaderCircle className={styles.spinner} size={23} />Opening details</span>}
                    </a>

                    <div className={styles.projectBody}>
                      <h3><a href={destination} onClick={(event) => openProject(event, project)}>{project.title}</a></h3>
                      <p>{project.description}</p>
                      <div className={styles.projectTags} aria-label={`${project.title} technologies`}>
                        {project.tags.map((tag) => {
                          const TechIcon = techIcons[tag as keyof typeof techIcons];
                          return <span key={tag}>{TechIcon ? <TechIcon /> : <Code2 />}{tag}</span>;
                        })}
                      </div>
                      <div className={styles.cardActions}>
                        <a href={destination} onClick={(event) => openProject(event, project)}>{project.actionText}<ArrowUpRight size={15} /></a>
                        <a href="https://github.com/shsagorhossain" target="_blank" rel="noreferrer">GitHub<FaGithub size={14} /></a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className={`${styles.contactBand} ${styles.shell}`}>
          <span className={styles.rocketIcon}><Rocket size={27} /></span>
          <div><h2>Have a project in mind?</h2><p>Let&apos;s collaborate and build something effective together.</p></div>
          <a href="mailto:shsagor.11s@gmail.com">Let&apos;s Discuss Your Project<ArrowUpRight size={16} /></a>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}><Image src="/sh-logo.webp" alt="" width={64} height={43} /><p>Selected work by Sagor Hossain.</p><Link href="/">Back to portfolio</Link></div>
      </footer>
    </div>
  );
}
