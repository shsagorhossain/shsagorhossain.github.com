"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  LibraryBig,
  Pause,
  Play,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { insightCategoryIcons } from "@/components/insight-category-icons";
import {
  getInsightCategory,
  insightCategories,
  insights,
} from "@/data/insights";

const featuredInsights = insights.filter((insight) => insight.featured);
const publishedCategoryIds = new Set(featuredInsights.map((insight) => insight.categoryId));
const AUTO_ROTATE_DELAY = 3000;
const CUBE_TURN_SIDES = ["right", "bottom", "left", "top"] as const;

type CubeTurnSide = (typeof CUBE_TURN_SIDES)[number];

const cubeTurnVariants = {
  enter: (side: CubeTurnSide) => {
    const shared = { opacity: 0.24, scale: 0.95, z: -90, filter: "brightness(0.46)" };

    switch (side) {
      case "left":
        return { ...shared, rotateX: 0, rotateY: -82, x: "-18%", y: "0%", transformOrigin: "right center" };
      case "top":
        return { ...shared, rotateX: -82, rotateY: 0, x: "0%", y: "-18%", transformOrigin: "center bottom" };
      case "bottom":
        return { ...shared, rotateX: 82, rotateY: 0, x: "0%", y: "18%", transformOrigin: "center top" };
      default:
        return { ...shared, rotateX: 0, rotateY: 82, x: "18%", y: "0%", transformOrigin: "left center" };
    }
  },
  center: {
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    x: "0%",
    y: "0%",
    z: 0,
    scale: 1,
    filter: "brightness(1)",
  },
  exit: (side: CubeTurnSide) => {
    const shared = { opacity: 0.18, scale: 0.95, z: -90, filter: "brightness(0.4)" };

    switch (side) {
      case "left":
        return { ...shared, rotateX: 0, rotateY: 82, x: "18%", y: "0%", transformOrigin: "left center" };
      case "top":
        return { ...shared, rotateX: 82, rotateY: 0, x: "0%", y: "18%", transformOrigin: "center top" };
      case "bottom":
        return { ...shared, rotateX: -82, rotateY: 0, x: "0%", y: "-18%", transformOrigin: "center bottom" };
      default:
        return { ...shared, rotateX: 0, rotateY: -82, x: "-18%", y: "0%", transformOrigin: "right center" };
    }
  },
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export function InsightsShowcase() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const [turnSide, setTurnSide] = useState<CubeTurnSide>("right");
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const turnCursor = useRef(1);
  const activeInsight = featuredInsights[activeIndex] ?? featuredInsights[0];
  const category = activeInsight ? getInsightCategory(activeInsight.categoryId) : undefined;
  const shouldAutoRotate = autoPlay && !reduceMotion && !isHovered && !hasFocus;

  const markImageLoaded = useCallback((slug: string) => {
    setLoadedImages((current) => {
      if (current.has(slug)) return current;

      const next = new Set(current);
      next.add(slug);
      return next;
    });
  }, []);

  const queueCubeTurn = useCallback(() => {
    const nextSide = CUBE_TURN_SIDES[turnCursor.current % CUBE_TURN_SIDES.length];
    turnCursor.current += 1;
    setTurnSide(nextSide);
  }, []);

  const moveBy = useCallback((step: number) => {
    if (featuredInsights.length < 2) return;
    queueCubeTurn();
    setActiveIndex((current) => (current + step + featuredInsights.length) % featuredInsights.length);
  }, [queueCubeTurn]);

  const showInsight = (index: number) => {
    if (index === activeIndex) return;
    queueCubeTurn();
    setActiveIndex(index);
  };

  useEffect(() => {
    if (featuredInsights.length < 2) return;

    const frame = window.requestAnimationFrame(() => {
      setActiveIndex(Math.floor(Math.random() * featuredInsights.length));
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!shouldAutoRotate || featuredInsights.length < 2) return;

    const timer = window.setTimeout(() => moveBy(1), AUTO_ROTATE_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, moveBy, shouldAutoRotate]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const distance = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
    touchStartX.current = null;

    if (Math.abs(distance) < 46) return;
    event.preventDefault();
    moveBy(distance > 0 ? 1 : -1);
  };

  if (!activeInsight) return null;

  const activeImageLoaded = loadedImages.has(activeInsight.slug);

  return (
    <div>
      <motion.ul
        className="insight-category-list"
        aria-label="Insight categories"
        initial={reduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-8%" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
      >
        {insightCategories.map((category) => {
          const CategoryIcon = insightCategoryIcons[category.id];

          return (
            <motion.li
              className={publishedCategoryIds.has(category.id) ? "is-published" : ""}
              key={category.id}
              title={category.description}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className="insight-category-icon" aria-hidden="true">
                <CategoryIcon size={15} strokeWidth={1.8} />
              </span>
              <strong>{category.label}</strong>
              <i aria-hidden="true" />
            </motion.li>
          );
        })}
      </motion.ul>

      <div
        className={`insight-carousel${shouldAutoRotate ? "" : " is-paused"}`}
        role="region"
        aria-label="Featured insights"
        aria-roledescription="carousel"
        data-active-insight={activeInsight.slug}
        data-turn-side={turnSide}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setHasFocus(false);
          }
        }}
      >
        <div className="insight-carousel-toolbar">
          <div className="insight-carousel-buttons">
            <button
              type="button"
              disabled={Boolean(reduceMotion)}
              onClick={() => setAutoPlay((current) => !current)}
              aria-label={autoPlay ? "Pause insight rotation" : "Play insight rotation"}
              title={reduceMotion ? "Automatic rotation follows your reduced-motion setting" : autoPlay ? "Pause rotation" : "Play rotation"}
            >
              {autoPlay ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>

          <div className="insight-carousel-pages" role="group" aria-label="Choose an insight">
            {featuredInsights.map((insight, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={insight.slug}
                aria-label={`Show insight: ${insight.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                title={insight.title}
                onClick={() => showInsight(index)}
              />
            ))}
          </div>

          <Link
            className="insight-index-button"
            href="/insights/"
            aria-label="Enter the Insight Index"
          >
            <LibraryBig size={16} />
            Enter the Insight Index
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div
          className="insight-feature-list"
          aria-live={shouldAutoRotate ? "off" : "polite"}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="insight-card-viewport">
            <AnimatePresence initial={false} custom={turnSide}>
              <motion.article
                className="insight-feature-card"
                key={activeInsight.slug}
                aria-roledescription="slide"
                aria-label={`${activeIndex + 1} of ${featuredInsights.length}: ${activeInsight.title}`}
                custom={turnSide}
                variants={reduceMotion ? undefined : cubeTurnVariants}
                initial={reduceMotion ? { opacity: 0 } : "enter"}
                animate={reduceMotion ? { opacity: 1 } : "center"}
                exit={reduceMotion ? { opacity: 0 } : "exit"}
                transition={{ duration: reduceMotion ? 0.16 : 0.68, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="insight-cover-shell">
                  <Link className="insight-cover" href={`/insights/${activeInsight.slug}/`} aria-label={`Read ${activeInsight.title}`}>
                    <Image
                      className={`insight-cover-image${activeImageLoaded ? " is-loaded" : ""}`}
                      src={activeInsight.image}
                      alt={activeInsight.imageAlt}
                      fill
                      sizes="(max-width: 820px) 90vw, 45vw"
                      onLoad={() => markImageLoaded(activeInsight.slug)}
                      onError={() => markImageLoaded(activeInsight.slug)}
                    />
                    <span
                      className="insight-cover-skeleton"
                      data-loaded={activeImageLoaded}
                      data-image-skeleton="home-insight"
                      aria-hidden="true"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                    <div className="insight-cover-grid" aria-hidden="true"><span /><span /><span /></div>
                    <span className="insight-feature-label"><BookOpen size={14} />Featured Insight</span>
                    <span className="insight-cover-signal" aria-hidden="true"><i /><i /><i /></span>
                  </Link>
                </div>

                <div className="insight-feature-copy">
                  <div className="insight-meta">
                    <span>{category?.label}</span>
                    <span><Clock3 size={13} />{activeInsight.readTime}</span>
                    <span><CalendarDays size={13} />{formatDate(activeInsight.publishedAt)}</span>
                  </div>
                  <h3><Link href={`/insights/${activeInsight.slug}/`}>{activeInsight.title}</Link></h3>
                  <p>{activeInsight.excerpt}</p>
                  <div className="insight-tags" aria-label="Article topics">
                    {activeInsight.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="insight-feature-footer">
                    <div><span>Written by</span><strong>{activeInsight.author}</strong></div>
                    <Link href={`/insights/${activeInsight.slug}/`}>
                      Read Insight
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="insight-card-navigation">
            <button type="button" onClick={() => moveBy(-1)} aria-label="Show previous insight" title="Previous insight">
              <ChevronsLeft size={25} />
            </button>
            <button type="button" onClick={() => moveBy(1)} aria-label="Show next insight" title="Next insight">
              <ChevronsRight size={25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
