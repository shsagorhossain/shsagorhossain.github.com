"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  Activity,
  Boxes,
  Braces,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  CloudCog,
  Code2,
  Compass,
  Database,
  FileCheck2,
  Gauge,
  GitBranch,
  GitPullRequest,
  Handshake,
  Layers3,
  LayoutTemplate,
  LockKeyhole,
  Maximize2,
  MessageSquareText,
  MessageCircleQuestion,
  Milestone,
  Minus,
  MonitorSmartphone,
  Network,
  PackageCheck,
  PanelTop,
  PlugZap,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  ScanSearch,
  ServerCog,
  Send,
  ShieldCheck,
  TestTube2,
  Users,
  Waypoints,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { SiDjango, SiPython, SiReact } from "react-icons/si";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

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

const technologyLayers = [
  { title: "Interface", detail: "React, Next.js, TypeScript, Tailwind CSS", icon: LayoutTemplate, tone: "blue" },
  { title: "Application", detail: "Python, Django, FastAPI, REST APIs", icon: ServerCog, tone: "purple" },
  { title: "Data", detail: "PostgreSQL, Redis, object storage", icon: Database, tone: "yellow" },
  { title: "Delivery", detail: "Docker, Linux, CI/CD, monitoring", icon: CloudCog, tone: "green" },
];

const technologyChecks = [
  { title: "Product fit", detail: "The product workflow and required integrations come first.", icon: Boxes },
  { title: "Operational risk", detail: "Security, failure recovery, and observability shape the design.", icon: LockKeyhole },
  { title: "Team longevity", detail: "Readable conventions and established tooling reduce future friction.", icon: Users },
  { title: "Expected scale", detail: "Complexity is introduced only when the real workload needs it.", icon: Gauge },
];

const technologyOutputs = [
  { title: "Maintainable architecture", detail: "Clear ownership boundaries and conventions for future work.", icon: Layers3 },
  { title: "Integration ready", detail: "APIs and external services fit into a deliberate system design.", icon: PlugZap },
  { title: "Practical handover", detail: "The environment, deployment path, and key decisions are documented.", icon: FileCheck2 },
];

const collaborationStages = [
  { number: "01", title: "Align", detail: "Goals, scope, owners", icon: Handshake },
  { number: "02", title: "Plan", detail: "Milestone and decisions", icon: Milestone },
  { number: "03", title: "Build", detail: "Visible working progress", icon: Code2 },
  { number: "04", title: "Review", detail: "Demo, feedback, approval", icon: MessageSquareText },
  { number: "05", title: "Release", detail: "Validate and hand over", icon: PackageCheck },
];

const collaborationOutputs = [
  { title: "Visible progress", detail: "Working demonstrations replace vague percentage updates.", icon: MonitorSmartphone },
  { title: "Recorded decisions", detail: "Scope changes and approvals remain clear to everyone.", icon: FileCheck2 },
  { title: "One accountable path", detail: "You always know who owns the next action and release.", icon: GitBranch },
];

const codebaseStages = [
  { number: "01", title: "Inspect", detail: "Run, read, and observe", icon: ScanSearch },
  { number: "02", title: "Map", detail: "Architecture and dependencies", icon: Waypoints },
  { number: "03", title: "Stabilize", detail: "Protect critical behavior", icon: ShieldCheck },
  { number: "04", title: "Improve", detail: "Small controlled changes", icon: Wrench },
  { number: "05", title: "Verify", detail: "Regression and release checks", icon: ClipboardCheck },
];

const codebaseAuditAreas = [
  { title: "Architecture", detail: "Boundaries, coupling, ownership", icon: Layers3 },
  { title: "Behavior", detail: "Critical workflows and regressions", icon: Activity },
  { title: "Data", detail: "Models, migrations, integrity", icon: Database },
  { title: "Delivery", detail: "Tests, deployment, observability", icon: CloudCog },
];

const codebaseOutputs = [
  { title: "Technical assessment", detail: "A concise map of architecture, constraints, and current risks.", icon: ScanSearch },
  { title: "Prioritized change plan", detail: "Improvements ordered by business value, risk, and dependency.", icon: FileCheck2 },
  { title: "Controlled delivery", detail: "Small reviewable changes with regression and release checks.", icon: GitPullRequest },
];

const fullStackLayers = [
  { number: "01", title: "Experience", detail: "User workflow and interface", icon: MonitorSmartphone },
  { number: "02", title: "Frontend", detail: "State, validation, interaction", icon: PanelTop },
  { number: "03", title: "Backend", detail: "Rules, security, APIs", icon: ServerCog },
  { number: "04", title: "Data", detail: "Models and integrations", icon: Database },
  { number: "05", title: "Delivery", detail: "Deploy, observe, support", icon: CloudCog },
];

const fullStackConcerns = [
  { title: "User experience", detail: "Interfaces reflect real workflows, permissions, and system state.", icon: MonitorSmartphone },
  { title: "Business behavior", detail: "Backend rules and API contracts stay aligned with the interface.", icon: Workflow },
  { title: "Data and services", detail: "Models, integrations, and failure paths support reliable operation.", icon: PlugZap },
  { title: "Production delivery", detail: "Deployment, monitoring, and support are part of the same design.", icon: CloudCog },
];

const fullStackOutputs = [
  { title: "Consistent workflows", detail: "Frontend states and backend rules describe the same product behavior.", icon: CheckCircle2 },
  { title: "Fewer handoffs", detail: "Cross-layer decisions move without ownership gaps or translation loss.", icon: GitBranch },
  { title: "One product owner", detail: "A single technical path remains accountable through production.", icon: Users },
];

const integrationStages = [
  { number: "01", title: "Connect", detail: "Authentication and provider contracts", icon: PlugZap },
  { number: "02", title: "Validate", detail: "Payloads, permissions, business rules", icon: ShieldCheck },
  { number: "03", title: "Process", detail: "Idempotent actions and safe retries", icon: RefreshCw },
  { number: "04", title: "Observe", detail: "Status, references, logs, alerts", icon: Activity },
  { number: "05", title: "Recover", detail: "Fallback and support workflows", icon: Wrench },
];

const integrationSystems = [
  { title: "Payments", detail: "Checkout and webhook events", icon: PackageCheck },
  { title: "Messaging", detail: "WhatsApp, email, notifications", icon: MessageSquareText },
  { title: "Data", detail: "Mapping, validation, persistence", icon: Database },
  { title: "Operations", detail: "Logs, retries, and alerts", icon: Activity },
];

const integrationOutputs = [
  { title: "Reliable boundaries", detail: "Authentication, validation, and failure handling are designed around each provider.", icon: ShieldCheck },
  { title: "Traceable outcomes", detail: "Provider references and processing status remain visible when support needs them.", icon: Activity },
  { title: "Recovery paths", detail: "Retries, fallbacks, and manual handling protect important business workflows.", icon: RefreshCw },
];

const timelineStages = [
  { number: "01", title: "Scope", detail: "Goals, assumptions, priorities", icon: ClipboardCheck },
  { number: "02", title: "Sequence", detail: "Dependencies and milestones", icon: Milestone },
  { number: "03", title: "Build", detail: "Reviewable product increments", icon: Code2 },
  { number: "04", title: "Quality", detail: "Review, test, and refine", icon: TestTube2 },
  { number: "05", title: "Release", detail: "Launch and support handover", icon: Rocket },
];

const timelineSignals = [
  { title: "Milestone", detail: "A reviewable piece of product", icon: Milestone },
  { title: "Dependency", detail: "A decision that unlocks the next step", icon: GitBranch },
  { title: "Risk", detail: "A concern surfaced while options remain", icon: ShieldCheck },
  { title: "Release", detail: "A verified production outcome", icon: Rocket },
];

const timelineOutputs = [
  { title: "Practical estimates", detail: "Timing follows confirmed scope, dependencies, and review cycles.", icon: CalendarClock },
  { title: "Early risk signals", detail: "Blockers are visible before they become last-minute release pressure.", icon: Activity },
  { title: "Release confidence", detail: "Review and quality checks are part of delivery, not an afterthought.", icon: CheckCircle2 },
];

const kickoffStages = [
  { number: "01", title: "Share", detail: "Goal, users, and current context", icon: MessageSquareText },
  { number: "02", title: "Clarify", detail: "Questions, constraints, priority", icon: Search },
  { number: "03", title: "Shape", detail: "Scope, approach, next steps", icon: Compass },
  { number: "04", title: "Agree", detail: "Milestones and responsibilities", icon: Handshake },
  { number: "05", title: "Start", detail: "The first build decision", icon: Rocket },
];

const kickoffChecklist = [
  { title: "Product goal", detail: "What should become easier or possible?", icon: Compass },
  { title: "Target users", detail: "Who will use it, and in what context?", icon: Users },
  { title: "Current material", detail: "Designs, code, examples, or references", icon: FileCheck2 },
  { title: "Desired direction", detail: "Priority, timing, and next conversation", icon: Milestone },
];

const kickoffOutputs = [
  { title: "A clear first step", detail: "The next decision becomes concrete and easy to act on.", icon: ArrowUpRight },
  { title: "Useful questions", detail: "Unknowns surface before they turn into rework or hidden scope.", icon: Search },
  { title: "A mutual plan", detail: "Scope, milestones, and responsibilities are visible to both sides.", icon: Handshake },
];

type FaqDetailId =
  | "idea-to-production"
  | "technology-stack"
  | "client-process"
  | "existing-codebase"
  | "full-stack"
  | "integrations"
  | "delivery"
  | "start-project";

const detailMeta: Record<FaqDetailId, { index: string; label: string; titleId: string }> = {
  "idea-to-production": { index: "FAQ 01", label: "Product Delivery Blueprint", titleId: "idea-delivery-title" },
  "technology-stack": { index: "FAQ 02", label: "Technology Decision Map", titleId: "technology-detail-title" },
  "client-process": { index: "FAQ 03", label: "Collaboration Workflow", titleId: "collaboration-detail-title" },
  "existing-codebase": { index: "FAQ 04", label: "Existing System Assessment", titleId: "codebase-detail-title" },
  "full-stack": { index: "FAQ 05", label: "Full-Stack System Map", titleId: "fullstack-detail-title" },
  integrations: { index: "FAQ 06", label: "Integration Reliability Map", titleId: "integrations-detail-title" },
  delivery: { index: "FAQ 07", label: "Delivery Timeline System", titleId: "delivery-detail-title" },
  "start-project": { index: "FAQ 08", label: "Project Kickoff Path", titleId: "kickoff-detail-title" },
};

export function FaqExperience() {
  const reduceMotion = useReducedMotion();
  const experienceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(experienceRef, { margin: "220px 0px" });
  const motionPaused = reduceMotion || !isInView;
  const [openItem, setOpenItem] = useState<string | null>(faqItems[0].id);
  const [detailOpen, setDetailOpen] = useState<FaqDetailId | null>(null);
  const expandButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeDetail = detailOpen ? detailMeta[detailOpen] : null;

  useEffect(() => {
    if (!detailOpen) return;

    const previousOverflow = document.body.style.overflow;
    const expandTrigger = expandButtonRef.current;
    const dialog = document.getElementById("faq-detail-dialog");
    const focusableElements = dialog?.querySelectorAll<HTMLElement>("button, a[href]");
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetailOpen(null);
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
      <div className={`faq-experience ${isInView ? "is-visible" : "is-idle"}`} ref={experienceRef} data-in-view={isInView}>
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
              animate={motionPaused ? undefined : { rotate: 360 }}
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
                  animate={motionPaused ? undefined : { y: [0, index % 2 === 0 ? -6 : 6, 0] }}
                  transition={{ duration: 3.4 + index * 0.32, repeat: Infinity, ease: "easeInOut", delay: index * -0.45 }}
                >
                  {Icon ? <Icon size={node.className === "django" ? 29 : 27} /> : <b>{node.text}</b>}
                </motion.span>
              );
            })}
            <motion.span
              className="faq-orbit-core"
              animate={motionPaused ? undefined : {
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
            const hasExpandedDetail = index < 8;
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
                      <div className={`faq-answer-content${hasExpandedDetail ? " is-enhanced" : ""}`}>
                        <div className="faq-answer-copy-row">
                          <p>{item.answer}</p>
                          {hasExpandedDetail && (
                            <button
                              className="faq-answer-expand"
                              type="button"
                              aria-label={`Expand details for: ${item.question}`}
                              aria-haspopup="dialog"
                              aria-controls="faq-detail-dialog"
                              title="Open full visual explanation"
                              onClick={(event) => {
                                expandButtonRef.current = event.currentTarget;
                                setDetailOpen(item.id as FaqDetailId);
                              }}
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

                        {item.id === "technology-stack" && (
                          <div className="faq-answer-mini-flow is-technology" aria-label="Technology architecture layers">
                            {technologyLayers.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "client-process" && (
                          <div className="faq-answer-mini-flow is-collaboration" aria-label="Client collaboration stages">
                            {collaborationStages.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "existing-codebase" && (
                          <div className="faq-answer-mini-flow is-codebase" aria-label="Existing codebase improvement stages">
                            {codebaseStages.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "full-stack" && (
                          <div className="faq-answer-mini-flow is-fullstack" aria-label="Full-stack system layers">
                            {fullStackLayers.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "integrations" && (
                          <div className="faq-answer-mini-flow is-integrations" aria-label="Third-party integration controls">
                            {integrationStages.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "delivery" && (
                          <div className="faq-answer-mini-flow is-delivery" aria-label="Project delivery stages">
                            {timelineStages.map(({ title, icon: Icon }) => (
                              <span key={title}>
                                <i><Icon size={13} /></i>
                                <b>{title}</b>
                              </span>
                            ))}
                          </div>
                        )}

                        {item.id === "start-project" && (
                          <div className="faq-answer-mini-flow is-kickoff" aria-label="Project kickoff stages">
                            {kickoffStages.map(({ title, icon: Icon }) => (
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
          {detailOpen && activeDetail && (
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
              aria-label="Close expanded FAQ details"
              onClick={() => setDetailOpen(null)}
            />
            <motion.section
              className="faq-detail-modal"
              id="faq-detail-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={activeDetail.titleId}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.965, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975, y: 16 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="faq-detail-modal-header">
                <div>
                  <span><Network size={14} />{activeDetail.index}</span>
                  <strong>{activeDetail.label}</strong>
                </div>
                <button
                  type="button"
                  ref={closeButtonRef}
                  aria-label="Close expanded FAQ details"
                  title="Close details"
                  onClick={() => setDetailOpen(null)}
                >
                  <X size={22} />
                </button>
              </header>

              <div className="faq-detail-modal-scroll">
                <div className="faq-detail-modal-inner">
                  {detailOpen === "idea-to-production" && (
                    <>
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
                          animate={motionPaused ? undefined : { scale: [1, 1.035, 1] }}
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
                          animate={motionPaused ? undefined : { boxShadow: ["0 0 0 rgba(44,216,131,0)", "0 0 24px rgba(44,216,131,.24)", "0 0 0 rgba(44,216,131,0)"] }}
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
                    </>
                  )}

                  {detailOpen === "technology-stack" && (
                    <>
                      <section className="faq-detail-hero faq-technology-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />Architecture before tooling</span>
                          <h2 id="technology-detail-title">The stack follows the product, not the trend.</h2>
                          <p>I specialize in a modern Python and TypeScript stack, but technology selection starts with your workflows, integrations, operational constraints, and future ownership. The goal is a system that is capable without being unnecessarily complex.</p>
                          <div className="faq-detail-principles" aria-label="Technology selection principles">
                            <span><CheckCircle2 size={15} />Proven production tools</span>
                            <span><CheckCircle2 size={15} />Fit existing systems</span>
                            <span><CheckCircle2 size={15} />Optimize for maintainability</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-technology-map"
                          aria-label="Technology architecture map"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Technology architecture</span>
                            <strong><i />Fit analysis active</strong>
                          </header>
                          <div className="faq-technology-stack">
                            <motion.div
                              className="faq-technology-brief"
                              animate={motionPaused ? undefined : { scale: [1, 1.025, 1] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Search size={20} />
                              <div><b>Product requirements</b><small>Workflow, risk, ownership, scale</small></div>
                            </motion.div>
                            <div className="faq-technology-layer-list">
                              {technologyLayers.map(({ title, detail, icon: Icon, tone }) => (
                                <article className={`is-${tone}`} key={title}>
                                  <Icon size={20} />
                                  <div><b>{title}</b><small>{detail}</small></div>
                                </article>
                              ))}
                            </div>
                            <div className="faq-technology-foundation">
                              <span><ShieldCheck size={15} />Security</span>
                              <span><TestTube2 size={15} />Testing</span>
                              <span><CloudCog size={15} />Operations</span>
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="technology-checks-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>Decision filters</span>
                            <h3 id="technology-checks-title">Four questions before choosing a tool</h3>
                          </div>
                          <p>A familiar framework is useful only when it improves delivery, operation, and long-term ownership.</p>
                        </div>
                        <div className="faq-technology-check-grid">
                          {technologyChecks.map(({ title, detail, icon: Icon }, index) => (
                            <motion.article
                              key={title}
                              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: reduceMotion ? 0 : 0.28 + index * 0.07, duration: 0.42 }}
                            >
                              <span>{String(index + 1).padStart(2, "0")}</span>
                              <Icon size={20} />
                              <h4>{title}</h4>
                              <p>{detail}</p>
                            </motion.article>
                          ))}
                        </div>
                      </section>

                      <section className="faq-detail-outcomes" aria-labelledby="technology-outcomes-title">
                        <div>
                          <span>What this protects</span>
                          <h3 id="technology-outcomes-title">A stack your product can grow with.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {technologyOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Technology%20consultation">
                          Discuss your architecture
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "client-process" && (
                    <>
                      <section className="faq-detail-hero faq-collaboration-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />No black-box development</span>
                          <h2 id="collaboration-detail-title">You always know what is moving and what ships next.</h2>
                          <p>I turn the project into visible milestones, demonstrate working progress, and keep decisions close to the work they affect. You receive enough context to make confident product decisions without managing the engineering day to day.</p>
                          <div className="faq-detail-principles" aria-label="Client collaboration principles">
                            <span><CheckCircle2 size={15} />One accountable contact</span>
                            <span><CheckCircle2 size={15} />Working milestone demos</span>
                            <span><CheckCircle2 size={15} />Decisions recorded clearly</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-collaboration-board"
                          aria-label="Client collaboration workflow"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Collaboration workspace</span>
                            <strong><i />Milestone in progress</strong>
                          </header>
                          <div className="faq-collaboration-map">
                            <div className="faq-collaboration-client">
                              <span><Users size={20} /></span>
                              <div><b>Client direction</b><small>Goals, feedback, approvals</small></div>
                            </div>
                            <div className="faq-collaboration-cycle">
                              <header><span>Current build cycle</span><strong>02 / 04</strong></header>
                              <div>
                                <span className="is-complete"><CheckCircle2 size={17} /><b>Plan</b><small>Aligned</small></span>
                                <motion.span
                                  className="is-active"
                                  animate={motionPaused ? undefined : { borderColor: ["rgba(124,85,235,.55)", "rgba(87,140,255,.9)", "rgba(124,85,235,.55)"] }}
                                  transition={{ duration: 2.6, repeat: Infinity }}
                                ><Code2 size={17} /><b>Build</b><small>In progress</small></motion.span>
                                <span><MonitorSmartphone size={17} /><b>Demo</b><small>Scheduled</small></span>
                                <span><MessageSquareText size={17} /><b>Decide</b><small>Next action</small></span>
                              </div>
                            </div>
                            <div className="faq-collaboration-loop">
                              <RefreshCw size={17} />
                              <span><b>Feedback loop</b><small>Review, decide, continue</small></span>
                              <i /><i /><i />
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="collaboration-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>Working rhythm</span>
                            <h3 id="collaboration-process-title">Five visible collaboration stages</h3>
                          </div>
                          <p>The process creates deliberate moments for your input without turning your calendar into a project-management tool.</p>
                        </div>
                        <div className="faq-detail-stage-grid faq-collaboration-stage-grid">
                          {collaborationStages.map(({ number, title, detail, icon: Icon }, index) => (
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

                      <section className="faq-detail-outcomes" aria-labelledby="collaboration-outcomes-title">
                        <div>
                          <span>What you experience</span>
                          <h3 id="collaboration-outcomes-title">Clear ownership without constant supervision.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {collaborationOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Project%20collaboration%20enquiry">
                          Start a conversation
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "existing-codebase" && (
                    <>
                      <section className="faq-detail-hero faq-codebase-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />Understand before changing</span>
                          <h2 id="codebase-detail-title">Improve the system without losing what already works.</h2>
                          <p>I begin by running the product, tracing its critical workflows, and mapping the architecture around real behavior. Improvements then move through small reviewable changes, with regression protection and release checks around the areas the business already depends on.</p>
                          <div className="faq-detail-principles" aria-label="Existing codebase principles">
                            <span><CheckCircle2 size={15} />Behavior before assumptions</span>
                            <span><CheckCircle2 size={15} />Risk-prioritized changes</span>
                            <span><CheckCircle2 size={15} />Incremental release path</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-codebase-board"
                          aria-label="Existing codebase assessment map"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>System assessment</span>
                            <strong><i />Read-only audit active</strong>
                          </header>
                          <div className="faq-codebase-map">
                            <motion.div
                              className="faq-codebase-source"
                              animate={motionPaused ? undefined : { scale: [1, 1.025, 1] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Braces size={21} />
                              <div><b>Existing application</b><small>Working behavior, history, constraints</small></div>
                            </motion.div>
                            <div className="faq-codebase-audit-grid">
                              {codebaseAuditAreas.map(({ title, detail, icon: Icon }, index) => (
                                <article key={title}>
                                  <span>{String(index + 1).padStart(2, "0")}</span>
                                  <Icon size={19} />
                                  <div><b>{title}</b><small>{detail}</small></div>
                                </article>
                              ))}
                            </div>
                            <div className="faq-codebase-change-lane">
                              <span><ShieldCheck size={16} /><b>Baseline protected</b></span>
                              <i /><i /><i />
                              <span><GitPullRequest size={16} /><b>Controlled change</b></span>
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="codebase-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>Safe improvement path</span>
                            <h3 id="codebase-process-title">Five stages before a confident release</h3>
                          </div>
                          <p>The sequence limits assumptions early and keeps every later change small enough to review and verify.</p>
                        </div>
                        <div className="faq-detail-stage-grid faq-codebase-stage-grid">
                          {codebaseStages.map(({ number, title, detail, icon: Icon }, index) => (
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

                      <section className="faq-detail-outcomes" aria-labelledby="codebase-outcomes-title">
                        <div>
                          <span>What you receive</span>
                          <h3 id="codebase-outcomes-title">A practical improvement plan, not a rewrite reflex.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {codebaseOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Existing%20codebase%20assessment">
                          Request a codebase review
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "full-stack" && (
                    <>
                      <section className="faq-detail-hero faq-fullstack-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />One connected product system</span>
                          <h2 id="fullstack-detail-title">One product journey, from interface to infrastructure.</h2>
                          <p>I work across the complete application so the user experience, API contracts, business rules, data model, integrations, and production environment support the same product decisions. That reduces handoffs and prevents one layer from surprising another.</p>
                          <div className="faq-detail-principles" aria-label="Full-stack delivery principles">
                            <span><CheckCircle2 size={15} />Shared behavior across layers</span>
                            <span><CheckCircle2 size={15} />Security at every boundary</span>
                            <span><CheckCircle2 size={15} />Production included in design</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-fullstack-board"
                          aria-label="Full-stack application system map"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Connected application</span>
                            <strong><i />All layers online</strong>
                          </header>
                          <div className="faq-fullstack-map">
                            <motion.div
                              className="faq-fullstack-entry"
                              animate={motionPaused ? undefined : { scale: [1, 1.025, 1] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <Users size={20} />
                              <div><b>User workflow</b><small>Need, action, feedback</small></div>
                            </motion.div>
                            <div className="faq-fullstack-layer-grid">
                              {fullStackLayers.slice(1, 4).map(({ title, detail, icon: Icon }) => (
                                <article key={title}>
                                  <Icon size={21} />
                                  <b>{title}</b>
                                  <small>{detail}</small>
                                </article>
                              ))}
                              <span className="faq-fullstack-contract"><Network size={15} />Shared contracts</span>
                            </div>
                            <div className="faq-fullstack-release">
                              <CloudCog size={18} />
                              <div><b>Production delivery</b><small>Deploy, observe, support</small></div>
                              <i /><i /><i />
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="fullstack-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>End-to-end ownership</span>
                            <h3 id="fullstack-process-title">One decision across every layer</h3>
                          </div>
                          <p>Each technical layer has different responsibilities, but all of them must preserve the same product behavior.</p>
                        </div>
                        <div className="faq-technology-check-grid faq-fullstack-concern-grid">
                          {fullStackConcerns.map(({ title, detail, icon: Icon }, index) => (
                            <motion.article
                              key={title}
                              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: reduceMotion ? 0 : 0.28 + index * 0.07, duration: 0.42 }}
                            >
                              <span>{String(index + 1).padStart(2, "0")}</span>
                              <Icon size={20} />
                              <h4>{title}</h4>
                              <p>{detail}</p>
                            </motion.article>
                          ))}
                        </div>
                      </section>

                      <section className="faq-detail-outcomes" aria-labelledby="fullstack-outcomes-title">
                        <div>
                          <span>What this creates</span>
                          <h3 id="fullstack-outcomes-title">A coherent product with fewer ownership gaps.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {fullStackOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Full-stack%20product%20enquiry">
                          Discuss your product system
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "integrations" && (
                    <>
                      <section className="faq-detail-hero faq-integrations-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />Reliable connections, deliberate recovery</span>
                          <h2 id="integrations-detail-title">External services should extend the product, not weaken it.</h2>
                          <p>I treat every third-party API as a system boundary. Authentication, payload validation, provider limits, duplicate events, timeouts, and support visibility are designed together so an integration remains dependable after the happy-path demo.</p>
                          <div className="faq-detail-principles" aria-label="Integration reliability principles">
                            <span><CheckCircle2 size={15} />Validated provider contracts</span>
                            <span><CheckCircle2 size={15} />Safe retries and idempotency</span>
                            <span><CheckCircle2 size={15} />Visible operational status</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-integrations-board"
                          aria-label="Third-party integration reliability map"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Integration control plane</span>
                            <strong><i />Connected and observable</strong>
                          </header>
                          <div className="faq-integrations-map">
                            <motion.div
                              className="faq-integration-source"
                              animate={motionPaused ? undefined : { scale: [1, 1.025, 1] }}
                              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <PlugZap size={20} />
                              <div><b>Product request</b><small>Identity, intent, payload</small></div>
                            </motion.div>
                            <div className="faq-integration-service-grid">
                              {integrationSystems.map(({ title, detail, icon: Icon }, index) => (
                                <motion.article
                                  key={title}
                                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: reduceMotion ? 0 : 0.32 + index * 0.07, duration: 0.4 }}
                                >
                                  <span>{String(index + 1).padStart(2, "0")}</span>
                                  <Icon size={19} />
                                  <div><b>{title}</b><small>{detail}</small></div>
                                </motion.article>
                              ))}
                            </div>
                            <div className="faq-integration-lane">
                              <span><ShieldCheck size={14} />Validated</span>
                              <i /><i /><i />
                              <span><Activity size={14} />Observed</span>
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="integrations-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>Reliability controls</span>
                            <h3 id="integrations-process-title">Five controls around every integration</h3>
                          </div>
                          <p>The provider call is only one step. The surrounding controls keep customer and business workflows trustworthy.</p>
                        </div>
                        <div className="faq-detail-stage-grid faq-integration-stage-grid">
                          {integrationStages.map(({ number, title, detail, icon: Icon }, index) => (
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

                      <section className="faq-detail-outcomes" aria-labelledby="integrations-outcomes-title">
                        <div>
                          <span>What this protects</span>
                          <h3 id="integrations-outcomes-title">Business workflows that remain explainable when providers fail.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {integrationOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Third-party%20integration%20enquiry">
                          Review an integration plan
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "delivery" && (
                    <>
                      <section className="faq-detail-hero faq-timeline-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />Milestones with visible evidence</span>
                          <h2 id="delivery-detail-title">Timelines built around decisions, not optimistic guesses.</h2>
                          <p>A useful schedule begins after the important scope and dependencies are understood. I organize delivery into reviewable milestones, make risks visible early, and include feedback and quality checks in the plan instead of squeezing them in before launch.</p>
                          <div className="faq-detail-principles" aria-label="Project timeline principles">
                            <span><CheckCircle2 size={15} />Evidence-based estimates</span>
                            <span><CheckCircle2 size={15} />Reviewable milestones</span>
                            <span><CheckCircle2 size={15} />Risks communicated early</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-timeline-board"
                          aria-label="Milestone-based delivery timeline"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Delivery timeline</span>
                            <strong><i />Milestone 02 in review</strong>
                          </header>
                          <div className="faq-timeline-map">
                            <div className="faq-timeline-track">
                              {timelineStages.map(({ number, title, icon: Icon }, index) => (
                                <motion.article
                                  className={index < 2 ? "is-complete" : index === 2 ? "is-active" : undefined}
                                  key={title}
                                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: reduceMotion ? 0 : 0.3 + index * 0.08, duration: 0.4 }}
                                >
                                  <span>{number}</span>
                                  <i><Icon size={18} /></i>
                                  <b>{title}</b>
                                </motion.article>
                              ))}
                            </div>
                            <div className="faq-timeline-signal-grid">
                              {timelineSignals.map(({ title, detail, icon: Icon }) => (
                                <article key={title}><Icon size={16} /><div><b>{title}</b><small>{detail}</small></div></article>
                              ))}
                            </div>
                            <div className="faq-timeline-release">
                              <CalendarClock size={17} />
                              <span><b>Next checkpoint</b><small>Working build, decisions, updated forecast</small></span>
                              <i /><i /><i />
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="timeline-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>Delivery rhythm</span>
                            <h3 id="timeline-process-title">Five stages from scope to release</h3>
                          </div>
                          <p>Every stage produces evidence for the next one, so timing can become more precise as the product becomes more real.</p>
                        </div>
                        <div className="faq-detail-stage-grid faq-timeline-stage-grid">
                          {timelineStages.map(({ number, title, detail, icon: Icon }, index) => (
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

                      <section className="faq-detail-outcomes" aria-labelledby="timeline-outcomes-title">
                        <div>
                          <span>What you can expect</span>
                          <h3 id="timeline-outcomes-title">A schedule you can understand, inspect, and act on.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {timelineOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=Project%20timeline%20enquiry">
                          Plan a delivery timeline
                          <ArrowUpRight size={17} />
                        </a>
                      </section>
                    </>
                  )}

                  {detailOpen === "start-project" && (
                    <>
                      <section className="faq-detail-hero faq-kickoff-hero">
                        <motion.div
                          className="faq-detail-copy"
                          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.16, duration: 0.5 }}
                        >
                          <span className="faq-detail-kicker"><i />A useful first conversation</span>
                          <h2 id="kickoff-detail-title">Starting a project should feel clear before it feels complicated.</h2>
                          <p>You do not need a perfect specification to begin. Share the product goal, who it serves, what already exists, and what matters most. I will turn that context into focused questions and a practical next step without forcing premature commitments.</p>
                          <div className="faq-detail-principles" aria-label="Project kickoff principles">
                            <span><CheckCircle2 size={15} />A short brief is enough</span>
                            <span><CheckCircle2 size={15} />Unknowns become questions</span>
                            <span><CheckCircle2 size={15} />Next steps stay explicit</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="faq-detail-system faq-kickoff-board"
                          aria-label="Project kickoff preparation map"
                          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.55 }}
                        >
                          <header>
                            <span>Project brief</span>
                            <strong><i />Ready for conversation</strong>
                          </header>
                          <div className="faq-kickoff-map">
                            <motion.div
                              className="faq-kickoff-message"
                              animate={motionPaused ? undefined : { y: [0, -3, 0] }}
                              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <MessageSquareText size={20} />
                              <div><b>Start with context</b><small>A few useful details, not a perfect specification</small></div>
                            </motion.div>
                            <div className="faq-kickoff-checklist">
                              {kickoffChecklist.map(({ title, detail, icon: Icon }, index) => (
                                <motion.article
                                  key={title}
                                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: reduceMotion ? 0 : 0.32 + index * 0.07, duration: 0.4 }}
                                >
                                  <span><Icon size={18} /></span>
                                  <div><b>{title}</b><small>{detail}</small></div>
                                  <CheckCircle2 size={14} />
                                </motion.article>
                              ))}
                            </div>
                            <div className="faq-kickoff-next">
                              <Handshake size={17} />
                              <span><b>Clear next step</b><small>Scope, discovery, or technical review</small></span>
                              <ArrowUpRight size={16} />
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <section className="faq-detail-process" aria-labelledby="kickoff-process-title">
                        <div className="faq-detail-section-heading">
                          <div>
                            <span>From message to momentum</span>
                            <h3 id="kickoff-process-title">Five low-friction steps to begin</h3>
                          </div>
                          <p>The first exchange turns uncertainty into a shared direction without pretending every detail is already known.</p>
                        </div>
                        <div className="faq-detail-stage-grid faq-kickoff-stage-grid">
                          {kickoffStages.map(({ number, title, detail, icon: Icon }, index) => (
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

                      <section className="faq-detail-outcomes" aria-labelledby="kickoff-outcomes-title">
                        <div>
                          <span>What the first step creates</span>
                          <h3 id="kickoff-outcomes-title">Enough clarity to move forward with confidence.</h3>
                        </div>
                        <div className="faq-detail-output-grid">
                          {kickoffOutputs.map(({ title, detail, icon: Icon }) => (
                            <article key={title}>
                              <Icon size={20} />
                              <div><strong>{title}</strong><p>{detail}</p></div>
                            </article>
                          ))}
                        </div>
                        <a href="mailto:shsagor.11s@gmail.com?subject=New%20project%20enquiry">
                          Start the conversation
                          <Send size={17} />
                        </a>
                      </section>
                    </>
                  )}
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
