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
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Check,
  CircleDollarSign,
  Database,
  FileDown,
  Gauge,
  Layers3,
  ListFilter,
  LockKeyhole,
  PiggyBank,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  WalletCards,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import styles from "./cost-manager.module.css";

const workspaces = [
  {
    icon: Gauge,
    number: "01",
    label: "Overview",
    title: "See the month before making the next decision.",
    description:
      "Balance, income, expenses, net position, budget progress, category share, and recent activity meet in one scan-friendly desktop dashboard.",
    image: "/projects/cost-manager/dashboard.webp",
    alt: "Personal Cost Management overview dashboard",
    bullets: ["Monthly financial summary", "Category spending distribution", "Budget progress and recent activity"],
    tone: "blue",
  },
  {
    icon: ReceiptText,
    number: "02",
    label: "Transactions",
    title: "Every entry remains easy to find and understand.",
    description:
      "A structured ledger keeps dates, descriptions, categories, accounts, and amounts together, with focused search and filtering for routine review.",
    image: "/projects/cost-manager/transactions.webp",
    alt: "Personal Cost Management transaction ledger",
    bullets: ["Income and expense separation", "Date, category, and account context", "Focused record inspection and editing"],
    tone: "green",
  },
  {
    icon: BarChart3,
    number: "03",
    label: "Reports",
    title: "Turn stored records into useful financial patterns.",
    description:
      "Reporting views translate transaction history into income-versus-expense movement, category distribution, cash flow, and savings awareness.",
    image: "/projects/cost-manager/reports.webp",
    alt: "Personal Cost Management reports and insights workspace",
    bullets: ["Monthly and yearly comparisons", "Cash-flow and savings visibility", "Report-ready financial summaries"],
    tone: "purple",
  },
] as const;

const flowSignals = [
  { icon: ReceiptText, title: "Record", detail: "Income or expense captured", tone: "blue" },
  { icon: Tags, title: "Classify", detail: "Category and account attached", tone: "yellow" },
  { icon: Database, title: "Store", detail: "Local ledger updated", tone: "green" },
  { icon: BarChart3, title: "Understand", detail: "Monthly view recalculated", tone: "purple" },
] as const;

const capabilities = [
  {
    icon: ListFilter,
    title: "Transaction ledger",
    description: "Structured income and expense records with dates, descriptions, amounts, accounts, and categories.",
    tone: "blue",
  },
  {
    icon: Tags,
    title: "Category system",
    description: "Consistent categories turn everyday entries into summaries that remain useful over time.",
    tone: "yellow",
  },
  {
    icon: PiggyBank,
    title: "Budget awareness",
    description: "Monthly limits and progress states make overspending visible before the month is over.",
    tone: "green",
  },
  {
    icon: BarChart3,
    title: "Financial reporting",
    description: "Income, expenses, cash flow, category distribution, and savings patterns share one reporting layer.",
    tone: "purple",
  },
  {
    icon: Search,
    title: "Focused retrieval",
    description: "Search and filter controls narrow a growing ledger without disrupting the review workflow.",
    tone: "cyan",
  },
  {
    icon: LockKeyhole,
    title: "Local-first data",
    description: "SQLite keeps personal records available on the desktop with a small, dependable footprint.",
    tone: "red",
  },
] as const;

const architecture = [
  {
    number: "01",
    icon: Layers3,
    label: "Presentation",
    title: "CustomTkinter interface",
    description:
      "A desktop-native window system organizes navigation, forms, summaries, filters, feedback states, and report views.",
    stack: ["CustomTkinter", "Tkinter", "Desktop UI"],
    tone: "blue",
  },
  {
    number: "02",
    icon: CircleDollarSign,
    label: "Application logic",
    title: "Python finance layer",
    description:
      "Validation, calculations, categorization, monthly aggregation, and report preparation remain outside the view layer.",
    stack: ["Python", "Validation", "Aggregation"],
    tone: "green",
  },
  {
    number: "03",
    icon: Database,
    label: "Persistence",
    title: "SQLite data store",
    description:
      "Relational records preserve transactions and supporting entities in a portable local database built for reliable queries.",
    stack: ["SQLite", "Relational data", "Local storage"],
    tone: "purple",
  },
] as const;

const principles = [
  "Financial calculations stay separate from interface rendering",
  "Validated inputs reach storage through one predictable path",
  "Categories and accounts remain consistent across entry and reporting",
  "Monthly summaries are calculated from the ledger instead of duplicated",
  "Local data keeps the application useful without a network dependency",
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
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.62, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function CostManagerExperience() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLElement>(null);
  const flowInView = useInView(flowRef, { margin: "-18% 0px -18% 0px" });
  const [activeWorkspace, setActiveWorkspace] = useState(0);
  const [activeSignal, setActiveSignal] = useState(0);
  const [pauseFlow, setPauseFlow] = useState(false);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 54]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 180, damping: 25 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 180, damping: 25 });

  useEffect(() => {
    if (!flowInView || pauseFlow || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % flowSignals.length);
    }, 2100);
    return () => window.clearInterval(timer);
  }, [flowInView, pauseFlow, reduceMotion]);

  const handleHeroPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltX.set(y * -3.5);
    tiltY.set(x * 3.5);
  };

  const resetHeroTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const selectedWorkspace = workspaces[activeWorkspace];
  const SelectedWorkspaceIcon = selectedWorkspace.icon;

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>
          <Link className={styles.backLink} href="/#projects">
            <ArrowLeft size={16} />
            Back to projects
          </Link>
        </div>
      </header>

      <main>
        <section className={[styles.hero, styles.shell].join(" ")} ref={heroRef}>
          <motion.div
            className={styles.eyebrow}
            initial={reduceMotion ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span />
            Desktop application case study
          </motion.div>

          <div className={styles.heroIntro}>
            <motion.div
              className={styles.heroTitle}
              initial={reduceMotion ? false : { opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.08, ease: "easeOut" }}
            >
              <h1>Personal Cost<br />Management</h1>
              <p>Clear money decisions, without spreadsheet friction.</p>
              <div className={styles.heroMeta} aria-label="Project qualities">
                <span><WalletCards size={12} />Desktop utility</span>
                <span>Local-first</span>
                <span>Finance reporting</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroSummary}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.2, ease: "easeOut" }}
            >
              <p>
                A focused Python desktop system for recording everyday income and expenses,
                organizing them into useful categories, watching monthly budgets, and turning a
                local ledger into understandable reports.
              </p>
              <motion.a
                className={styles.primaryAction}
                href="#product-workflow"
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.012 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Explore the workflow
                <ArrowDownRight size={17} />
              </motion.a>
            </motion.div>
          </div>

          <div className={styles.heroStage}>
            <motion.figure
              className={styles.heroMedia}
              onPointerMove={handleHeroPointer}
              onPointerLeave={resetHeroTilt}
              initial={reduceMotion ? false : { opacity: 0, y: 38, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.82, delay: 0.28, ease: "easeOut" }}
              style={reduceMotion ? undefined : { y: heroY, rotateX: smoothTiltX, rotateY: smoothTiltY }}
            >
              <div className={styles.windowBar} aria-hidden="true">
                <div><span /><span /><span /></div>
                <p>Personal Cost Manager / Overview</p>
                <strong><i />Local data</strong>
              </div>
              <Image
                src="/projects/cost-manager/dashboard.webp"
                alt="Personal Cost Management desktop dashboard"
                fill
                priority
                loading="eager"
                sizes="90vw"
              />
            </motion.figure>

            <motion.div
              className={styles.heroStatus}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.58, delay: 0.72 }}
            >
              <div className={styles.statusHead}>
                <span><ShieldCheck size={17} /></span>
                <div><small>Storage mode</small><strong>Local and available</strong></div>
                <i />
              </div>
              {[
                ["Interface", "CustomTkinter"],
                ["Application", "Python"],
                ["Persistence", "SQLite"],
              ].map(([label, value], index) => (
                <div className={styles.statusRow} key={label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{label}</p>
                  <strong><Check size={11} />{value}</strong>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className={styles.heroSignals}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.82 }}
          >
            <div><strong>03</strong><span>Focused product workspaces</span></div>
            <div><strong>01</strong><span>Reliable local data source</span></div>
            <div><strong>100%</strong><span>Desktop-first workflow</span></div>
          </motion.div>
        </section>

        <section className={[styles.overview, styles.shell].join(" ")}>
          <Reveal><div className={styles.sectionLabel}>Project overview</div></Reveal>
          <div className={styles.overviewGrid}>
            <Reveal className={styles.sectionLead}>
              <h2>A calm financial picture built from everyday records.</h2>
              <p>
                Personal finance tools become noisy when data entry, review, and reporting feel like
                separate jobs. This system keeps them connected: record once, classify clearly, and
                let the ledger drive the month&apos;s financial picture.
              </p>
            </Reveal>
            <motion.dl
              className={styles.projectFacts}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-12%" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
            >
              {[
                ["Product", "Personal finance desktop app"],
                ["Interface", "CustomTkinter"],
                ["Core", "Python application logic"],
                ["Storage", "SQLite local database"],
              ].map(([term, detail]) => (
                <motion.div
                  key={term}
                  variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                >
                  <dt>{term}</dt><dd>{detail}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        <section className={styles.workflowBand} id="product-workflow" ref={flowRef}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <div className={styles.sectionLabel}>Product workflow</div>
                <h2>Three views.<br />One financial story.</h2>
              </div>
              <CircleDollarSign size={35} aria-hidden="true" />
            </Reveal>

            <Reveal className={styles.workspaceExperience} delay={0.1}>
              <div className={styles.workspaceTabs} role="tablist" aria-label="Cost Manager workspaces">
                {workspaces.map((workspace, index) => {
                  const Icon = workspace.icon;
                  const active = activeWorkspace === index;
                  return (
                    <button
                      className={[styles.workspaceTab, active ? styles.workspaceTabActive : ""].join(" ")}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="cost-manager-workspace-panel"
                      onClick={() => setActiveWorkspace(index)}
                      key={workspace.label}
                    >
                      {active && <motion.i layoutId="cost-workspace-active" />}
                      <span className={[styles.workspaceTabIcon, styles[workspace.tone]].join(" ")}><Icon size={17} /></span>
                      <span><small>{workspace.number}</small><strong>{workspace.label}</strong></span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.workspacePanel} id="cost-manager-workspace-panel" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    className={styles.workspacePanelInner}
                    key={selectedWorkspace.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.32 }}
                  >
                    <figure className={styles.workspaceMedia}>
                      <div className={styles.windowBar} aria-hidden="true">
                        <div><span /><span /><span /></div>
                        <p>Cost Manager / {selectedWorkspace.label}</p>
                        <strong><i />Ready</strong>
                      </div>
                      <Image
                        src={selectedWorkspace.image}
                        alt={selectedWorkspace.alt}
                        fill
                        sizes="(max-width: 760px) 90vw, 62vw"
                      />
                    </figure>
                    <div className={styles.workspaceCopy}>
                      <span className={[styles.workspaceIcon, styles[selectedWorkspace.tone]].join(" ")}>
                        <SelectedWorkspaceIcon size={21} />
                      </span>
                      <small>{selectedWorkspace.number} / 03 · {selectedWorkspace.label}</small>
                      <h3>{selectedWorkspace.title}</h3>
                      <p>{selectedWorkspace.description}</p>
                      <ul>
                        {selectedWorkspace.bullets.map((bullet) => (
                          <li key={bullet}><Check size={13} />{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal className={styles.flowRail} delay={0.12}>
              <div
                className={styles.flowRailInner}
                onMouseEnter={() => setPauseFlow(true)}
                onMouseLeave={() => setPauseFlow(false)}
              >
                {flowSignals.map((signal, index) => {
                  const Icon = signal.icon;
                  const active = activeSignal === index;
                  return (
                    <button
                      className={[styles.flowSignal, active ? styles.flowSignalActive : "", styles[signal.tone]].join(" ")}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveSignal(index)}
                      key={signal.title}
                    >
                      <span><Icon size={16} /></span>
                      <div><strong>{signal.title}</strong><small>{signal.detail}</small></div>
                      <i>{String(index + 1).padStart(2, "0")}</i>
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        <section className={[styles.capabilitiesSection, styles.shell].join(" ")}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <div className={styles.sectionLabel}>Core capabilities</div>
              <h2>Everything needed to understand the month.</h2>
            </div>
            <WalletCards size={34} aria-hidden="true" />
          </Reveal>
          <div className={styles.capabilityGrid}>
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Reveal className={[styles.capabilityCard, styles[capability.tone]].join(" ")} delay={index * 0.045} key={capability.title}>
                  <div><span><Icon size={21} /></span><small>{String(index + 1).padStart(2, "0")}</small></div>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <i />
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className={styles.architectureBand}>
          <div className={styles.shell}>
            <Reveal className={styles.architectureIntro}>
              <div>
                <div className={styles.sectionLabel}>Application architecture</div>
                <h2>Small footprint.<br />Clear responsibilities.</h2>
              </div>
              <p>
                The desktop build stays maintainable by keeping interface concerns, finance rules,
                and persistence boundaries explicit.
              </p>
            </Reveal>

            <div className={styles.architectureGrid}>
              {architecture.map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <Reveal className={[styles.architectureCard, styles[layer.tone]].join(" ")} delay={index * 0.09} key={layer.title}>
                    <span className={styles.architectureNumber}>{layer.number}</span>
                    <span className={styles.architectureIcon}><Icon size={23} /></span>
                    <div>
                      <small>{layer.label}</small>
                      <h3>{layer.title}</h3>
                      <p>{layer.description}</p>
                      <div>{layer.stack.map((item) => <span key={item}>{item}</span>)}</div>
                    </div>
                    {index < architecture.length - 1 && <i className={styles.architectureConnector} />}
                  </Reveal>
                );
              })}
            </div>

            <Reveal className={styles.principles}>
              <div className={styles.principlesTitle}>
                <span><ShieldCheck size={20} /></span>
                <div><small>Engineering principles</small><strong>Simple, predictable, maintainable</strong></div>
              </div>
              <ul>{principles.map((principle) => <li key={principle}><Check size={13} />{principle}</li>)}</ul>
            </Reveal>
          </div>
        </section>

        <section className={styles.galleryBand}>
          <div className={styles.shell}>
            <Reveal className={styles.galleryHeading}>
              <div>
                <div className={styles.sectionLabel}>Interface gallery</div>
                <h2>The whole money workflow, at a glance.</h2>
              </div>
              <FileDown size={32} aria-hidden="true" />
            </Reveal>
            <div className={styles.galleryGrid}>
              {workspaces.map((workspace, index) => (
                <Reveal className={styles.galleryItem} delay={index * 0.08} key={workspace.label}>
                  <button type="button" onClick={() => {
                    setActiveWorkspace(index);
                    document.getElementById("product-workflow")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
                  }} aria-label={"Open " + workspace.label + " workspace"}>
                    <Image src={workspace.image} alt={workspace.alt + " preview"} fill sizes="(max-width: 760px) 90vw, 30vw" />
                    <span>{workspace.number}</span>
                    <i><ArrowUpRight size={15} /></i>
                  </button>
                  <div><h3>{workspace.label}</h3><p>{workspace.title}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={[styles.cta, styles.shell].join(" ")}>
          <div className={styles.ctaMark}><Sparkles size={26} /></div>
          <div>
            <div className={styles.sectionLabel}>Purpose-built desktop software</div>
            <h2>Clear tools for work that deserves more than a spreadsheet.</h2>
            <p>Let&apos;s design a focused desktop product around your real operational workflow.</p>
          </div>
          <a href="mailto:shsagor.11s@gmail.com">Discuss a desktop project<ArrowUpRight size={16} /></a>
          <div className={styles.ctaLines} aria-hidden="true"><span /><span /><span /></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <div><CalendarRange size={13} /><span>Case study · Personal Cost Management</span></div>
          <Link href="/projects/">All projects</Link>
        </div>
      </footer>
    </div>
  );
}
