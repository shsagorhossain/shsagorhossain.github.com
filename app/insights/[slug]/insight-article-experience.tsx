"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Mail,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { getInsightCategory, type InsightPost } from "@/data/insights";
import styles from "./insight.module.css";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function InsightArticleExperience({ insight }: { insight: InsightPost }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState("section-1");
  const [copied, setCopied] = useState(false);
  const category = getInsightCategory(insight.categoryId);

  useEffect(() => {
    const sections = insight.sections
      .map((_, index) => document.getElementById(`section-${index + 1}`))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -64%", threshold: [0, 0.2, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [insight.sections]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div className={styles.readingProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>
          <nav aria-label="Insight navigation">
            <Link href="/insights/"><ArrowLeft size={16} />Back to insights</Link>
            <a href="mailto:shsagor.11s@gmail.com"><Mail size={16} />Let&apos;s talk</a>
          </nav>
        </div>
      </header>

      <main>
        <section className={`${styles.hero} ${styles.shell}`}>
          <motion.div
            className={styles.heroCopy}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div className={styles.eyebrow} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}>
              <BookOpen size={16} />Insight <span /> {category?.label}
            </motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              {insight.title}
            </motion.h1>
            <motion.p className={styles.excerpt} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              {insight.excerpt}
            </motion.p>
            <motion.div className={styles.heroMeta} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <span><UserRound size={14} />{insight.author}</span>
              <span><CalendarDays size={14} />{dateFormatter.format(new Date(`${insight.publishedAt}T00:00:00Z`))}</span>
              <span><Clock3 size={14} />{insight.readTime}</span>
            </motion.div>
          </motion.div>

          <motion.figure
            className={styles.heroMedia}
            initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.18, ease: "easeOut" }}
          >
            <Image src={insight.image} alt={insight.imageAlt} fill priority sizes="90vw" />
            <div className={styles.heroShade} />
            <div className={styles.signalLines} aria-hidden="true"><span /><span /><span /></div>
            <figcaption><span>Engineering insight</span><strong>{insight.tags.join(" · ")}</strong></figcaption>
          </motion.figure>
        </section>

        <div className={`${styles.articleLayout} ${styles.shell}`}>
          <aside className={styles.articleRail}>
            <div className={styles.railSticky}>
              <p>In this insight</p>
              <nav aria-label="Article contents">
                {insight.sections.map((section, index) => {
                  const id = `section-${index + 1}`;
                  return (
                    <a className={activeSection === id ? styles.active : ""} href={`#${id}`} key={section.heading}>
                      <span>{String(index + 1).padStart(2, "0")}</span>{section.heading}
                    </a>
                  );
                })}
              </nav>
              <button type="button" onClick={copyLink} aria-live="polite">
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Link copied" : "Copy article link"}
              </button>
            </div>
          </aside>

          <article className={styles.article}>
            <Reveal className={styles.leadBlock}>
              <span aria-hidden="true">01</span>
              <p>{insight.lead}</p>
            </Reveal>

            {insight.sections.map((section, index) => (
              <motion.section
                className={section.points ? styles.checklistSection : undefined}
                id={`section-${index + 1}`}
                key={section.heading}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-6% 0px -8% 0px" }}
                transition={{ duration: 0.62, ease: "easeOut" }}
              >
                <div className={styles.sectionHeading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{section.points ? "Practical review" : "Engineering note"}</small><h2>{section.heading}</h2></div>
                </div>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.visual && (
                  <motion.figure
                    className={styles.articleVisual}
                    initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.68, ease: "easeOut" }}
                  >
                    <div className={styles.articleVisualMedia}>
                      <Image src={section.visual.src} alt={section.visual.alt} fill sizes="(max-width: 820px) 90vw, 780px" />
                      <span>{section.visual.label}</span>
                      <div aria-hidden="true"><i /><i /><i /></div>
                    </div>
                    <figcaption><span>Visual note</span><p>{section.visual.caption}</p></figcaption>
                  </motion.figure>
                )}
                {section.points && (
                  <ul className={styles.checklist}>
                    {section.points.map((point) => <li key={point}><Check size={16} /><span>{point}</span></li>)}
                  </ul>
                )}
              </motion.section>
            ))}

            <Reveal className={styles.authorBlock}>
              <Image src="/sh-logo.webp" alt="" width={76} height={51} />
              <div><span>Written by</span><h2>{insight.author}</h2><p>Full Stack Developer building dependable SaaS products, operational platforms, and modern web applications.</p></div>
            </Reveal>
          </article>

          <aside className={styles.topicRail} aria-label="Article topics">
            <div>
              <span>Topics</span>
              {insight.tags.map((tag) => <strong key={tag}>{tag}</strong>)}
            </div>
          </aside>
        </div>

        <Reveal className={`${styles.closingBand} ${styles.shell}`}>
          <span className={styles.closingIcon}><MessageSquareText size={27} /></span>
          <div><p>Turn the idea into a product</p><h2>Building something that needs to work beyond the happy path?</h2></div>
          <a href="mailto:shsagor.11s@gmail.com">Start a conversation<ArrowRight size={17} /></a>
        </Reveal>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <p>Engineering insights by Sagor Hossain.</p>
          <Link href="/insights/">Back to insights</Link>
        </div>
      </footer>
    </div>
  );
}
