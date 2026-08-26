"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  Clock3,
  LibraryBig,
  Pause,
  Play,
  Search,
  Sparkles,
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
const CURATED_INSIGHT_COUNT = 5;
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

function chooseRandomInsights() {
  const shuffled = [...featuredInsights];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.min(CURATED_INSIGHT_COUNT, shuffled.length));
}

export function InsightsShowcase() {
  const reduceMotion = useReducedMotion();
  const [curatedInsights, setCuratedInsights] = useState(() => featuredInsights.slice(0, CURATED_INSIGHT_COUNT));
  const [selectionReady, setSelectionReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());
  const [turnSide, setTurnSide] = useState<CubeTurnSide>("right");
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const turnCursor = useRef(1);
  const totalSlides = curatedInsights.length + 1;
  const isIndexSlide = activeIndex === curatedInsights.length;
  const activeInsight = isIndexSlide ? undefined : curatedInsights[activeIndex];
  const category = activeInsight ? getInsightCategory(activeInsight.categoryId) : undefined;
  const shouldAutoRotate = autoPlay && !reduceMotion && !isHovered && !hasFocus && !isIndexSlide;

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
    if (totalSlides < 2) return;
    queueCubeTurn();
    setActiveIndex((current) => (current + step + totalSlides) % totalSlides);
  }, [queueCubeTurn, totalSlides]);

  const showSlide = (index: number) => {
    if (index === activeIndex) return;
    queueCubeTurn();
    setActiveIndex(index);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCuratedInsights(chooseRandomInsights());
      setActiveIndex(0);
      setSelectionReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!shouldAutoRotate || totalSlides < 2) return;

    const timer = window.setTimeout(() => moveBy(1), AUTO_ROTATE_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, moveBy, shouldAutoRotate, totalSlides]);

  const handleAutoPlayControl = () => {
    if (isIndexSlide) {
      queueCubeTurn();
      setActiveIndex(0);
      setAutoPlay(true);
      return;
    }

    setAutoPlay((current) => !current);
  };

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

  const activeImageLoaded = activeInsight ? loadedImages.has(activeInsight.slug) : false;

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

      {selectionReady ? <div
        className={`insight-carousel${shouldAutoRotate ? "" : " is-paused"}`}
        role="region"
        aria-label="Featured insights"
        aria-roledescription="carousel"
        data-active-insight={activeInsight?.slug ?? "insights-index"}
        data-curated-insights={curatedInsights.map((insight) => insight.slug).join(",")}
        data-slide-kind={isIndexSlide ? "index" : "insight"}
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
              onClick={handleAutoPlayControl}
              aria-label={isIndexSlide ? "Replay insight selection" : autoPlay ? "Pause insight rotation" : "Play insight rotation"}
              title={reduceMotion ? "Automatic rotation follows your reduced-motion setting" : isIndexSlide ? "Replay this selection" : autoPlay ? "Pause rotation" : "Play rotation"}
            >
              {autoPlay && !isIndexSlide ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>

          <div className="insight-carousel-pages" role="group" aria-label="Choose an insight">
            {curatedInsights.map((insight, index) => (
              <button
                className={index === activeIndex ? "is-active" : ""}
                type="button"
                key={insight.slug}
                aria-label={`Show insight: ${insight.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                title={insight.title}
                onClick={() => showSlide(index)}
              />
            ))}
            <button
              className={isIndexSlide ? "is-active is-index" : "is-index"}
              type="button"
              aria-label="Show the Insights Index invitation"
              aria-current={isIndexSlide ? "true" : undefined}
              title="Continue to the complete Insights Index"
              onClick={() => showSlide(curatedInsights.length)}
            />
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
                className={`insight-carousel-slide ${isIndexSlide ? "insight-index-end-card" : "insight-feature-card"}`}
                key={activeInsight?.slug ?? "insights-index"}
                aria-roledescription="slide"
                aria-label={`${activeIndex + 1} of ${totalSlides}: ${activeInsight?.title ?? "Continue to the complete Insights Index"}`}
                custom={turnSide}
                variants={reduceMotion ? undefined : cubeTurnVariants}
                initial={reduceMotion ? { opacity: 0 } : "enter"}
                animate={reduceMotion ? { opacity: 1 } : "center"}
                exit={reduceMotion ? { opacity: 0 } : "exit"}
                transition={{ duration: reduceMotion ? 0.16 : 0.68, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeInsight ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="insight-index-end-backdrop" aria-hidden="true"><i /><i /><i /></div>
                    <div className="insight-index-end-header">
                      <span><Sparkles size={13} />End of curated selection</span>
                      <strong>05 / 05</strong>
                    </div>

                    <div className="insight-index-end-body">
                      <div className="insight-index-end-portal" aria-hidden="true">
                        <motion.div
                          className="insight-index-end-art"
                          animate={reduceMotion ? undefined : { scale: [1, 1.035, 1], rotate: [0, 0.8, 0] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <Image src="/insights/insights-index-archive-portal.webp" alt="" fill sizes="(max-width: 640px) 220px, 250px" />
                        </motion.div>
                        <motion.div
                          className="insight-index-end-orbit"
                          animate={reduceMotion ? undefined : { rotate: 360 }}
                          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                        >
                          <span><BookMarked size={15} /></span>
                          <span><Search size={15} /></span>
                          <span><Sparkles size={15} /></span>
                        </motion.div>
                        <span className="insight-index-end-seal"><LibraryBig size={14} />Selection complete</span>
                      </div>

                      <div className="insight-index-end-copy">
                        <div className="insight-index-end-kicker"><BookOpen size={14} /><span>Continue from the index</span></div>
                        <h3>This five-note selection ends here.</h3>
                        <p>
                          The complete Insights Index is ready when you are. Browse all {insights.length} engineering
                          notes by category, topic, and reading time.
                        </p>
                        <div className="insight-index-end-stats" aria-label="Insights Index summary">
                          <div><strong>{String(insights.length).padStart(2, "0")}</strong><span>Published notes</span></div>
                          <div><strong>{String(insightCategories.length).padStart(2, "0")}</strong><span>Editorial lanes</span></div>
                          <div><strong>01</strong><span>Complete index</span></div>
                        </div>
                        <Link className="insight-index-end-action" href="/insights/">
                          Enter the Insights Index
                          <ArrowUpRight size={17} />
                        </Link>
                      </div>
                    </div>

                    <span className="insight-index-end-progress" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                  </>
                )}
              </motion.article>
            </AnimatePresence>
          </div>

          {!isIndexSlide && (
            <div className="insight-card-navigation">
              <button type="button" onClick={() => moveBy(-1)} aria-label="Show previous insight" title="Previous insight">
                <ChevronsLeft size={25} />
              </button>
              <button type="button" onClick={() => moveBy(1)} aria-label="Show next insight" title="Next insight">
                <ChevronsRight size={25} />
              </button>
            </div>
          )}
        </div>
      </div> : <div className="insight-carousel-initializing" aria-hidden="true"><i /><i /></div>}
    </div>
  );
}
