"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Blocks,
  Bot,
  BriefcaseBusiness,
  Check,
  Code2,
  GraduationCap,
  HeartPulse,
  KeyRound,
  Layers3,
  Mail,
  MessageSquareText,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  UsersRound,
  Workflow,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import styles from "./mohuls.module.css";

const products = [
  {
    name: "LearnFlow",
    category: "Learning operations",
    description:
      "Cohort programs, live classes, assignments, progress visibility, mentor support, and practical training operations.",
    signals: ["Course tracks", "Live cohorts", "Progress intelligence"],
    icon: GraduationCap,
    tone: "blue",
    code: "LF",
  },
  {
    name: "ShopFlow",
    category: "Commerce operations",
    description:
      "Storefront catalog control, orders, inventory, fulfillment, returns, and merchant support in one operational flow.",
    signals: ["Catalog control", "Order flow", "Fulfillment"],
    icon: ShoppingBag,
    tone: "yellow",
    code: "SF",
  },
  {
    name: "MediFlow",
    category: "Care commerce",
    description:
      "Medicine ecommerce, pharmacy stock, health-product discovery, customer orders, and admin management.",
    signals: ["Pharmacy catalog", "Stock visibility", "Care orders"],
    icon: HeartPulse,
    tone: "pink",
    code: "MF",
  },
  {
    name: "ReachFlow",
    category: "Care outreach",
    description:
      "Patient outreach, referral engagement, reminders, and care-team response visibility across connected workflows.",
    signals: ["Patient outreach", "Referral flow", "Response tracking"],
    icon: BriefcaseBusiness,
    tone: "cyan",
    code: "RF",
  },
  {
    name: "Codex Tool",
    category: "Developer operations",
    description:
      "AI-assisted chats, repository-aware file operations, runtime control, account sync, and validation-focused delivery.",
    signals: ["Repository context", "Runtime control", "Validated delivery"],
    icon: Code2,
    tone: "purple",
    code: "CT",
  },
  {
    name: "SendFlow",
    category: "Business messaging",
    description:
      "Email and SMS campaigns, audiences, templates, delivery providers, analytics, and collaborative team workspaces.",
    signals: ["Campaign delivery", "Shared audiences", "Message analytics"],
    icon: Mail,
    tone: "green",
    code: "SF",
  },
  {
    name: "ChatFlow",
    category: "Team communication",
    description:
      "Business chat, channels, meetings, workflow automation, integrations, AI support, and workspace governance.",
    signals: ["Team channels", "Meetings", "Workflow automation"],
    icon: MessageSquareText,
    tone: "orange",
    code: "CF",
  },
] as const;

const ecosystemLayers = [
  {
    number: "01",
    label: "Discovery",
    title: "Public product experience",
    description:
      "A search-ready marketing surface with focused product, pricing, learning, resource, legal, and company journeys.",
    icon: Search,
    signal: "mohuls.com",
    tone: "blue",
  },
  {
    number: "02",
    label: "Identity",
    title: "Central authentication",
    description:
      "Shared sessions, SSO, MFA, trusted devices, passkeys, onboarding, and product membership across Mohuls domains.",
    icon: KeyRound,
    signal: "accounts.mohuls.com",
    tone: "purple",
  },
  {
    number: "03",
    label: "Customer workspace",
    title: "Account control plane",
    description:
      "Profiles, security, orders, applications, services, organizations, agents, groups, and compliance in one account layer.",
    icon: UsersRound,
    signal: "myaccount.mohuls.com",
    tone: "green",
  },
  {
    number: "04",
    label: "Commerce",
    title: "Marketplace journeys",
    description:
      "Product and service discovery, order creation, checkout, payments, and account-aware customer transitions.",
    icon: Store,
    signal: "marketplace.mohuls.com",
    tone: "yellow",
  },
  {
    number: "05",
    label: "Operations",
    title: "Staff delivery system",
    description:
      "Internal product, infrastructure, customer, campaign, billing, and permission workflows powered by MSL Lab.",
    icon: Workflow,
    signal: "lab.mohuls.com",
    tone: "cyan",
  },
] as const;

const gallery = [
  {
    src: "/projects/mohuls/home.webp",
    alt: "Mohuls live homepage presenting the connected software suite",
    eyebrow: "Public platform",
    title: "A clear first step into the ecosystem",
    description:
      "The live homepage frames Mohuls as one operating suite while keeping focused products immediately discoverable.",
  },
  {
    src: "/projects/mohuls/products.webp",
    alt: "Mohuls live product directory with searchable software catalog",
    eyebrow: "Product discovery",
    title: "One searchable catalog for every product line",
    description:
      "The directory connects apps, selected work, and marketplace journeys without losing product-level context.",
  },
  {
    src: "/projects/mohuls/codex-tool.webp",
    alt: "Mohuls Codex Tool live product landing page",
    eyebrow: "Focused product story",
    title: "Individual products keep their own conversion path",
    description:
      "Dedicated product experiences can explain specialized value while remaining part of the wider Mohuls identity.",
  },
] as const;

const engineeringDecisions = [
  {
    icon: Layers3,
    title: "Composable product architecture",
    description:
      "Thin App Router pages hand off to shared product, resource, legal, navigation, and SEO systems that scale across the catalog.",
    metric: "46",
    label: "Public routes",
    tone: "blue",
  },
  {
    icon: ShieldCheck,
    title: "Cross-domain trust",
    description:
      "Shared authentication and carefully scoped session bridges preserve continuity between discovery, account, marketplace, and staff surfaces.",
    metric: "SSO",
    label: "Shared identity",
    tone: "green",
  },
  {
    icon: Bot,
    title: "Motion with operational purpose",
    description:
      "Framer Motion supports guided reveals, product transitions, and interface feedback while reduced-motion behavior remains respected.",
    metric: "A11Y",
    label: "Motion aware",
    tone: "purple",
  },
  {
    icon: Blocks,
    title: "Independent products, one system",
    description:
      "Each product owns a focused proposition, pricing path, and learning surface while shared platform services reduce duplicated infrastructure.",
    metric: "7",
    label: "Product lines",
    tone: "yellow",
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

export function MohulsExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [activeProduct, setActiveProduct] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const selectedProduct = products[activeProduct];
  const SelectedProductIcon = selectedProduct.icon;

  useEffect(() => {
    if (reduceMotion || !autoAdvance) return;

    const timer = window.setInterval(() => {
      setActiveProduct((current) => (current + 1) % products.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [autoAdvance, reduceMotion]);

  const selectProduct = (index: number) => {
    setActiveProduct(index);
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
            <span><i />Live ecosystem</span>
            <b>Seven product lines</b>
          </div>
          <Link className={styles.backLink} href="/#projects">
            <ArrowLeft size={16} />
            Back to projects
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
            <p className={styles.eyebrow}><span />Multi-product platform case study</p>
            <h1>Mohuls</h1>
            <p className={styles.heroLead}>Business Software Ecosystem</p>
            <p className={styles.heroSummary}>
              A connected platform that moves customers from product discovery to secure accounts,
              marketplace journeys, specialized software, and operational delivery without fragmenting the brand.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="https://www.mohuls.com" target="_blank" rel="noreferrer">
                Visit Live Product <ArrowUpRight size={16} />
              </a>
              <a className={styles.secondaryAction} href="#ecosystem">
                Explore the ecosystem <ArrowUpRight size={15} />
              </a>
            </div>
            <div className={styles.heroFacts} aria-label="Mohuls platform facts">
              <div><span>Products</span><strong>7 focused lines</strong></div>
              <div><span>Routes</span><strong>46 public pages</strong></div>
              <div><span>Identity</span><strong>Shared SSO</strong></div>
              <div><span>State</span><strong>Live production</strong></div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.heroOrbit} aria-hidden="true">
              <span>Identity</span><span>Products</span><span>Marketplace</span>
            </div>
            <div className={styles.browserFrame}>
              <div className={styles.browserBar}>
                <span><i /><i /><i /></span>
                <b>www.mohuls.com</b>
                <em>Live</em>
              </div>
              <div className={styles.browserViewport}>
                <Image
                  src="/projects/mohuls/home.webp"
                  alt="Mohuls live homepage presenting the connected software suite"
                  fill
                  sizes="(max-width: 1050px) 90vw, 54vw"
                  priority
                />
              </div>
            </div>
            <motion.div
              className={styles.liveBadge}
              animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={17} />
              <span><small>Connected suite</small><strong>One clear entry point</strong></span>
            </motion.div>
          </motion.div>
        </section>

        <div className={styles.productRail} aria-label="Mohuls products">
          <div className={styles.productRailTrack}>
            {[...products, ...products].map((product, index) => (
              <span key={`${product.name}-${index}`}><i />{product.name}</span>
            ))}
          </div>
        </div>

        <section className={`${styles.overview} ${styles.shell}`}>
          <Reveal className={styles.sectionLead}>
            <p className={styles.sectionLabel}>The platform brief</p>
            <h2>One ecosystem.<br />Many focused jobs.</h2>
          </Reveal>
          <Reveal className={styles.overviewCopy} delay={0.08}>
            <p>
              Mohuls is designed as a platform brand with independent products, not a collection of disconnected landing pages.
              Shared navigation, identity, account, marketplace, and internal delivery systems create continuity while every product
              retains its own audience, proposition, pricing, and learning path.
            </p>
            <div className={styles.overviewSignals}>
              <span><Check size={13} />Search-ready public routes</span>
              <span><Check size={13} />Cross-domain sessions</span>
              <span><Check size={13} />Standalone deployment</span>
            </div>
          </Reveal>
        </section>

        <section className={styles.productBand} id="ecosystem">
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionLabel}>Product operating map</p>
                <h2>Seven products.<br />One shared context.</h2>
              </div>
              <p>
                Each product answers a different operational need while the wider Mohuls platform preserves discovery,
                identity, commerce, and delivery continuity.
              </p>
            </Reveal>

            <div className={styles.productExperience}>
              <div className={styles.productTabs} role="tablist" aria-label="Mohuls product lines">
                {products.map((product, index) => {
                  const Icon = product.icon;
                  return (
                    <button
                      key={product.name}
                      className={`${styles.productTab} ${styles[product.tone]} ${index === activeProduct ? styles.activeProduct : ""}`}
                      type="button"
                      role="tab"
                      aria-selected={index === activeProduct}
                      aria-controls="mohuls-product-panel"
                      onClick={() => selectProduct(index)}
                    >
                      <Icon size={18} />
                      <span>{product.name}</span>
                      <small>{product.code}</small>
                    </button>
                  );
                })}
              </div>

              <div className={styles.productPanel} id="mohuls-product-panel" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    className={`${styles.productStory} ${styles[selectedProduct.tone]}`}
                    key={selectedProduct.name}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    <div className={styles.productIdentity}>
                      <span><SelectedProductIcon size={25} /></span>
                      <div><small>{selectedProduct.category}</small><strong>{selectedProduct.name}</strong></div>
                    </div>
                    <p>{selectedProduct.description}</p>
                    <div className={styles.productSignals}>
                      {selectedProduct.signals.map((signal) => <span key={signal}>{signal}</span>)}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className={styles.contextMap} aria-label="Shared product context">
                  <span className={styles.contextCore}><Layers3 size={22} /><b>Mohuls</b><small>Shared context</small></span>
                  <span className={styles.contextNode}><KeyRound size={16} /><b>Identity</b></span>
                  <span className={styles.contextNode}><Store size={16} /><b>Marketplace</b></span>
                  <span className={styles.contextNode}><Workflow size={16} /><b>Operations</b></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.gallerySection} ${styles.shell}`}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionLabel}>Live product surfaces</p>
              <h2>Real journeys.<br />One visual system.</h2>
            </div>
            <p>
              The public experience supports both the high-level suite story and deep, product-specific conversion paths.
            </p>
          </Reveal>

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <Reveal className={styles.galleryItem} key={item.src} delay={index * 0.06}>
                <div className={styles.galleryMedia}>
                  <Image src={item.src} alt={item.alt} fill sizes={index === 0 ? "90vw" : "44vw"} />
                  <span>0{index + 1}</span>
                </div>
                <div className={styles.galleryCopy}>
                  <small>{item.eyebrow}</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={styles.architectureBand}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionLabel}>Connected architecture</p>
                <h2>From discovery<br />to delivery.</h2>
              </div>
              <p>
                Six production domains form a deliberate customer and operations path, with shared identity holding the experience together.
              </p>
            </Reveal>

            <div className={styles.architectureFlow}>
              {ecosystemLayers.map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <Reveal className={`${styles.architectureCard} ${styles[layer.tone]}`} key={layer.title} delay={index * 0.05}>
                    <div className={styles.architectureTop}>
                      <span><Icon size={19} /></span><small>{layer.number}</small>
                    </div>
                    <p>{layer.label}</p>
                    <h3>{layer.title}</h3>
                    <div className={styles.architectureSignal}><i />{layer.signal}</div>
                    <strong>{layer.description}</strong>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.engineeringSection} ${styles.shell}`}>
          <Reveal className={styles.sectionLead}>
            <p className={styles.sectionLabel}>Engineering decisions</p>
            <h2>Built to grow<br />without drifting apart.</h2>
          </Reveal>
          <div className={styles.engineeringGrid}>
            {engineeringDecisions.map((decision, index) => {
              const Icon = decision.icon;
              return (
                <Reveal className={`${styles.engineeringCard} ${styles[decision.tone]}`} key={decision.title} delay={index * 0.05}>
                  <div className={styles.engineeringMetric}><Icon size={20} /><span><b>{decision.metric}</b><small>{decision.label}</small></span></div>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal className={`${styles.cta} ${styles.shell}`}>
          <span className={styles.ctaIcon}><Sparkles size={24} /></span>
          <div>
            <p className={styles.sectionLabel}>Live product ecosystem</p>
            <h2>Explore Mohuls in production.</h2>
            <p>See the public suite, searchable product catalog, and focused product journeys working together.</p>
          </div>
          <div className={styles.ctaActions}>
            <a className={styles.primaryAction} href="https://www.mohuls.com" target="_blank" rel="noreferrer">
              Visit Live Product <ArrowUpRight size={16} />
            </a>
            <Link className={styles.secondaryAction} href="/#contact">Discuss a project</Link>
          </div>
        </Reveal>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <p>Mohuls business software ecosystem case study</p>
          <Link href="/#projects">More projects <ArrowUpRight size={13} /></Link>
        </div>
      </footer>
    </div>
  );
}
