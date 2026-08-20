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
  BarChart3,
  Boxes,
  Check,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  CreditCard,
  Database,
  Gauge,
  ImageIcon,
  Layers3,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  UsersRound,
  WalletCards,
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
import styles from "./one-lifestyle.module.css";

const journey = [
  {
    icon: Search,
    number: "01",
    label: "Discover",
    title: "Catalog discovery that stays purchase-ready.",
    description:
      "Shoppers move from campaign-led entry points into searchable, category-aware inventory with pricing, discounts, availability, and fast product actions kept visible.",
    bullets: ["Category and price filtering", "Stock-aware product cards", "Quick view and promotional pricing"],
    tone: "green",
  },
  {
    icon: ShoppingBag,
    number: "02",
    label: "Decide",
    title: "A product page built around confidence.",
    description:
      "Product media, item codes, sale pricing, inventory state, specifications, policy context, and the cart action meet in one focused buying surface.",
    bullets: ["Multi-image product gallery", "Clear inventory and pricing states", "After-sales policy surfaced before purchase"],
    tone: "blue",
  },
  {
    icon: WalletCards,
    number: "03",
    label: "Purchase",
    title: "Checkout connects payment and delivery rules.",
    description:
      "The platform validates cart state, coupons, delivery zones, shipping choices, and payment intent through a server-controlled checkout flow.",
    bullets: ["Coupon and shipping validation", "AamarPay and bKash payment paths", "Customer address and invoice continuity"],
    tone: "red",
  },
  {
    icon: PackageCheck,
    number: "04",
    label: "Operate",
    title: "Every order remains operational after payment.",
    description:
      "Teams manage status history, held and pending orders, fulfillment, returns, delivery zones, reporting, and customer records from one protected workspace.",
    bullets: ["Order lifecycle and status history", "Returns and after-sales workflows", "Sales, product, and return reporting"],
    tone: "yellow",
  },
] as const;

const orderSignals = [
  { icon: ShoppingCart, label: "Order received", detail: "Cart and customer verified" },
  { icon: CreditCard, label: "Payment checked", detail: "Gateway response recorded" },
  { icon: ClipboardCheck, label: "Ready to fulfill", detail: "Inventory committed" },
  { icon: Truck, label: "Delivery active", detail: "Status visible to operations" },
] as const;

const capabilities = [
  {
    icon: Boxes,
    title: "Catalog & inventory",
    description: "Products, categories, custom fields, sale pricing, stock, and merchandising controls.",
    signal: "Stock synchronized",
    tone: "green",
  },
  {
    icon: ReceiptText,
    title: "Order lifecycle",
    description: "Checkout, invoices, status history, held orders, fulfillment, returns, and return logs.",
    signal: "Traceable states",
    tone: "blue",
  },
  {
    icon: CreditCard,
    title: "Payment operations",
    description: "Gateway-backed payment intent, AamarPay and bKash flows, and protected token handling.",
    signal: "Server validated",
    tone: "red",
  },
  {
    icon: ImageIcon,
    title: "Commerce CMS",
    description: "Banners, home configuration, notices, campaign sections, delivery offers, and vouchers.",
    signal: "Campaign ready",
    tone: "purple",
  },
  {
    icon: BarChart3,
    title: "Reporting",
    description: "Sales, product, return, customer, and daily adjustment views for operational decisions.",
    signal: "Decision context",
    tone: "yellow",
  },
  {
    icon: UsersRound,
    title: "Customer operations",
    description: "OTP and JWT access, profiles, addresses, order history, newsletter, and visitor context.",
    signal: "Identity connected",
    tone: "cyan",
  },
] as const;

const architecture = [
  {
    number: "01",
    icon: Store,
    label: "Customer experience",
    title: "Next.js storefront",
    description:
      "An App Router storefront spanning home, catalog, categories, product detail, cart, checkout, payments, invoices, customer profile, and policy surfaces.",
    stack: ["Next.js 14", "React 18", "Tailwind", "SWR"],
    tone: "green",
  },
  {
    number: "02",
    icon: Workflow,
    label: "Commerce services",
    title: "Django API platform",
    description:
      "A protected REST API coordinates authentication, catalog, carts, orders, payments, coupons, shipping, CMS, reporting, and management operations.",
    stack: ["Django 5", "DRF", "JWT", "Channels"],
    tone: "red",
  },
  {
    number: "03",
    icon: Database,
    label: "Data & delivery",
    title: "Production foundation",
    description:
      "Relational commerce data, containerized services, media processing, and explicit integration boundaries support repeatable production operation.",
    stack: ["PostgreSQL", "Docker", "Daphne", "Pillow"],
    tone: "blue",
  },
] as const;

const engineeringPrinciples = [
  "Pricing, stock, coupons, shipping, and payments validated on the server",
  "Order status history retained across fulfillment and return workflows",
  "Public commerce and protected management responsibilities clearly separated",
  "Campaign content and delivery offers manageable without a storefront release",
  "English and Bangla customer journeys supported by the live experience",
] as const;

const gallery = [
  {
    src: "/projects/one-lifestyle/storefront.webp",
    alt: "One Lifestyle BD live storefront hero and category navigation",
    title: "Campaign-led storefront",
    note: "Brand, promotion, language, and category discovery",
  },
  {
    src: "/projects/one-lifestyle/catalog.webp",
    alt: "One Lifestyle BD product catalog with filters and product cards",
    title: "Live catalog",
    note: "Filtering, stock, pricing, quick view, and cart actions",
  },
  {
    src: "/projects/one-lifestyle/product.webp",
    alt: "One Lifestyle BD product details and purchase interface",
    title: "Purchase decision",
    note: "Media, specifications, policy, pricing, and availability",
  },
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

export function OneLifestyleExperience() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const workflowInView = useInView(workflowRef, { margin: "-18% 0px -18% 0px" });
  const [activeJourney, setActiveJourney] = useState(0);
  const [activeOrderSignal, setActiveOrderSignal] = useState(0);
  const [pauseWorkflow, setPauseWorkflow] = useState(false);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 58]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 180, damping: 25 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 180, damping: 25 });

  useEffect(() => {
    if (!workflowInView || pauseWorkflow || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveOrderSignal((current) => (current + 1) % orderSignals.length);
    }, 2100);
    return () => window.clearInterval(timer);
  }, [pauseWorkflow, reduceMotion, workflowInView]);

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

  const selectedJourney = journey[activeJourney];
  const SelectedJourneyIcon = selectedJourney.icon;

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
        <div className={styles.heroBand}>
          <section className={[styles.hero, styles.shell].join(" ")} ref={heroRef}>
            <motion.div
              className={styles.eyebrow}
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span />
              Production commerce case study
            </motion.div>

            <div className={styles.heroIntro}>
              <motion.div
                className={styles.heroTitle}
                initial={reduceMotion ? false : { opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.08, ease: "easeOut" }}
              >
                <h1>One Lifestyle BD</h1>
                <p>Commerce, built as an operating system.</p>
                <div className={styles.heroMeta} aria-label="Project qualities">
                  <span><CircleDot size={10} />Live production</span>
                  <span>Full-stack</span>
                  <span>Bangladesh commerce</span>
                </div>
              </motion.div>

              <motion.div
                className={styles.heroSummary}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.68, delay: 0.2, ease: "easeOut" }}
              >
                <p>
                  A connected retail platform that carries the customer from campaign discovery to
                  payment, delivery, after-sales, and repeat operations without separating the
                  storefront from the work behind it.
                </p>
                <motion.a
                  className={styles.primaryAction}
                  href="https://onelifestyle.com.bd"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={reduceMotion ? undefined : { y: -3, scale: 1.012 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                >
                  Visit live store
                  <ArrowUpRight size={17} />
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
                <div className={styles.browserBar} aria-hidden="true">
                  <div><span /><span /><span /></div>
                  <p>onelifestyle.com.bd</p>
                  <strong><i />Live</strong>
                </div>
                <Image
                  src="/projects/one-lifestyle/storefront.webp"
                  alt="One Lifestyle Bangladesh live storefront"
                  fill
                  priority
                  loading="eager"
                  sizes="90vw"
                />
              </motion.figure>

              <motion.div
                className={styles.heroOperation}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.58, delay: 0.72 }}
              >
                <div className={styles.operationHead}>
                  <span><Gauge size={16} /></span>
                  <div><small>Commerce core</small><strong>Systems connected</strong></div>
                  <i />
                </div>
                {[
                  ["Storefront", "Customer ready"],
                  ["Payments", "Gateway connected"],
                  ["Operations", "Workflow active"],
                ].map(([label, value], index) => (
                  <div className={styles.operationRow} key={label}>
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
              <div><strong>03</strong><span>Connected product surfaces</span></div>
              <div><strong>01</strong><span>Unified commerce lifecycle</span></div>
              <div><strong>24/7</strong><span>Production storefront access</span></div>
            </motion.div>
          </section>
        </div>

        <section className={[styles.overview, styles.shell].join(" ")}>
          <Reveal><div className={styles.sectionLabel}>Project overview</div></Reveal>
          <div className={styles.overviewGrid}>
            <Reveal className={styles.sectionLead}>
              <h2>A storefront shoppers see. An operating system the business runs.</h2>
              <p>
                One Lifestyle BD is more than a product grid. Its customer experience, catalog,
                inventory, promotions, checkout, payment, delivery, customer identity, and
                after-sales workflows share one commerce foundation.
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
                ["Product", "D2C commerce platform"],
                ["Scope", "Storefront, operations, API"],
                ["Engineering", "Next.js and Django"],
                ["Lifecycle", "Discovery through returns"],
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

        <section className={styles.workflowBand} ref={workflowRef}>
          <div className={styles.shell}>
            <Reveal className={styles.sectionHeading}>
              <div>
                <div className={styles.sectionLabel}>Connected commerce journey</div>
                <h2>Four moments.<br />One continuous system.</h2>
              </div>
              <ShoppingCart size={34} aria-hidden="true" />
            </Reveal>

            <Reveal className={styles.journeyExperience} delay={0.1}>
              <div className={styles.journeyTabs} role="tablist" aria-label="Commerce lifecycle">
                {journey.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === activeJourney;
                  return (
                    <button
                      className={[styles.journeyTab, active ? styles.journeyTabActive : ""].join(" ")}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="one-lifestyle-journey-panel"
                      onClick={() => setActiveJourney(index)}
                      key={item.label}
                    >
                      {active && <motion.i layoutId="journey-active" />}
                      <span className={[styles.journeyIcon, styles[item.tone]].join(" ")}><Icon size={17} /></span>
                      <span><small>{item.number}</small><strong>{item.label}</strong></span>
                    </button>
                  );
                })}
              </div>

              <div
                className={styles.journeyPanel}
                id="one-lifestyle-journey-panel"
                role="tabpanel"
                onMouseEnter={() => setPauseWorkflow(true)}
                onMouseLeave={() => setPauseWorkflow(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.article
                    className={styles.journeyCopy}
                    key={selectedJourney.title}
                    initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={[styles.journeyPanelIcon, styles[selectedJourney.tone]].join(" ")}>
                      <SelectedJourneyIcon size={24} />
                    </div>
                    <span>{selectedJourney.number} / 04 · {selectedJourney.label}</span>
                    <h3>{selectedJourney.title}</h3>
                    <p>{selectedJourney.description}</p>
                    <ul>
                      {selectedJourney.bullets.map((bullet) => (
                        <li key={bullet}><CheckCircle2 size={15} />{bullet}</li>
                      ))}
                    </ul>
                  </motion.article>
                </AnimatePresence>

                <div className={styles.orderWindow}>
                  <div className={styles.orderHeader}>
                    <div><span /><span /><span /></div>
                    <p>Order workflow</p>
                    <strong><i />Processing</strong>
                  </div>
                  <div className={styles.orderSummary}>
                    <span><ShoppingBag size={18} /></span>
                    <div><small>Order reference</small><strong>ONE-2408</strong></div>
                    <p>End-to-end</p>
                  </div>
                  <div className={styles.orderTimeline}>
                    {orderSignals.map((signal, index) => {
                      const Icon = signal.icon;
                      const active = index === activeOrderSignal;
                      const complete = index < activeOrderSignal;
                      return (
                        <button
                          className={[
                            styles.orderSignal,
                            active ? styles.orderSignalActive : "",
                            complete ? styles.orderSignalComplete : "",
                          ].join(" ")}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setActiveOrderSignal(index)}
                          key={signal.label}
                        >
                          <span><Icon size={15} /></span>
                          <div><strong>{signal.label}</strong><small>{signal.detail}</small></div>
                          <i>{complete ? <Check size={11} /> : String(index + 1).padStart(2, "0")}</i>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.orderFooter}>
                    <span><ShieldCheck size={14} />Server-controlled state</span>
                    <small>{String(activeOrderSignal + 1).padStart(2, "0")} / 04</small>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className={[styles.capabilitiesSection, styles.shell].join(" ")}>
          <Reveal className={styles.sectionHeading}>
            <div>
              <div className={styles.sectionLabel}>Operational scope</div>
              <h2>The tools behind every purchase.</h2>
            </div>
            <Layers3 size={34} aria-hidden="true" />
          </Reveal>

          <div className={styles.capabilityGrid}>
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <Reveal className={[styles.capabilityCard, styles[capability.tone]].join(" ")} delay={index * 0.045} key={capability.title}>
                  <div className={styles.capabilityTop}>
                    <span><Icon size={21} /></span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </div>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <div><i />{capability.signal}</div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className={styles.architectureBand}>
          <div className={styles.shell}>
            <Reveal className={styles.architectureIntro}>
              <div>
                <div className={styles.sectionLabel}>System architecture</div>
                <h2>Three layers.<br />One commerce contract.</h2>
              </div>
              <p>
                Each layer has a clear responsibility, but the product behaves as one system from
                the first catalog request through operational reporting.
              </p>
            </Reveal>

            <div className={styles.architectureGrid}>
              {architecture.map((layer, index) => {
                const Icon = layer.icon;
                return (
                  <Reveal className={[styles.architectureCard, styles[layer.tone]].join(" ")} delay={index * 0.09} key={layer.title}>
                    <div className={styles.architectureNumber}>{layer.number}</div>
                    <span className={styles.architectureIcon}><Icon size={23} /></span>
                    <div className={styles.architectureCopy}>
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
                <div><small>Engineering principles</small><strong>Built for operational trust</strong></div>
              </div>
              <ul>
                {engineeringPrinciples.map((principle) => (
                  <li key={principle}><Check size={13} />{principle}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className={styles.galleryBand}>
          <div className={styles.shell}>
            <Reveal className={styles.galleryHeading}>
              <div>
                <div className={styles.sectionLabel}>Live product surfaces</div>
                <h2>Real commerce, in production.</h2>
              </div>
              <a href="https://onelifestyle.com.bd" target="_blank" rel="noreferrer">
                Open storefront <ArrowUpRight size={15} />
              </a>
            </Reveal>

            <div className={styles.galleryGrid}>
              {gallery.map((item, index) => (
                <Reveal className={styles.galleryItem} delay={index * 0.08} key={item.title}>
                  <a href="https://onelifestyle.com.bd" target="_blank" rel="noreferrer" aria-label={"Open live store from " + item.title}>
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 90vw, 30vw" />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i><ArrowUpRight size={15} /></i>
                  </a>
                  <div><h3>{item.title}</h3><p>{item.note}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={[styles.cta, styles.shell].join(" ")}>
          <div className={styles.ctaMark}><Sparkles size={26} /></div>
          <div>
            <div className={styles.sectionLabel}>From interface to infrastructure</div>
            <h2>Building commerce that keeps the business moving.</h2>
            <p>Explore the live One Lifestyle experience or start a conversation about your own product.</p>
          </div>
          <div className={styles.ctaActions}>
            <a href="https://onelifestyle.com.bd" target="_blank" rel="noreferrer">
              Visit live store <ArrowUpRight size={16} />
            </a>
            <a href="mailto:shsagor.11s@gmail.com">Discuss a project</a>
          </div>
          <div className={styles.ctaSignal} aria-hidden="true"><span /><span /><span /></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <div><RefreshCw size={13} /><span>Case study · One Lifestyle BD</span></div>
          <Link href="/projects/">All projects</Link>
        </div>
      </footer>
    </div>
  );
}
