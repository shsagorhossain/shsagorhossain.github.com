"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  getInsightCategory,
  insightCategories,
  insights,
  type InsightPost,
} from "@/data/insights";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const subscribeToBrowser = () => () => undefined;

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function InsightsShowcase() {
  const reduceMotion = useReducedMotion();
  const [activeInsight, setActiveInsight] = useState<InsightPost | null>(null);
  const mounted = useSyncExternalStore(subscribeToBrowser, () => true, () => false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeInsight) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveInsight(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeInsight]);

  const closeReader = () => {
    setActiveInsight(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const openReader = (insight: InsightPost, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveInsight(insight);
  };

  return (
    <>
      <motion.ul
        className="insight-category-list"
        aria-label="Insight categories"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-8%" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
      >
        {insightCategories.map((category, index) => (
          <motion.li
            className={category.id === "software-engineering" ? "is-published" : ""}
            key={category.id}
            title={category.description}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <strong>{category.label}</strong>
            <i aria-hidden="true" />
          </motion.li>
        ))}
      </motion.ul>

      <div className="insight-feature-list">
        {insights.filter((insight) => insight.featured).map((insight) => {
          const category = getInsightCategory(insight.categoryId);

          return (
            <motion.article
              className="insight-feature-card"
              key={insight.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.62, ease: "easeOut" }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="insight-cover">
                <Image src={insight.image} alt={insight.imageAlt} fill sizes="(max-width: 820px) 90vw, 45vw" />
                <div className="insight-cover-grid" aria-hidden="true"><span /><span /><span /></div>
                <span className="insight-feature-label"><BookOpen size={14} />Featured Insight</span>
                <span className="insight-cover-signal" aria-hidden="true"><i /><i /><i /></span>
              </div>

              <div className="insight-feature-copy">
                <div className="insight-meta">
                  <span>{category?.label}</span>
                  <span><Clock3 size={13} />{insight.readTime}</span>
                  <span><CalendarDays size={13} />{formatDate(insight.publishedAt)}</span>
                </div>
                <h3>{insight.title}</h3>
                <p>{insight.excerpt}</p>
                <div className="insight-tags" aria-label="Article topics">
                  {insight.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="insight-feature-footer">
                  <div><span>Written by</span><strong>{insight.author}</strong></div>
                  <button type="button" onClick={(event) => openReader(insight, event.currentTarget)}>
                    Read Insight
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {activeInsight && (
            <motion.div
              className="insight-reader-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeReader();
              }}
            >
              <motion.article
                className="insight-reader"
                role="dialog"
                aria-modal="true"
                aria-labelledby="insight-reader-title"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <header className="insight-reader-toolbar">
                  <div><BookOpen size={16} /><span>{getInsightCategory(activeInsight.categoryId)?.label}</span></div>
                  <button ref={closeButtonRef} type="button" onClick={closeReader} aria-label="Close insight">
                    <X size={20} />
                  </button>
                </header>

                <div className="insight-reader-scroll">
                  <div className="insight-reader-hero">
                    <Image src={activeInsight.image} alt="" fill sizes="(max-width: 900px) 96vw, 900px" />
                    <div className="insight-reader-title-block">
                      <div><span>{formatDate(activeInsight.publishedAt)}</span><span>{activeInsight.readTime}</span></div>
                      <h2 id="insight-reader-title">{activeInsight.title}</h2>
                    </div>
                  </div>

                  <div className="insight-reader-copy">
                    <p className="insight-reader-lead">{activeInsight.lead}</p>
                    {activeInsight.sections.map((section) => (
                      <section key={section.heading}>
                        <h3>{section.heading}</h3>
                        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        {section.points && (
                          <ul>
                            {section.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}
                          </ul>
                        )}
                      </section>
                    ))}
                    <footer>
                      <span>Written by</span>
                      <strong>{activeInsight.author}</strong>
                    </footer>
                  </div>
                </div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
