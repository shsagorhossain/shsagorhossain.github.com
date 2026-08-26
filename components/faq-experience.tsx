"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Code2,
  Compass,
  Database,
  FileCheck2,
  Gauge,
  Layers3,
  Maximize2,
  MessageCircleQuestion,
  Minus,
  MonitorSmartphone,
  Network,
  PlugZap,
  Plus,
  Rocket,
  ServerCog,
  Send,
  ShieldCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { SiDjango, SiPython, SiReact } from "react-icons/si";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const faqItems = [
  {
    id: "idea-to-production",
    question: "Can you take my idea and build it into a production-ready product?",
    answer: "Yes. I can support the complete journey from clarifying the product goal and planning the architecture to building the interface, backend, integrations, tests, and production launch. You receive a maintainable product with clear milestones rather than an isolated piece of code.",
  },
  {
    id: "technology-stack",
    question: "What technologies do you specialize in?",
    answer: "My core stack includes Python, Django, FastAPI, React, Next.js, TypeScript, Tailwind CSS, relational databases, and REST APIs. I choose the final stack around the product requirements, existing systems, maintainability, and expected scale.",
  },
  {
    id: "client-process",
    question: "How do you usually work with clients?",
    answer: "I begin with a focused discovery conversation, turn the requirements into a written scope, and divide delivery into visible milestones. You receive regular progress updates, working demonstrations, and clear decisions throughout development.",
  },
  {
    id: "existing-codebase",
    question: "Can you work with an existing project or codebase?",
    answer: "Absolutely. I can audit an existing application, understand its architecture, identify technical risks, and then extend, repair, or modernize it without disrupting stable workflows. The first step is always a careful technical assessment.",
  },
  {
    id: "full-stack",
    question: "Can you handle both frontend and backend development?",
    answer: "Yes. I deliver complete web applications across interface design implementation, frontend state, backend business logic, databases, authentication, APIs, deployment, and production support. That keeps product decisions consistent across the full system.",
  },
  {
    id: "integrations",
    question: "Do you integrate third-party APIs and services?",
    answer: "Yes. I work with payment providers, messaging and WhatsApp platforms, email services, authentication systems, analytics, storage, and other business APIs. Integrations include validation, failure handling, security, and operational visibility.",
  },
  {
    id: "delivery",
    question: "How do you approach project timelines and delivery?",
    answer: "After the scope is understood, I provide practical milestones and dependencies instead of an optimistic guess. Delivery moves through build, review, testing, and release stages, with risks communicated early so there are no late surprises.",
  },
  {
    id: "start-project",
    question: "How can I start a project with you?",
    answer: "Send a short summary of your goal, target users, required features, current materials, and preferred timeline. I will review it, ask the important follow-up questions, and propose the clearest next step for scope and delivery.",
  },
];

const faqMetrics = [
  { value: "20+", label: "Projects Completed", icon: BriefcaseBusiness },
  { value: "15+", label: "Happy Clients", icon: Users },
  { value: "2+", label: "Years Experience", icon: CalendarClock },
  { value: "E2E", label: "Full-Stack Delivery", icon: Layers3 },
];

const orbitNodes = [
  { className: "react", label: "React", icon: SiReact },
  { className: "django", label: "Django", icon: SiDjango },
  { className: "database", label: "Database", icon: Database },
  { className: "api", label: "API", text: "API" },
  { className: "python", label: "Python", icon: SiPython },
  { className: "code", label: "Backend code", icon: Braces },
];

const deliveryStages = [
  { number: "01", title: "Discover", detail: "Goals, users, constraints", icon: Compass },
  { number: "02", title: "Plan", detail: "Scope, architecture, milestones", icon: Workflow },
  { number: "03", title: "Build", detail: "Working product increments", icon: Code2 },
  { number: "04", title: "Validate", detail: "Critical workflows and quality", icon: ShieldCheck },
  { number: "05", title: "Launch", detail: "Release, monitoring, handover", icon: Rocket },
];

const deliveryOutputs = [
  { title: "Written product scope", detail: "Clear priorities, boundaries, and delivery milestones.", icon: FileCheck2 },
  { title: "Working increments", detail: "Review usable progress instead of waiting for a final reveal.", icon: Gauge },
  { title: "Production readiness", detail: "Testing, deployment, monitoring, and launch criteria included.", icon: CheckCircle2 },
];

export function FaqExperience() {
  const reduceMotion = useReducedMotion();
  const [openItem, setOpenItem] = useState<string | null>(faqItems[0].id);
  const [detailOpen, setDetailOpen] = useState(false);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!detailOpen) return;

    const previousOverflow = document.body.style.overflow;
    const expandTrigger = expandButtonRef.current;
    const dialog = document.getElementById("idea-delivery-dialog");
    const focusableElements = dialog?.querySelectorAll<HTMLElement>("button, a[href]");
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailOpen(false);
        return;
      }

      if (event.key !== "Tab" || !firstFocusable || !lastFocusable) return;

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      expandTrigger?.focus();
    };
  }, [detailOpen]);

  return (
    <>
      <div className="faq-experience">
      <div className="faq-main-grid">
        <motion.aside
          className="faq-visual-column"
          aria-label="Frequently asked questions overview"
          initial={reduceMotion ? false : { opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="faq-intro">
            <span>Before We Build</span>
            <h2>Frequently Asked <strong>Questions</strong></h2>
            <p>Clear answers about my process, technologies, delivery, and what it is like to build a product together.</p>
          </div>

          <div className="faq-orbit-scene" aria-hidden="true">
            <div className="faq-orbit-grid" />
            <motion.div
              className="faq-orbit-rings"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            >
              <i /><i /><i /><i />
            </motion.div>
            <div className="faq-orbit-particles">
              {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
            </div>
            {orbitNodes.map((node, index) => {
              const Icon = node.icon;

              return (
                <motion.span
                  className={`faq-tech-node faq-tech-${node.className}`}
                  aria-label={node.label}
                  key={node.className}
                  animate={reduceMotion ? undefined : { y: [0, index % 2 === 0 ? -6 : 6, 0] }}
                  transition={{ duration: 3.4 + index * 0.32, repeat: Infinity, ease: "easeInOut", delay: index * -0.45 }}
                >
                  {Icon ? <Icon size={node.className === "django" ? 29 : 27} /> : <b>{node.text}</b>}
                </motion.span>
              );
            })}
            <motion.span
              className="faq-orbit-core"
              animate={reduceMotion ? undefined : {
                boxShadow: [
                  "0 0 0 10px rgba(76, 92, 255, 0.10), 0 0 38px rgba(79, 84, 255, 0.48)",
                  "0 0 0 17px rgba(76, 92, 255, 0.05), 0 0 58px rgba(143, 59, 255, 0.64)",
                  "0 0 0 10px rgba(76, 92, 255, 0.10), 0 0 38px rgba(79, 84, 255, 0.48)",
                ],
              }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MessageCircleQuestion size={48} strokeWidth={1.7} />
            </motion.span>
          </div>

          <div className="faq-metrics" aria-label="Professional highlights">
            {faqMetrics.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <strong><Icon size={18} />{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.aside>

        <div className="faq-list" aria-label="Frequently asked questions">
          {faqItems.map((item, index) => {
            const isOpen = openItem === item.id;
            const buttonId = `faq-button-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <motion.article
                className={`faq-item${isOpen ? " is-open" : ""}`}
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-4%" }}
                transition={{ duration: 0.46, delay: Math.min(index * 0.045, 0.25), ease: "easeOut" }}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenItem(isOpen ? null : item.id)}
                  >
                    <span className="faq-item-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span className="faq-item-question">{item.question}</span>
                    <span className="faq-question-control" aria-hidden="true">
                      {isOpen ? <Minus size={22} /> : <Plus size={22} />}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-answer-shell"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: reduceMotion ? 0.01 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={`faq-answer-content${item.id === "idea-to-production" ? " is-enhanced" : ""}`}>
                        <div className="faq-answer-copy-row">
                          <p>{item.answer}</p>
                          {item.id === "idea-to-production" && (
                            <button
                              className="faq-answer-expand"
                              type="button"
                              ref={expandButtonRef}
                              aria-label="Expand the idea-to-production delivery plan"
                              aria-haspopup="dialog"
                              aria-controls="idea-delivery-dialog"
                              title="Open full delivery blueprint"
                              onClick={() => setDetailOpen(true)}
                            >
                              <Maximize2 size={18} />
                            </button>
                          )}
                        </div>

                        {item.id === "idea-to-production" && (
                          <div className="faq-answer-mini-flow" aria-label="Idea-to-production delivery stages">
                            {deliveryStages.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>

        <motion.div
          className="faq-contact-card"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.58, ease: "easeOut" }}
        >
          <span className="faq-contact-icon" aria-hidden="true"><Send size={31} /></span>
          <div>
            <h3>Still have a question?</h3>
            <p>Share your project idea or the challenge you are facing. I will help you identify the clearest next step.</p>
          </div>
          <a href="mailto:shsagor.11s@gmail.com?subject=Project%20enquiry">
            Let&apos;s Talk
            <ArrowUpRight size={17} />
          </a>
        </motion.div>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {detailOpen && (
          <motion.div
            className="faq-detail-modal-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.28 }}
          >
            <motion.button
              className="faq-detail-modal-backdrop"
              type="button"
              aria-label="Close delivery blueprint"
              onClick={() => setDetailOpen(false)}
            />
            <motion.section
              className="faq-detail-modal"
              id="idea-delivery-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="idea-delivery-title"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.965, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975, y: 16 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="faq-detail-modal-header">
                <div>
                  <span><Network size={14} />FAQ 01</span>
                  <strong>Product Delivery Blueprint</strong>
                </div>
                <button
                  type="button"
                  ref={closeButtonRef}
                  aria-label="Close full delivery blueprint"
                  title="Close blueprint"
                  onClick={() => setDetailOpen(false)}
                >
                  <X size={22} />
                </button>
              </header>

              <div className="faq-detail-modal-scroll">
                <div className="faq-detail-modal-inner">
                  <section className="faq-detail-hero">
                    <motion.div
                      className="faq-detail-copy"
                      initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                    >
                      <span className="faq-detail-kicker"><i />From idea to a stable release</span>
                      <h2 id="idea-delivery-title">A complete product journey, with every decision visible.</h2>
                      <p>I take ownership across discovery, technical planning, implementation, validation, and launch. You stay involved through working milestones while I keep the system coherent from interface to infrastructure.</p>
                      <div className="faq-detail-principles" aria-label="Delivery principles">
                        <span><CheckCircle2 size={15} />Scope before estimates</span>
                        <span><CheckCircle2 size={15} />Working progress reviews</span>
                        <span><CheckCircle2 size={15} />Launch criteria agreed early</span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="faq-detail-system"
                      aria-label="Product system delivery diagram"
                      initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                    >
                      <header>
                        <span>System blueprint</span>
                        <strong><i />Delivery path active</strong>
                      </header>
                      <div className="faq-detail-system-map">
                        <motion.span
                          className="faq-system-goal"
                          animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Compass size={21} />
                          <b>Product goal</b>
                          <small>Outcome and users</small>
                        </motion.span>
                        <div className="faq-system-core">
                          <span><MonitorSmartphone size={20} /><b>Interface</b></span>
                          <span><ServerCog size={20} /><b>Backend</b></span>
                          <span><Database size={20} /><b>Data</b></span>
                          <span><PlugZap size={20} /><b>Integrations</b></span>
                        </div>
                        <motion.span
                          className="faq-system-release"
                          animate={reduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(44,216,131,0)", "0 0 24px rgba(44,216,131,.24)", "0 0 0 rgba(44,216,131,0)"] }}
                          transition={{ duration: 2.8, repeat: Infinity }}
                        >
                          <Rocket size={21} />
                          <b>Production release</b>
                          <small>Observed and supported</small>
                        </motion.span>
                      </div>
                    </motion.div>
                  </section>

                  <section className="faq-detail-process" aria-labelledby="faq-detail-process-title">
                    <div className="faq-detail-section-heading">
                      <div>
                        <span>How delivery moves</span>
                        <h3 id="faq-detail-process-title">Five accountable stages</h3>
                      </div>
                      <p>Each stage produces something concrete you can review before the next decision.</p>
                    </div>
                    <div className="faq-detail-stage-grid">
                      {deliveryStages.map(({ number, title, detail, icon: Icon }, index) => (
                        <motion.article
                          key={title}
                          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.28 + index * 0.07, duration: 0.42 }}
                        >
                          <header><span>{number}</span><Icon size={19} /></header>
                          <h4>{title}</h4>
                          <p>{detail}</p>
                        </motion.article>
                      ))}
                    </div>
                  </section>

                  <section className="faq-detail-outcomes" aria-labelledby="faq-detail-outcomes-title">
                    <div>
                      <span>What you receive</span>
                      <h3 id="faq-detail-outcomes-title">Delivery that stays understandable after launch.</h3>
                    </div>
                    <div className="faq-detail-output-grid">
                      {deliveryOutputs.map(({ title, detail, icon: Icon }) => (
                        <article key={title}>
                          <Icon size={20} />
                          <div><strong>{title}</strong><p>{detail}</p></div>
                        </article>
                      ))}
                    </div>
                    <a href="mailto:shsagor.11s@gmail.com?subject=Product%20development%20enquiry">
                      Start with a project brief
                      <ArrowUpRight size={17} />
                    </a>
                  </section>
                </div>
              </div>
            </motion.section>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
