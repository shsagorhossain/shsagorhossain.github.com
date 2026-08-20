"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Boxes,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Code2,
  Database,
  Fingerprint,
  GitBranch,
  KeyRound,
  LockKeyhole,
  MessageCircleMore,
  Network,
  PackageCheck,
  Radio,
  ReceiptText,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Workflow,
  Zap,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import styles from "./msl-lab.module.css";

const productSurfaces = [
  {
    id: "access",
    icon: Fingerprint,
    label: "Access portal",
    kicker: "Private entry point",
    title: "Staff identity is the first product boundary.",
    description:
      "The live product opens through a dedicated sign-in surface and central authentication flow. Admin and staff roles enter a workspace shaped by their assigned permissions.",
    image: "/projects/msl-lab/login.webp",
    alt: "MSL Lab private staff login portal",
    signal: "Central auth",
  },
  {
    id: "buildflow",
    icon: GitBranch,
    label: "BuildFlow",
    kicker: "Delivery control plane",
    title: "Applications, repositories, and environments stay connected.",
    description:
      "BuildFlow gives staff a verified registry for product delivery, linking applications to source repositories, customer context, environments, status, and deployment operations.",
    image: "/projects/msl-lab/buildflow.webp",
    alt: "MSL Lab BuildFlow staff workspace with sanitized data",
    signal: "Delivery ready",
  },
  {
    id: "registry",
    icon: Boxes,
    label: "Product registry",
    kicker: "Commercial operations",
    title: "Every application has an operational record.",
    description:
      "Staff manage application metadata, categories, pricing, features, screenshots, documentation, release policy, linked services, analytics, and production state from one catalog.",
    image: "/projects/msl-lab/applications.webp",
    alt: "MSL Lab application registry with sanitized product data",
    signal: "Catalog synchronized",
  },
] as const;

const capabilities = [
  {
    icon: ReceiptText,
    title: "Commerce operations",
    description: "Orders, subscriptions, invoices, instant payments, coupons, renewals, and delivery state.",
    signal: "Revenue connected",
    tone: "yellow",
  },
  {
    icon: ServerCog,
    title: "Infrastructure control",
    description: "Servers, domains, DNS, billing, runtime workspaces, health signals, and access operations.",
    signal: "Systems observable",
    tone: "cyan",
  },
  {
    icon: PackageCheck,
    title: "Product delivery",
    description: "Applications, versions, pricing, repositories, environments, release policies, and deployments.",
    signal: "Release traceable",
    tone: "purple",
  },
  {
    icon: MessageCircleMore,
    title: "CRM and channels",
    description: "Contacts, follow-ups, email and SMS campaigns, inboxes, and WhatsApp Business workflows.",
    signal: "Context retained",
    tone: "green",
  },
  {
    icon: CalendarDays,
    title: "Team execution",
    description: "Tasks, review stages, calendars, Team Space, notifications, voice notes, and activity history.",
    signal: "Work coordinated",
    tone: "blue",
  },
  {
    icon: Bot,
    title: "AI and automation",
    description: "Lina AI, code intelligence, background workers, scheduled jobs, and approval-aware actions.",
    signal: "Human governed",
    tone: "pink",
  },
] as const;

const operatingFlow = [
  {
    icon: UsersRound,
    label: "Identity",
    title: "Verified staff enters",
    description: "Central authentication establishes the account, product access, and assigned role context.",
  },
  {
    icon: KeyRound,
    label: "Permission",
    title: "Action is evaluated",
    description: "Route guards and API permissions check the requested function and method before data moves.",
  },
  {
    icon: Workflow,
    label: "Workflow",
    title: "Domain rules execute",
    description: "Orders, products, infrastructure, communication, or delivery logic runs in its owned workflow.",
  },
  {
    icon: Radio,
    label: "Realtime",
    title: "Teams stay synchronized",
    description: "Channels, Redis, workers, notifications, and activity streams keep long-running work visible.",
  },
  {
    icon: CheckCircle2,
    label: "Outcome",
    title: "A traceable result remains",
    description: "Statuses, logs, histories, and operational records preserve what happened and what comes next.",
  },
] as const;

const architecture = [
  {
    number: "01",
    icon: Code2,
    label: "Staff experience",
    title: "React operations console",
    description: "A Vite and TypeScript application composed around dense, permission-aware staff workflows.",
    stack: ["React 18", "TypeScript", "Vite 7", "Tailwind 4"],
    tone: "green",
  },
  {
    number: "02",
    icon: ShieldCheck,
    label: "API and identity",
    title: "Django service layer",
    description: "Django REST Framework coordinates domain APIs, central JWT identity, and method-level access rules.",
    stack: ["Django 5.2", "DRF 3.16", "JWT", "Central Auth"],
    tone: "cyan",
  },
  {
    number: "03",
    icon: Zap,
    label: "Realtime automation",
    title: "Event-driven operations",
    description: "Realtime channels and background execution keep notifications, campaigns, tasks, and delivery jobs moving.",
    stack: ["Channels", "Celery", "Redis", "Daphne"],
    tone: "yellow",
  },
  {
    number: "04",
    icon: Database,
    label: "Data and intelligence",
    title: "Operational memory",
    description: "Relational data and vector-backed intelligence support auditable records, retrieval, and AI-assisted work.",
    stack: ["PostgreSQL", "pgvector", "LangGraph", "Docker"],
    tone: "purple",
  },
] as const;

const accessLayers = [
  ["Identity", "Central account and product access"],
  ["Role", "Admin or assigned staff responsibility"],
  ["Function", "Named workflow permission"],
  ["Method", "Read, create, update, or control action"],
  ["Record", "Status, history, and operational audit"],
] as const;

const engineeringPrinciples = [
  "One protected workspace for staff-facing business and technical operations",
  "Permission checks shared across route and API boundaries",
  "Long-running work surfaced through realtime state and background execution",
  "Product delivery connected to repositories, infrastructure, billing, and customers",
  "Sensitive operational data kept behind authenticated staff access",
] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MslLabExperience() {
  const reduceMotion = useReducedMotion();
  const flowRef = useRef<HTMLElement>(null);
  const flowInView = useInView(flowRef, { margin: "-18% 0px -18% 0px" });
  const [activeSurface, setActiveSurface] = useState(1);
  const [activeFlow, setActiveFlow] = useState(0);
  const [pauseFlow, setPauseFlow] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRotateX = useMotionValue(0);
  const heroRotateY = useMotionValue(0);
  const smoothRotateX = useSpring(heroRotateX, { stiffness: 150, damping: 22 });
  const smoothRotateY = useSpring(heroRotateY, { stiffness: 150, damping: 22 });
  const activeSurfaceData = productSurfaces[activeSurface];

  useEffect(() => {
    if (reduceMotion || !flowInView || pauseFlow) return;
    const timer = window.setInterval(() => {
      setActiveFlow((current) => (current + 1) % operatingFlow.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [flowInView, pauseFlow, reduceMotion]);

  const handleHeroPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRotateX.set(y * -4);
    heroRotateY.set(x * 5);
  };

  const resetHeroPointer = () => {
    heroRotateX.set(0);
    heroRotateY.set(0);
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>
          <div className={styles.headerStatus} aria-label="Project access status">
            <span><i /> Private production</span>
            <b>Admin + Staff</b>
          </div>
          <Link className={styles.backLink} href="/#projects">
            <ArrowLeft size={15} /> Back to projects
          </Link>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={[styles.shell, styles.heroGrid].join(" ")}>
            <div className={styles.heroCopy}>
              <motion.div
                className={styles.eyebrow}
                initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55 }}
              >
                <span /> Private staff operations platform
              </motion.div>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.08 }}
              >
                MSL Lab
              </motion.h1>
              <motion.p
                className={styles.heroLead}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.16 }}
              >
                The private operating system behind product delivery, infrastructure, communication, and staff execution.
              </motion.p>
              <motion.p
                className={styles.heroSummary}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.65, delay: 0.24 }}
              >
                Built for internal admin and staff teams, MSL Lab connects commercial operations with technical delivery in one permission-aware control plane.
              </motion.p>

              <motion.div
                className={styles.heroActions}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a className={styles.primaryAction} href="https://lab.mohuls.com/login" target="_blank" rel="noreferrer">
                  Visit Live Product <ArrowUpRight size={17} />
                </a>
                <a className={styles.secondaryAction} href="#platform">
                  Explore the system <span aria-hidden="true">↓</span>
                </a>
              </motion.div>

              <motion.div
                className={styles.heroFacts}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
              >
                {[
                  ["Access", "Private"],
                  ["Users", "Admin + Staff"],
                  ["State", "Live production"],
                  ["Delivery", "REST + realtime"],
                ].map(([label, value]) => (
                  <div key={label}><span>{label}</span><strong>{value}</strong></div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className={styles.heroVisual}
              initial={reduceMotion ? false : { opacity: 0, x: 34, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.82, delay: 0.16, ease: "easeOut" }}
              onPointerMove={handleHeroPointer}
              onPointerLeave={resetHeroPointer}
              style={reduceMotion ? undefined : { rotateX: smoothRotateX, rotateY: smoothRotateY }}
            >
              <div className={styles.browserFrame}>
                <div className={styles.browserBar} aria-hidden="true">
                  <span /><span /><span />
                  <b>lab.mohuls.com / admin / build-flow</b>
                  <i><LockKeyhole size={12} /> Staff only</i>
                </div>
                <div className={styles.heroImage}>
                  <Image
                    src="/projects/msl-lab/buildflow.webp"
                    alt="MSL Lab BuildFlow staff workspace with sanitized data"
                    fill
                    priority
                    sizes="(max-width: 1050px) 90vw, 54vw"
                  />
                  <span className={styles.privacyNote}><ShieldCheck size={13} /> Operational data sanitized</span>
                </div>
              </div>

              <motion.div
                className={styles.accessCard}
                animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div><Fingerprint size={18} /><span>Access policy</span></div>
                <strong>Function + method</strong>
                <p>Every protected workflow evaluates role and action.</p>
                <span className={styles.accessSignal}><i /> Authorized surface</span>
              </motion.div>

              <div className={styles.heroTelemetry} aria-hidden="true">
                <span><i /> API online</span>
                <span><i /> Realtime active</span>
                <span><i /> Workers ready</span>
              </div>
            </motion.div>
          </div>
          <div className={styles.heroRail} aria-hidden="true">
            <span>IDENTITY</span><i /><span>OPERATIONS</span><i /><span>DELIVERY</span><i /><span>INTELLIGENCE</span>
          </div>
        </section>

        <section className={[styles.overview, styles.shell].join(" ")} id="platform">
          <Reveal className={styles.sectionLead}>
            <div className={styles.sectionLabel}>Platform readout</div>
            <h2>One control plane.<br />Many operational worlds.</h2>
          </Reveal>
          <Reveal className={styles.overviewCopy} delay={0.08}>
            <p>
              MSL Lab brings customer operations, product delivery, infrastructure, communications, billing, and team execution into a shared internal workspace. It is intentionally not public-facing: authenticated staff see only the functions their responsibilities require.
            </p>
            <div className={styles.overviewSignals}>
              <span><CircleDot size={14} /> Production platform</span>
              <span><Network size={14} /> Connected domains</span>
              <span><ShieldCheck size={14} /> Permission governed</span>
            </div>
          </Reveal>
        </section>

        <section className={styles.surfaceBand}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <div className={styles.sectionLabel}>Live product surfaces</div>
                <h2>A workspace designed for repeat operational use.</h2>
              </div>
              <p>Real production interfaces are shown with customer, staff, repository, and operational data replaced for privacy.</p>
            </Reveal>

            <Reveal className={styles.surfaceExperience} delay={0.08}>
              <div className={styles.surfaceTabs} role="tablist" aria-label="MSL Lab product surfaces">
                {productSurfaces.map((surface, index) => {
                  const Icon = surface.icon;
                  return (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeSurface === index}
                      aria-controls="msl-surface-panel"
                      className={activeSurface === index ? styles.activeSurfaceTab : ""}
                      onClick={() => setActiveSurface(index)}
                      key={surface.id}
                    >
                      <span><Icon size={18} /></span>
                      <strong>{surface.label}</strong>
                      <i>{String(index + 1).padStart(2, "0")}</i>
                    </button>
                  );
                })}
              </div>

              <div className={styles.surfacePanel} id="msl-surface-panel" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    className={styles.surfaceMedia}
                    key={activeSurfaceData.id}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18, scale: 0.985 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16, scale: 0.99 }}
                    transition={{ duration: 0.34 }}
                  >
                    <div className={styles.surfaceBrowserBar} aria-hidden="true"><span /><span /><span /><b>Secure staff workspace</b></div>
                    <div className={styles.surfaceImage}>
                      <Image src={activeSurfaceData.image} alt={activeSurfaceData.alt} fill sizes="(max-width: 900px) 90vw, 58vw" />
                    </div>
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.div
                    className={styles.surfaceCopy}
                    key={`${activeSurfaceData.id}-copy`}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={styles.surfaceKicker}>{activeSurfaceData.kicker}</span>
                    <h3>{activeSurfaceData.title}</h3>
                    <p>{activeSurfaceData.description}</p>
                    <div className={styles.surfaceSignal}><i /> {activeSurfaceData.signal}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={[styles.capabilitiesSection, styles.shell].join(" ")}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <div className={styles.sectionLabel}>Operational scope</div>
              <h2>Business and engineering move together.</h2>
            </div>
            <p>Each domain owns focused workflows while sharing identity, permissions, notifications, and operational context.</p>
          </Reveal>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Reveal className={`${styles.capabilityCard} ${styles[capability.tone]}`} delay={index * 0.055} key={capability.title}>
                  <div className={styles.capabilityTop}><span><Icon size={20} /></span><b>{String(index + 1).padStart(2, "0")}</b></div>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <div className={styles.capabilitySignal}><i /> {capability.signal}</div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section
          className={styles.flowBand}
          ref={flowRef}
          onMouseEnter={() => setPauseFlow(true)}
          onMouseLeave={() => setPauseFlow(false)}
        >
          <div className={styles.shell}>
            <Reveal className={styles.flowHeading}>
              <div className={styles.sectionLabel}>Permission-aware execution</div>
              <h2>From intent to auditable outcome.</h2>
              <p>Hover or select any stage to hold the live system trace.</p>
            </Reveal>
            <div className={styles.flowTrack} role="tablist" aria-label="MSL Lab operating flow">
              {operatingFlow.map((step, index) => {
                const Icon = step.icon;
                const active = activeFlow === index;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={active ? styles.activeFlow : ""}
                    onClick={() => setActiveFlow(index)}
                    key={step.label}
                  >
                    <span><Icon size={20} /></span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <strong>{step.label}</strong>
                    {index < operatingFlow.length - 1 && <i className={styles.flowConnector} />}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                className={styles.flowReadout}
                key={operatingFlow[activeFlow].label}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span>TRACE / {String(activeFlow + 1).padStart(2, "0")}</span>
                <h3>{operatingFlow[activeFlow].title}</h3>
                <p>{operatingFlow[activeFlow].description}</p>
                <b><i /> System state synchronized</b>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section className={[styles.architectureSection, styles.shell].join(" ")}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <div className={styles.sectionLabel}>System architecture</div>
              <h2>Four layers, one operational memory.</h2>
            </div>
            <p>The stack combines a dense staff console, protected domain APIs, realtime automation, and data-backed intelligence.</p>
          </Reveal>
          <div className={styles.architectureGrid}>
            {architecture.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <Reveal className={`${styles.architectureCard} ${styles[layer.tone]}`} delay={index * 0.07} key={layer.title}>
                  <div className={styles.architectureTop}><b>{layer.number}</b><span><Icon size={22} /></span></div>
                  <small>{layer.label}</small>
                  <h3>{layer.title}</h3>
                  <p>{layer.description}</p>
                  <div className={styles.stackList}>{layer.stack.map((item) => <span key={item}>{item}</span>)}</div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className={styles.securityBand}>
          <div className={[styles.shell, styles.securityGrid].join(" ")}>
            <Reveal className={styles.securityCopy}>
              <div className={styles.sectionLabel}>Private by design</div>
              <h2>Internal software earns trust through boundaries.</h2>
              <p>
                MSL Lab is an admin and staff product. The public portfolio can show the engineering system, but the live workspace protects the operational records inside it.
              </p>
              <div className={styles.principles}>
                {engineeringPrinciples.map((principle) => <span key={principle}><Check size={15} />{principle}</span>)}
              </div>
            </Reveal>
            <Reveal className={styles.accessMatrix} delay={0.1}>
              <div className={styles.matrixHead}><LockKeyhole size={19} /><span>Access decision</span><b>ENFORCED</b></div>
              {accessLayers.map(([label, value], index) => (
                <div className={styles.matrixRow} key={label}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{label}</strong>
                  <span>{value}</span>
                  <i><Check size={12} /></i>
                </div>
              ))}
              <div className={styles.matrixFoot}><Radio size={14} /> Route, API, and record state aligned</div>
            </Reveal>
          </div>
        </section>

        <section className={[styles.cta, styles.shell].join(" ")}>
          <div className={styles.ctaIcon}><Sparkles size={25} /></div>
          <div>
            <div className={styles.sectionLabel}>Live staff product</div>
            <h2>Open the real entry point.</h2>
            <p>The live link opens MSL Lab&apos;s login page. Workspace access remains restricted to approved admin and staff accounts.</p>
          </div>
          <div className={styles.ctaActions}>
            <a className={styles.primaryAction} href="https://lab.mohuls.com/login" target="_blank" rel="noreferrer">
              Visit Live Product <ArrowUpRight size={17} />
            </a>
            <Link className={styles.secondaryAction} href="/#contact">Discuss a private platform</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <p>MSL Lab case study by Sagor Hossain.</p>
          <Link href="/#projects">More projects</Link>
        </div>
      </footer>
    </div>
  );
}
