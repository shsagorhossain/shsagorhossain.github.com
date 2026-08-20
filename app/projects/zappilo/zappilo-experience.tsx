"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  CircleDot,
  Database,
  GitBranch,
  Inbox,
  Layers3,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Send,
  Sparkles,
  UsersRound,
  Workflow,
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
import styles from "./zappilo.module.css";

const capabilities = [
  {
    icon: Inbox,
    title: "Shared WhatsApp Inbox",
    description:
      "Live conversations, files, internal notes, assignment workflows, contact context, summaries, and controlled AI handoff in one workspace.",
    tone: "blue",
    status: "Live routing",
    flow: ["Customer context loaded", "AI response prepared", "Best agent assigned"],
  },
  {
    icon: UsersRound,
    title: "CRM & Opportunities",
    description:
      "Contacts, groups, custom fields, pipeline stages, opportunity reporting, meetings, notes, files, and AI-assisted deal insights.",
    tone: "green",
    status: "Pipeline context",
    flow: ["Contact automatically enriched", "Opportunity created", "Follow-up attached"],
  },
  {
    icon: Bot,
    title: "AI Workforce",
    description:
      "Knowledge-guided customer responses, conversation summaries, intent support, and human takeover controls for responsible automation.",
    tone: "purple",
    status: "Knowledge-guided",
    flow: ["Intent understood", "Approved knowledge searched", "Answer ready for delivery"],
  },
  {
    icon: Megaphone,
    title: "Campaign Operations",
    description:
      "WhatsApp template campaigns with scheduling, preflight checks, follow-ups, duplication, cancellation, and delivery-level reporting.",
    tone: "yellow",
    status: "Scheduled delivery",
    flow: ["Audience validated", "Template approved", "Delivery report opened"],
  },
  {
    icon: GitBranch,
    title: "Visual Automation",
    description:
      "A flow builder for triggers, branching logic, messages, media, webhooks, team assignment, and appointment-booking actions.",
    tone: "pink",
    status: "Branching logic",
    flow: ["Trigger received", "Customer path evaluated", "Next action dispatched"],
  },
  {
    icon: CalendarCheck,
    title: "Scheduling & Commerce",
    description:
      "Public booking, Google and Microsoft calendar sync, plus Shopify and Zoho Commerce connections for operational workflows.",
    tone: "cyan",
    status: "Synced availability",
    flow: ["Availability checked", "Meeting confirmed", "Commerce context synced"],
  },
] as const;

const liveSignals = [
  { icon: Bot, title: "AI response", detail: "Approved answer prepared", tone: "purple" },
  { icon: UsersRound, title: "CRM enriched", detail: "Contact intent synchronized", tone: "green" },
  { icon: GitBranch, title: "Deal routed", detail: "Opportunity assigned", tone: "pink" },
  { icon: CalendarCheck, title: "Meeting booked", detail: "Availability confirmed", tone: "cyan" },
] as const;

const architecture = [
  {
    number: "01",
    label: "Public experience",
    title: "Next.js product site",
    description:
      "A responsive, SEO-structured marketing site for product, solution, integration, pricing, insight, and help-center content.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
  },
  {
    number: "02",
    label: "Operations workspace",
    title: "React SaaS application",
    description:
      "A permission-aware dashboard spanning inbox, CRM, campaigns, teams, calendar, automation flows, billing, and commerce modules.",
    stack: ["React 19", "Vite", "Zustand", "React Router", "Zod"],
  },
  {
    number: "03",
    label: "Service platform",
    title: "Django API & workers",
    description:
      "A multi-tenant API surface with real-time messaging, background jobs, scheduled work, AI services, and external platform integrations.",
    stack: ["Django 5", "DRF", "PostgreSQL", "Celery", "Redis", "Channels"],
  },
] as const;

const principles = [
  "Multi-tenant access, roles, permissions, and plan entitlements",
  "Real-time conversation updates through WebSocket channels",
  "Durable campaign and automation processing with background workers",
  "Clear integration boundaries for Meta, calendars, and commerce providers",
  "A separately optimized public experience for search and conversion",
];

const gallery = [
  {
    src: "/projects/zappilo/platform-overview-social.webp",
    alt: "Zappilo platform overview showing connected communication tools",
    label: "Connected platform",
    index: "01",
  },
  {
    src: "/projects/zappilo/crm-social.webp",
    alt: "Zappilo CRM product visualization",
    label: "Customer context",
    index: "02",
  },
  {
    src: "/projects/zappilo/automation-social.webp",
    alt: "Zappilo automation product visualization",
    label: "Workflow automation",
    index: "03",
  },
] as const;

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.68, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function ZappiloExperience() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const liveRef = useRef<HTMLElement>(null);
  const [activeSignal, setActiveSignal] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [pauseSignals, setPauseSignals] = useState(false);
  const liveInView = useInView(liveRef, { margin: "-20% 0px -20% 0px" });
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 74]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.965]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 180, damping: 24 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 180, damping: 24 });

  useEffect(() => {
    if (!liveInView || pauseSignals || reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveSignal((current) => (current + 1) % liveSignals.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, [liveInView, pauseSignals, reduceMotion]);

  const handleHeroPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltX.set(y * -4);
    tiltY.set(x * 4);
  };

  const resetHeroTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const selectedCapability = capabilities[activeCapability];
  const SelectedCapabilityIcon = selectedCapability.icon;

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
        <section className={`${styles.hero} ${styles.shell}`} ref={heroRef}>
          <motion.div
            className={styles.eyebrow}
            initial={reduceMotion ? false : { opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span />
            Full-stack product case study
          </motion.div>

          <div className={styles.heroIntro}>
            <motion.div
              className={styles.heroTitleBlock}
              initial={reduceMotion ? false : { opacity: 0, y: 38 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            >
              <h1>Zappilo</h1>
              <p className={styles.productType}>AI Communication Platform</p>
              <div className={styles.heroMeta} aria-label="Product qualities">
                <span><CircleDot size={11} />Real-time</span>
                <span>Multi-tenant</span>
                <span>AI-assisted</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.heroSummary}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <p>
                A connected customer operations platform that brings WhatsApp conversations,
                AI-assisted support, CRM pipelines, campaigns, automation, scheduling, and commerce
                into one workspace.
              </p>
              <motion.a
                className={styles.primaryAction}
                href="https://www.zappilo.com"
                target="_blank"
                rel="noreferrer"
                whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Visit live product
                <ArrowUpRight size={17} />
              </motion.a>
            </motion.div>
          </div>

          <div className={styles.heroStage}>
            <motion.figure
              className={styles.heroMedia}
              onPointerMove={handleHeroPointer}
              onPointerLeave={resetHeroTilt}
              initial={reduceMotion ? false : { opacity: 0, y: 42, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.28, ease: "easeOut" }}
              style={reduceMotion ? undefined : { y: heroY, scale: heroScale, rotateX: smoothTiltX, rotateY: smoothTiltY }}
            >
              <div className={styles.heroMediaTop} aria-hidden="true">
                <span /><span /><span />
                <p>zappilo.com</p>
                <strong><CircleDot size={10} />Live</strong>
              </div>
              <Image
                src="/projects/zappilo/landing-page.webp"
                alt="Zappilo live landing page"
                fill
                priority
                sizes="90vw"
              />
              <figcaption>
                <span>Live interface capture</span>
                Zappilo public landing experience
              </figcaption>
            </motion.figure>
          </div>
        </section>

        <section className={`${styles.overview} ${styles.shell}`}>
          <Reveal><div className={styles.sectionLabel}>Project overview</div></Reveal>
          <div className={styles.overviewGrid}>
            <Reveal className={styles.sectionLead}>
              <h2>One operating system for every customer conversation.</h2>
              <p>
                Customer-facing teams often move between disconnected inboxes, spreadsheets,
                campaign tools, calendars, and storefronts. Zappilo consolidates that journey around
                the conversation, keeping customer context and the next operational action together.
              </p>
            </Reveal>
            <motion.dl
              className={styles.projectFacts}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-12%" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {[
                ["Product", "B2B SaaS platform"],
                ["Engineering", "Full-stack web development"],
                ["Surfaces", "Public site, workspace, API"],
                ["Core channel", "WhatsApp Business"],
              ].map(([term, detail]) => (
                <motion.div key={term} variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }}>
                  <dt>{term}</dt><dd>{detail}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        <section className={styles.liveBand} ref={liveRef}>
          <div className={`${styles.shell} ${styles.liveGrid}`}>
            <Reveal className={styles.liveCopy}>
              <div className={styles.sectionLabel}>Live customer journey</div>
              <h2>One message.<br />Four systems move.</h2>
              <p>
                Zappilo turns a conversation into coordinated work. AI answers, CRM context updates,
                the opportunity routes, and the calendar closes the loop without losing the thread.
              </p>
              <div className={styles.liveMarker}>
                <span><Sparkles size={15} /></span>
                <div><strong>Event-driven flow</strong><small>Conversation to confirmed action</small></div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div
                className={styles.liveWindow}
                onMouseEnter={() => setPauseSignals(true)}
                onMouseLeave={() => setPauseSignals(false)}
              >
                <div className={styles.liveWindowHeader}>
                  <div><span /><span /><span /></div>
                  <p>Customer journey / live</p>
                  <strong><i />System online</strong>
                </div>
                <div className={styles.liveCanvas}>
                  <div className={styles.signalBeam} aria-hidden="true"><span /></div>
                  <div className={styles.chatPanel}>
                    <div className={styles.chatHeader}>
                      <span className={styles.avatar}>SH</span>
                      <div><strong>Sarah Hasan</strong><small>WhatsApp · online</small></div>
                      <Bot size={17} />
                    </div>
                    <div className={styles.chatMessages}>
                      <motion.p
                        className={`${styles.message} ${styles.messageCustomer}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        Can I see the 3-bedroom apartment this Thursday?
                      </motion.p>
                      <motion.p
                        className={`${styles.message} ${styles.messageAI}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.35 }}
                      >
                        Absolutely. I found a matching listing and checked the team&apos;s availability.
                      </motion.p>
                      <AnimatePresence mode="wait">
                        <motion.div
                          className={styles.activeEvent}
                          key={liveSignals[activeSignal].title}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -7 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Check size={12} />
                          {liveSignals[activeSignal].detail}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className={styles.composer}><span>Reply to Sarah...</span><Send size={13} /></div>
                  </div>

                  <div className={styles.signalRail} aria-label="Connected customer journey events">
                    {liveSignals.map((signal, index) => {
                      const Icon = signal.icon;
                      const active = index === activeSignal;
                      return (
                        <button
                          className={`${styles.signalButton} ${styles[signal.tone]} ${active ? styles.signalActive : ""}`}
                          type="button"
                          key={signal.title}
                          aria-pressed={active}
                          onClick={() => setActiveSignal(index)}
                        >
                          <span className={styles.signalIcon}><Icon size={16} /></span>
                          <span className={styles.signalCopy}><strong>{signal.title}</strong><small>{signal.detail}</small></span>
                          {active && <motion.i layoutId="live-signal" transition={{ type: "spring", stiffness: 320, damping: 28 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={styles.capabilityBand}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <div className={styles.sectionLabel}>Product capabilities</div>
                <h2>Six connected engines.<br />One calm workspace.</h2>
              </div>
              <MessageSquareText size={34} aria-hidden="true" />
            </Reveal>

            <Reveal className={styles.capabilityExperience} delay={0.1}>
              <div className={styles.capabilityTabs} role="tablist" aria-label="Zappilo capabilities">
                {capabilities.map((capability, index) => {
                  const Icon = capability.icon;
                  const active = index === activeCapability;
                  return (
                    <button
                      className={`${styles.capabilityTab} ${active ? styles.capabilityTabActive : ""}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="zappilo-capability-panel"
                      key={capability.title}
                      onClick={() => setActiveCapability(index)}
                    >
                      {active && <motion.span className={styles.tabGlow} layoutId="capability-tab" />}
                      <span className={`${styles.capabilityTabIcon} ${styles[capability.tone]}`}><Icon size={17} /></span>
                      <span>{capability.title}</span>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                    </button>
                  );
                })}
              </div>

              <div className={styles.capabilityPanel} id="zappilo-capability-panel" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={selectedCapability.title}
                    className={styles.capabilityPanelInner}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    <div className={styles.capabilityPanelHeader}>
                      <span className={`${styles.capabilityPanelIcon} ${styles[selectedCapability.tone]}`}>
                        <SelectedCapabilityIcon size={25} />
                      </span>
                      <span className={styles.capabilityPanelNumber}>{String(activeCapability + 1).padStart(2, "0")} / 06</span>
                    </div>
                    <div className={styles.capabilityPanelCopy}>
                      <p>{selectedCapability.status}</p>
                      <h3>{selectedCapability.title}</h3>
                      <span>{selectedCapability.description}</span>
                    </div>
                    <div className={styles.capabilityFlow}>
                      {selectedCapability.flow.map((item, index) => (
                        <motion.div
                          className={styles.capabilityFlowRow}
                          key={item}
                          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.08 }}
                        >
                          <span><Check size={13} /></span>
                          <p>{item}</p>
                          <i />
                        </motion.div>
                      ))}
                    </div>
                    <div className={styles.panelStatus}><i />Active product module</div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={`${styles.architectureSection} ${styles.shell}`}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <div className={styles.sectionLabel}>System architecture</div>
              <h2>Three focused products,<br />one connected platform</h2>
            </div>
            <Layers3 size={34} aria-hidden="true" />
          </Reveal>

          <div className={styles.architectureGrid}>
            <div className={styles.architectureRail} aria-hidden="true">
              <motion.span
                initial={reduceMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
              <i /><i /><i />
            </div>
            {architecture.map((layer, index) => (
              <motion.article
                className={styles.architectureCard}
                key={layer.number}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={reduceMotion ? undefined : { y: -7 }}
              >
                <div className={styles.architectureTopline}>
                  <span>{layer.number}</span>
                  <p>{layer.label}</p>
                </div>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
                <div className={styles.stackList}>
                  {layer.stack.map((item) => <span key={item}>{item}</span>)}
                </div>
              </motion.article>
            ))}
          </div>

          <div className={styles.engineeringGrid}>
            <Reveal className={styles.engineeringCopy}>
              <div className={styles.miniIcon}><Database size={21} /></div>
              <h2>Engineering priorities</h2>
              <p>
                The architecture keeps fast-moving product areas independent while preserving a
                consistent account, permission, and customer-data model across the platform.
              </p>
            </Reveal>
            <motion.ul
              className={styles.principleList}
              initial={reduceMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
            >
              {principles.map((principle) => (
                <motion.li key={principle} variants={{ hidden: { opacity: 0, x: 22 }, visible: { opacity: 1, x: 0 } }}>
                  <Check size={16} />{principle}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section className={styles.galleryBand}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <div className={styles.sectionLabel}>Product views</div>
                <h2>Complex underneath.<br />Clear on the surface.</h2>
              </div>
              <LayoutDashboard size={34} aria-hidden="true" />
            </Reveal>
            <div className={styles.galleryGrid}>
              {gallery.map((item, index) => (
                <motion.figure
                  key={item.src}
                  initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.58, delay: index * 0.1 }}
                  whileHover={reduceMotion ? undefined : { y: -8 }}
                >
                  <div className={styles.galleryImage}>
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 90vw, 30vw" />
                    <span>{item.index}</span>
                    <i><ArrowUpRight size={15} /></i>
                  </div>
                  <figcaption>{item.label}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <motion.section
          className={`${styles.cta} ${styles.shell}`}
          initial={reduceMotion ? false : { opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.ctaLines} aria-hidden="true"><span /><span /><span /></div>
          <div>
            <p>Have a product with this level of ambition?</p>
            <h2>Let&apos;s turn the moving parts into one clear experience.</h2>
          </div>
          <motion.a
            href="mailto:shsagor.11s@gmail.com?subject=Full-stack%20project%20inquiry"
            whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Start a conversation
            <ArrowUpRight size={18} />
          </motion.a>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <p>Designed and developed by Sagor Hossain.</p>
          <div><Workflow size={14} />Zappilo case study</div>
          <Link href="/">Portfolio home</Link>
        </div>
      </footer>
    </div>
  );
}
