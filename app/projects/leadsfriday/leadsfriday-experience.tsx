"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CloudCog,
  Code2,
  Database,
  Download,
  ExternalLink,
  Gauge,
  KeyRound,
  Layers3,
  Link2,
  MailCheck,
  Radar,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import styles from "./leadsfriday.module.css";

const capabilities = [
  {
    icon: Radar,
    title: "Lead discovery",
    description:
      "Source targeted company and people lists from Apollo, Sales Navigator, Crunchbase, StoreLeads, BuiltWith, and more.",
    metric: "50+",
    label: "Scrapers and tools",
    tone: "purple",
  },
  {
    icon: MailCheck,
    title: "Enrichment and verification",
    description:
      "Turn raw records into usable outreach data with work-email waterfalls, personal email finding, phone discovery, and verification.",
    metric: "100M+",
    label: "Leads exported",
    tone: "blue",
  },
  {
    icon: WalletCards,
    title: "Pay-as-you-go credits",
    description:
      "Credit packages, coupons, Stripe checkout, invoices, refunds, and an auditable ledger keep usage and spend understandable.",
    metric: "PAYG",
    label: "No subscription lock-in",
    tone: "green",
  },
  {
    icon: Download,
    title: "Delivered exports",
    description:
      "Long-running jobs become downloadable CSV results with order status, progress, history, and a clear handoff back to the customer.",
    metric: "CSV",
    label: "Ready for outreach",
    tone: "yellow",
  },
  {
    icon: KeyRound,
    title: "Developer API",
    description:
      "Authenticated API keys, structured responses, usage visibility, rate tiers, and webhook-ready workflows bring lead operations into other products.",
    metric: "API",
    label: "Workflow ready",
    tone: "cyan",
  },
  {
    icon: UsersRound,
    title: "Team operations",
    description:
      "Shared workspaces, permissions, notifications, support, orders, and administrative controls keep the platform useful beyond one operator.",
    metric: "RBAC",
    label: "Shared workspace",
    tone: "pink",
  },
] as const;

const workflow = [
  {
    number: "01",
    title: "Choose a source",
    description: "Start with the prospecting surface that already contains the filters and market context you need.",
    icon: Search,
  },
  {
    number: "02",
    title: "Submit the request",
    description: "Share a filtered URL or file, define the output, and choose the right enrichment or verification path.",
    icon: Link2,
  },
  {
    number: "03",
    title: "Process asynchronously",
    description: "Worker-backed jobs handle large exports and service calls without making the customer wait on one browser request.",
    icon: Activity,
  },
  {
    number: "04",
    title: "Inspect and download",
    description: "Orders, statuses, result files, credit usage, and delivery actions remain visible from one customer workspace.",
    icon: Download,
  },
] as const;

const architecture = [
  {
    icon: Boxes,
    title: "Modular service catalog",
    description: "A growing service definition layer keeps product copy, order forms, pricing behavior, icons, and delivery rules aligned across tools.",
    signal: "CONFIGURED",
    tone: "purple",
  },
  {
    icon: ServerCog,
    title: "Django operations core",
    description: "Accounts, orders, payments, referrals, notifications, delivery, and verification workflows meet in a permission-aware backend.",
    signal: "DJANGO",
    tone: "blue",
  },
  {
    icon: CloudCog,
    title: "Worker-backed delivery",
    description: "Celery, Redis, scheduled work, logs, and failure handling support the long-running jobs that make large exports practical.",
    signal: "ASYNC",
    tone: "green",
  },
  {
    icon: ShieldCheck,
    title: "Operational trust",
    description: "Auth boundaries, credit checks, order history, support surfaces, and status visibility make the automation accountable.",
    signal: "OBSERVED",
    tone: "yellow",
  },
] as const;

const gallery = [
  {
    src: "/projects/leadsfriday/login.webp",
    alt: "LeadsFriday live sign-in page with B2B lead scraper and enrichment platform messaging",
    eyebrow: "Product entry",
    title: "The value proposition is clear before the first order",
    description:
      "The live entry screen positions LeadsFriday around practical lead operations, a pay-as-you-go model, and a broad set of acquisition tools.",
  },
  {
    src: "/projects/leadsfriday/signup.webp",
    alt: "LeadsFriday live account creation page",
    eyebrow: "Customer onboarding",
    title: "A direct path from interest to workspace",
    description:
      "Account creation is treated as the first product step, leading customers toward their dashboard, credits, orders, and free lead access.",
  },
  {
    src: "/projects/leadsfriday/mobile.webp",
    alt: "LeadsFriday live sign-in experience on a mobile viewport",
    eyebrow: "Responsive access",
    title: "The operational surface stays usable on smaller screens",
    description:
      "The responsive sign-in experience keeps the core action, trust signals, and account entry focused for customers working away from a large monitor.",
  },
] as const;

const stack = [
  { label: "Frontend", value: "Next.js · React · TypeScript", icon: Code2 },
  { label: "Backend", value: "Django · REST APIs · Celery", icon: ServerCog },
  { label: "Data", value: "PostgreSQL · Redis · file delivery", icon: Database },
  { label: "Product layer", value: "Billing · credits · auth · RBAC", icon: Layers3 },
] as const;

export function LeadsFridayExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} />

      <header className={styles.header}>
        <div className={`${styles.shell} ${styles.headerInner}`}>
          <Link className={styles.brand} href="/" aria-label="Back to Sagor Hossain portfolio">
            <Image src="/projects/leadsfriday/leadsfriday-brand.webp" alt="LeadsFriday" width={155} height={40} priority />
          </Link>
          <div className={styles.headerStatus}><i />Case study <b>Live</b></div>
          <Link className={styles.backLink} href="/#projects"><ArrowLeft size={15} />Back to projects</Link>
        </div>
      </header>

      <main>
        <section className={`${styles.shell} ${styles.hero}`}>
          <motion.div
            className={styles.heroCopy}
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className={styles.eyebrow}><span />B2B lead operations, made practical</p>
            <h1>LeadsFriday</h1>
            <p className={styles.heroLead}>A lead generation platform built to move from targeted discovery to usable outreach data.</p>
            <p className={styles.heroSummary}>I helped shape a production workspace where customers can discover leads, enrich and verify records, manage credits, request large exports, and receive completed files without stitching together separate tools.</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="https://app.leadsfriday.com" target="_blank" rel="noreferrer">Visit live product <ExternalLink size={15} /></a>
              <a className={styles.secondaryAction} href="#capabilities">Explore the system <ArrowRight size={15} /></a>
            </div>
            <div className={styles.heroFacts} aria-label="LeadsFriday project facts">
              <span><strong>50+</strong> scrapers and tools</span>
              <span><strong>100M+</strong> leads exported</span>
              <span><strong>PAYG</strong> credit model</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={reduceMotion ? false : { opacity: 0, x: 28, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.1, duration: 0.7, ease: "easeOut" }}
          >
            <div className={styles.visualGlow} />
            <div className={styles.visualFrame}>
              <div className={styles.visualToolbar}><span><i /><i /><i /></span><b>leadsfriday / customer workspace</b><em>LIVE</em></div>
              <div className={styles.visualImage}><Image src="/projects/leadsfriday/login.webp" alt="LeadsFriday live product entry screen" fill sizes="(max-width: 900px) 90vw, 58vw" priority /></div>
              <motion.div className={`${styles.floatingMetric} ${styles.metricTop}`} animate={reduceMotion ? undefined : { y: [0, -7, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}>
                <Gauge size={16} /><span><strong>100M+</strong><small>exported leads</small></span>
              </motion.div>
              <motion.div className={`${styles.floatingMetric} ${styles.metricBottom}`} animate={reduceMotion ? undefined : { y: [0, 6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
                <Zap size={16} /><span><strong>PAYG</strong><small>credits that make sense</small></span>
              </motion.div>
            </div>
            <div className={styles.visualCaption}><span><i />Public product entry</span><strong>app.leadsfriday.com</strong></div>
          </motion.div>
        </section>

        <section className={`${styles.shell} ${styles.overview}`}>
          <div className={styles.sectionLead}>
            <p className={styles.sectionLabel}>The product challenge</p>
            <h2>Lead generation is not one search box. It is a chain of decisions, processing, and delivery.</h2>
          </div>
          <div className={styles.overviewCopy}>
            <p>LeadsFriday brings those stages into one accountable customer journey. A customer can choose a source, submit a filtered request, pay only for the work they need, monitor delivery, and download a result without losing the context of how it was produced.</p>
            <div className={styles.signalLine}><span><CheckCircle2 size={15} />Discover</span><i /><span><CheckCircle2 size={15} />Enrich</span><i /><span><CheckCircle2 size={15} />Verify</span><i /><span><CheckCircle2 size={15} />Deliver</span></div>
          </div>
        </section>

        <section className={`${styles.shell} ${styles.capabilities}`} id="capabilities">
          <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>Product surface</p><h2>One workspace for the work around a lead.</h2></div><p>Discovery, quality, commercial control, and delivery are treated as one system instead of disconnected utilities.</p></div>
          <div className={styles.capabilityGrid}>
            {capabilities.map(({ icon: Icon, title, description, metric, label, tone }, index) => (
              <motion.article key={title} className={`${styles.capabilityCard} ${styles[`tone${tone}`]}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.45 }}>
                <div className={styles.cardHeader}><span className={styles.iconBox}><Icon size={19} /></span><em>{String(index + 1).padStart(2, "0")}</em></div>
                <h3>{title}</h3><p>{description}</p>
                <div className={styles.cardMetric}><strong>{metric}</strong><span>{label}</span></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className={styles.workflowBand}>
          <div className={`${styles.shell} ${styles.workflow}`}>
            <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>The customer journey</p><h2>From a filtered source to a file the team can use.</h2></div><p>Each stage gives the next one more context, visibility, and control.</p></div>
            <div className={styles.workflowGrid}>
              {workflow.map(({ number, title, description, icon: Icon }, index) => (
                <motion.article key={number} initial={reduceMotion ? false : { opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: 0.45 }}>
                  <header><span>{number}</span><Icon size={19} /></header><h3>{title}</h3><p>{description}</p>{index < workflow.length - 1 && <ArrowRight className={styles.workflowArrow} size={16} aria-hidden="true" />}
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.shell} ${styles.gallerySection}`}>
          <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>Product in view</p><h2>Designed around the moment a customer needs to move.</h2></div><p>Real public product screens show how the platform frames discovery, account entry, and responsive access.</p></div>
          <div className={styles.galleryGrid}>
            {gallery.map(({ src, alt, eyebrow, title, description }, index) => (
              <motion.article key={src} className={`${styles.galleryCard} ${index === 0 ? styles.galleryPrimary : ""}`} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: reduceMotion ? 0 : index * 0.08, duration: 0.5 }}>
                <div className={styles.galleryImage}><Image src={src} alt={alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 44vw, 30vw" /></div>
                <div className={styles.galleryCopy}><span>{eyebrow}</span><h3>{title}</h3><p>{description}</p></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className={styles.architectureBand}>
          <div className={`${styles.shell} ${styles.architecture}`}>
            <div className={styles.sectionHeading}><div><p className={styles.sectionLabel}>Engineering shape</p><h2>The product stays useful because the operational layer is visible.</h2></div><p>Behind the clean request flow is a system built for permissions, long-running work, credit accountability, and support.</p></div>
            <div className={styles.architectureGrid}>
              {architecture.map(({ icon: Icon, title, description, signal, tone }, index) => (
                <motion.article key={title} className={`${styles.architectureCard} ${styles[`tone${tone}`]}`} initial={reduceMotion ? false : { opacity: 0, y: 17 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ delay: reduceMotion ? 0 : index * 0.07, duration: 0.45 }}><div className={styles.architectureIcon}><Icon size={20} /></div><span>{signal}</span><h3>{title}</h3><p>{description}</p></motion.article>
              ))}
            </div>
            <div className={styles.stackRail} aria-label="LeadsFriday technology stack">
              {stack.map(({ label, value, icon: Icon }) => <div key={label}><Icon size={16} /><span><b>{label}</b><small>{value}</small></span></div>)}
            </div>
          </div>
        </section>

        <section className={`${styles.shell} ${styles.cta}`}>
          <div className={styles.ctaSignal}><Sparkles size={18} /><span>Lead operations, connected</span></div>
          <h2>Make the next lead workflow easier to run.</h2>
          <p>LeadsFriday turns sourcing, enrichment, verification, credits, and delivery into one product experience that customers can understand and teams can operate.</p>
          <div className={styles.ctaActions}><a className={styles.primaryAction} href="https://app.leadsfriday.com" target="_blank" rel="noreferrer">Visit LeadsFriday <ExternalLink size={15} /></a><Link className={styles.secondaryAction} href="/#projects">See more projects <ArrowUpRight size={15} /></Link></div>
        </section>
      </main>

      <footer className={styles.footer}><div className={styles.shell}><p>LeadsFriday case study · B2B lead generation, enrichment, verification, and delivery.</p><Link href="/#projects">Back to portfolio <ArrowUpRight size={13} /></Link></div></footer>
    </div>
  );
}
