"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  CreditCard,
  Database,
  FileCheck2,
  KeyRound,
  Layers3,
  MailCheck,
  Server,
  ShieldCheck,
  Upload,
  UsersRound,
  Webhook,
  Workflow,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import styles from "./bouncezip.module.css";

const verificationModes = [
  {
    id: "realtime",
    label: "Real-time",
    code: "01",
    icon: MailCheck,
    title: "Know before the form submits.",
    description:
      "Syntax, DNS, MX, SMTP, mailbox, disposable-provider, and role-address signals combine into a clear verdict and quality score.",
    email: "olivia@startup.io",
    verdict: "Valid",
    score: 98,
    tone: "green",
    signals: ["MX records found", "Mailbox accepted", "Personal address"],
  },
  {
    id: "bulk",
    label: "Bulk lists",
    code: "02",
    icon: Upload,
    title: "Clean up to 500,000 rows per file.",
    description:
      "CSV and Excel uploads support automatic email-column detection, queued processing, progress visibility, filtering, pause and resume, and categorized exports.",
    email: "growth-list.csv",
    verdict: "Processing",
    score: 74,
    tone: "blue",
    signals: ["Column auto-detected", "12,003 rows queued", "Export ready"],
  },
  {
    id: "catchall",
    label: "Catch-all",
    code: "03",
    icon: ShieldCheck,
    title: "Resolve what other tools call risky.",
    description:
      "Provider behavior, greylisting, accept-all responses, and deeper mailbox signals produce a send, caution, or skip recommendation.",
    email: "team@catchall-co.com",
    verdict: "Send with caution",
    score: 71,
    tone: "amber",
    signals: ["Accept-all detected", "Greylisting handled", "Mailbox likely active"],
  },
  {
    id: "api",
    label: "Developer API",
    code: "04",
    icon: Code2,
    title: "Put verification inside any workflow.",
    description:
      "Authenticated real-time, catch-all, bulk-upload, status, download, stop, and credits endpoints return structured responses with configurable timeouts.",
    email: "GET /v1/verify",
    verdict: "200 OK",
    score: 100,
    tone: "purple",
    signals: ["JSON response", "Rate-limit tiers", "Webhook delivery"],
  },
] as const;

const gallery = [
  {
    src: "/projects/bouncezip/home.webp",
    alt: "BounceZip live homepage with a real-time email verification console",
    eyebrow: "Product entry",
    title: "Verification value is visible immediately",
    description:
      "The live homepage pairs a direct email check with an animated verification console and clear valid, catch-all, and invalid outcomes.",
  },
  {
    src: "/projects/bouncezip/features.webp",
    alt: "BounceZip live features page showing real-time and bulk verification",
    eyebrow: "Verification workflows",
    title: "Single checks and large lists share one system",
    description:
      "Product education moves from instant checks to bulk processing, scoring, disposable filtering, and integration-ready output.",
  },
  {
    src: "/projects/bouncezip/catchall.webp",
    alt: "BounceZip live catch-all verifier with deliverability recommendation",
    eyebrow: "Catch-all intelligence",
    title: "A deeper verdict instead of a generic risk flag",
    description:
      "The dedicated workflow explains accept-all behavior, greylisting, mailbox likelihood, provider context, and a practical sending recommendation.",
  },
  {
    src: "/projects/bouncezip/api.webp",
    alt: "BounceZip live verification API page with JSON response example",
    eyebrow: "Developer experience",
    title: "Verification can run inside customer applications",
    description:
      "The API story makes endpoints, authentication, response contracts, timeouts, and language examples easy to understand and adopt.",
  },
] as const;

const operationalSurfaces = [
  {
    icon: FileCheck2,
    title: "Customer verification workspace",
    description:
      "Single and bulk checks, catch-all runs, filterable results, downloadable reports, progress controls, and full verification history.",
    stat: "500K",
    label: "Rows per file",
    tone: "blue",
  },
  {
    icon: KeyRound,
    title: "API key and usage control",
    description:
      "Customer keys, scopes, usage exports, rate tiers, webhook destinations, access logs, and platform-wide endpoint status.",
    stat: "7",
    label: "Public endpoints",
    tone: "purple",
  },
  {
    icon: CreditCard,
    title: "Credits and billing",
    description:
      "Credit packages, custom packs, coupons, Stripe checkout, invoices, refunds, billing profiles, and an auditable credit ledger.",
    stat: "PAYG",
    label: "Credits never expire",
    tone: "green",
  },
  {
    icon: UsersRound,
    title: "Team and support workflows",
    description:
      "Workspace invitations, permission-aware teammates, notifications, support tickets, threaded replies, exports, and unified admin mail.",
    stat: "RBAC",
    label: "Shared workspace",
    tone: "amber",
  },
  {
    icon: Activity,
    title: "Administrative control plane",
    description:
      "Users, jobs, transactions, packages, verification costs, API operations, content, support, email, and infrastructure settings.",
    stat: "33",
    label: "Domain models",
    tone: "red",
  },
  {
    icon: Webhook,
    title: "Asynchronous delivery",
    description:
      "Celery workers process verification runs and outbound webhooks while Redis and scheduled jobs keep long-running work resilient.",
    stat: "ASYNC",
    label: "Worker-backed",
    tone: "cyan",
  },
] as const;

const architecture = [
  {
    number: "01",
    icon: Layers3,
    label: "Experience",
    title: "Next.js product surfaces",
    description:
      "Public marketing, authentication, customer dashboard, admin workspace, API documentation, and responsive product routes.",
    stack: ["Next.js 15", "React 18", "TypeScript"],
    tone: "blue",
  },
  {
    number: "02",
    icon: Server,
    label: "Application",
    title: "Django service platform",
    description:
      "Authentication, customer and admin APIs, verification orchestration, billing, support, content, permissions, and audit records.",
    stack: ["Django 5", "DRF", "SimpleJWT"],
    tone: "purple",
  },
  {
    number: "03",
    icon: Database,
    label: "Data and queue",
    title: "Durable processing layer",
    description:
      "PostgreSQL preserves commercial and verification state while Redis, Celery, and Celery Beat execute background workloads.",
    stack: ["PostgreSQL 17", "Redis 7", "Celery"],
    tone: "green",
  },
  {
    number: "04",
    icon: Workflow,
    label: "Commerce and delivery",
    title: "Production integrations",
    description:
      "Stripe payments, SMTP delivery, Google authentication, webhooks, invoices, exports, and containerized deployment boundaries.",
    stack: ["Stripe", "Docker", "Nginx"],
    tone: "amber",
  },
] as const;

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function BounceZipExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [activeMode, setActiveMode] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const selectedMode = verificationModes[activeMode];
  const SelectedModeIcon = selectedMode.icon;

  useEffect(() => {
    if (reduceMotion || !autoAdvance) return;
    const timer = window.setInterval(() => {
      setActiveMode((current) => (current + 1) % verificationModes.length);
    }, 3300);
    return () => window.clearInterval(timer);
  }, [autoAdvance, reduceMotion]);

  const selectMode = (index: number) => {
    setActiveMode(index);
    setAutoAdvance(false);
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>
          <div className={styles.headerStatus} aria-label="Project status">
            <span><i />Live verification</span>
            <b>99%+ accuracy</b>
          </div>
          <Link className={styles.backLink} href="/#projects">
            <ArrowLeft size={16} />Back to projects
          </Link>
        </div>
      </header>

      <main>
        <section className={`${styles.hero} ${styles.shell}`}>
          <motion.div
            className={styles.heroCopy}
            initial={reduceMotion ? false : { opacity: 0, x: -34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.eyebrow}><span />Full-stack SaaS case study</p>
            <h1>BounceZip</h1>
            <p className={styles.heroLead}>Email Verification Platform</p>
            <p className={styles.heroSummary}>
              A production verification system that cleans individual addresses and large lists,
              resolves catch-all uncertainty, and brings the same intelligence into customer applications through a structured API.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="https://bouncezip.com" target="_blank" rel="noreferrer">
                Visit Live Product <ArrowUpRight size={16} />
              </a>
              <a className={styles.secondaryAction} href="#verification-engine">
                Explore the engine <ArrowUpRight size={15} />
              </a>
            </div>
            <div className={styles.heroFacts} aria-label="BounceZip product facts">
              <div><span>Accuracy</span><strong>99%+ verification</strong></div>
              <div><span>Bulk</span><strong>500K rows per file</strong></div>
              <div><span>API</span><strong>7 public endpoints</strong></div>
              <div><span>State</span><strong>Live production</strong></div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.signalOrbit} aria-hidden="true">
              <span className={styles.signalGreen}>Valid</span>
              <span className={styles.signalAmber}>Catch-all</span>
              <span className={styles.signalRed}>Invalid</span>
            </div>
            <div className={styles.browserFrame}>
              <div className={styles.browserBar}>
                <span><i /><i /><i /></span><b>bouncezip.com</b><em>Live</em>
              </div>
              <div className={styles.browserViewport}>
                <Image
                  src="/projects/bouncezip/home.webp"
                  alt="BounceZip live homepage with a real-time email verification console"
                  fill
                  sizes="(max-width: 1050px) 90vw, 54vw"
                  priority
                />
              </div>
            </div>
            <motion.div
              className={styles.resultBadge}
              animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <MailCheck size={18} />
              <span><small>Verification complete</small><strong>Safe to send · 98/100</strong></span>
              <i />
            </motion.div>
          </motion.div>
        </section>

        <div className={styles.statusRail} aria-label="Verification signals">
          <div className={styles.statusRailTrack}>
            {["Syntax", "DNS", "MX records", "SMTP", "Mailbox", "Catch-all", "Disposable", "Role address", "Quality score", "Syntax", "DNS", "MX records", "SMTP", "Mailbox", "Catch-all", "Disposable", "Role address", "Quality score"].map((signal, index) => (
              <span key={`${signal}-${index}`}><i />{signal}</span>
            ))}
          </div>
        </div>

        <section className={`${styles.overview} ${styles.shell}`}>
          <Reveal className={styles.sectionLead}>
            <p className={styles.sectionLabel}>The product brief</p>
            <h2>Protect reputation<br />before every send.</h2>
          </Reveal>
          <Reveal className={styles.overviewCopy} delay={0.08}>
            <p>
              BounceZip connects product education, live checking, bulk workflows, API access, customer credits,
              billing, team collaboration, support, and platform administration. The central design problem was making
              deep verification intelligence understandable to marketers while keeping it programmable for engineers.
            </p>
            <div className={styles.overviewSignals}>
              <span><Check size={13} />Real-time verdicts</span>
              <span><Check size={13} />Deeper catch-all probing</span>
              <span><Check size={13} />Credits never expire</span>
            </div>
          </Reveal>
        </section>

        <section className={styles.engineBand} id="verification-engine">
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionLabel}>Verification engine</p>
                <h2>One intelligence layer.<br />Four ways to use it.</h2>
              </div>
              <p>
                Switch between the product&apos;s primary verification workflows to see how the same core signals serve marketers, operations teams, and developers.
              </p>
            </Reveal>

            <div className={styles.engineExperience}>
              <div className={styles.modeTabs} role="tablist" aria-label="BounceZip verification modes">
                {verificationModes.map((mode, index) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      className={index === activeMode ? styles.activeMode : ""}
                      type="button"
                      role="tab"
                      aria-selected={index === activeMode}
                      aria-controls="bouncezip-mode-panel"
                      key={mode.id}
                      onClick={() => selectMode(index)}
                    >
                      <span><Icon size={18} /></span>
                      <strong>{mode.label}</strong>
                      <small>{mode.code}</small>
                    </button>
                  );
                })}
              </div>

              <div className={styles.enginePanel} id="bouncezip-mode-panel" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    className={styles.modeCopy}
                    key={selectedMode.id}
                    initial={reduceMotion ? false : { y: 12 }}
                    animate={{ y: 0 }}
                    exit={{ y: -8 }}
                    transition={{ duration: 0.32 }}
                  >
                    <p className={styles.modeKicker}>{selectedMode.label} verification</p>
                    <h3>{selectedMode.title}</h3>
                    <p>{selectedMode.description}</p>
                    <div className={styles.modeSignals}>
                      {selectedMode.signals.map((signal) => <span key={signal}><Check size={12} />{signal}</span>)}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    className={`${styles.verdictConsole} ${styles[selectedMode.tone]}`}
                    key={`${selectedMode.id}-console`}
                    initial={reduceMotion ? false : { scale: 0.985 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.985 }}
                    transition={{ duration: 0.32 }}
                  >
                    <div className={styles.consoleTop}>
                      <span><SelectedModeIcon size={18} /></span>
                      <div><small>Active check</small><strong>{selectedMode.email}</strong></div>
                      <i>Live</i>
                    </div>
                    <div className={styles.scoreRing} style={{ "--score": selectedMode.score } as CSSProperties}>
                      <span><strong>{selectedMode.score}</strong><small>Quality score</small></span>
                    </div>
                    <div className={styles.verdictResult}>
                      <small>Final verdict</small><strong>{selectedMode.verdict}</strong>
                    </div>
                    <div className={styles.consoleChecks}>
                      <span><i />Input accepted</span><span><i />Signals analyzed</span><span><i />Result ready</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.gallerySection} ${styles.shell}`}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Live product surfaces</p>
              <h2>From first check<br />to API integration.</h2>
            </div>
            <p>Authentic production screens show how one visual language carries the product from marketing to technical adoption.</p>
          </Reveal>
          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <Reveal className={styles.galleryItem} key={item.src} delay={index * 0.05}>
                <div className={styles.galleryMedia}>
                  <Image src={item.src} alt={item.alt} fill sizes={index === 0 ? "90vw" : "44vw"} />
                  <span>0{index + 1}</span>
                </div>
                <div className={styles.galleryCopy}>
                  <small>{item.eyebrow}</small><h3>{item.title}</h3><p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.operationsBand}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionLabel}>Beyond the landing page</p>
                <h2>A complete SaaS<br />operating system.</h2>
              </div>
              <p>Customer and staff surfaces manage the commercial, collaborative, and operational work behind every verification.</p>
            </Reveal>
            <div className={styles.operationsGrid}>
              {operationalSurfaces.map((surface, index) => {
                const Icon = surface.icon;
                return (
                  <Reveal className={`${styles.operationCard} ${styles[surface.tone]}`} key={surface.title} delay={index * 0.045}>
                    <div className={styles.operationMetric}><span><Icon size={20} /></span><div><strong>{surface.stat}</strong><small>{surface.label}</small></div></div>
                    <h3>{surface.title}</h3><p>{surface.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.architectureSection} ${styles.shell}`}>
          <Reveal className={styles.sectionLead}>
            <p className={styles.sectionLabel}>System architecture</p>
            <h2>Fast at the edge.<br />Durable underneath.</h2>
          </Reveal>
          <div className={styles.architectureGrid}>
            {architecture.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <Reveal className={`${styles.architectureCard} ${styles[layer.tone]}`} key={layer.number} delay={index * 0.05}>
                  <div className={styles.architectureTop}><span><Icon size={19} /></span><small>{layer.number}</small></div>
                  <p>{layer.label}</p><h3>{layer.title}</h3><strong>{layer.description}</strong>
                  <div className={styles.stackList}>{layer.stack.map((item) => <span key={item}>{item}</span>)}</div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal className={`${styles.cta} ${styles.shell}`}>
          <span className={styles.ctaIcon}><Zap size={24} /></span>
          <div>
            <p className={styles.sectionLabel}>Live email verification platform</p>
            <h2>See BounceZip in production.</h2>
            <p>Explore real-time checks, catch-all intelligence, bulk verification, pricing, and the public API experience.</p>
          </div>
          <div className={styles.ctaActions}>
            <a className={styles.primaryAction} href="https://bouncezip.com" target="_blank" rel="noreferrer">
              Visit Live Product <ArrowUpRight size={16} />
            </a>
            <Link className={styles.secondaryAction} href="/#contact">Discuss a project</Link>
          </div>
        </Reveal>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <p>BounceZip email verification platform case study</p>
          <Link href="/#projects">More projects <ArrowUpRight size={13} /></Link>
        </div>
      </footer>
    </div>
  );
}
