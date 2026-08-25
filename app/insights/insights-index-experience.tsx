"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Grid2X2,
  LibraryBig,
  List,
  LoaderCircle,
  Mail,
  Menu,
  RotateCcw,
  Search,
  SearchX,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { insightCategoryIcons } from "@/components/insight-category-icons";
import {
  getInsightCategory,
  insightCategories,
  insights,
  type InsightCategoryId,
  type InsightPost,
} from "@/data/insights";
import styles from "./insights-index.module.css";

type CategoryFilter = "all" | InsightCategoryId;
type SortMode = "newest" | "oldest" | "title" | "reading-time";
type ViewMode = "grid" | "list";

const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Projects", href: "/projects/" },
  { label: "Insights", href: "/insights/" },
  { label: "Contact", href: "/#contact" },
];
const SPOTLIGHT_STORAGE_KEY = "sagor-insights-spotlight";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function readingMinutes(insight: InsightPost) {
  return Number.parseInt(insight.readTime, 10) || 0;
}

function articleHref(insight: InsightPost) {
  return `/insights/${insight.slug}/`;
}

export function InsightsIndexExperience() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const navigationTimerRef = useRef<number | null>(null);
  const spotlightSelectionRef = useRef(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openingInsight, setOpeningInsight] = useState<string | null>(null);
  const [spotlightSlug, setSpotlightSlug] = useState<string | null>(null);
  const [spotlightReady, setSpotlightReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(() => new Set());

  const categoryCounts = useMemo(() => {
    const counts = Object.fromEntries(
      insightCategories.map((category) => [category.id, 0]),
    ) as Record<InsightCategoryId, number>;

    insights.forEach((insight) => {
      counts[insight.categoryId] += 1;
    });

    return counts;
  }, []);

  const orderedInsights = useMemo(
    () => [...insights].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt)),
    [],
  );
  const spotlightInsight = orderedInsights.find((insight) => insight.slug === spotlightSlug)
    ?? orderedInsights[0];
  const totalReadingTime = insights.reduce((total, insight) => total + readingMinutes(insight), 0);

  const visibleInsights = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = insights.filter((insight) => {
      const category = getInsightCategory(insight.categoryId);
      const matchesCategory = activeCategory === "all" || insight.categoryId === activeCategory;
      const searchableText = [
        insight.title,
        insight.excerpt,
        category?.label,
        ...insight.tags,
      ].join(" ").toLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return filtered.sort((first, second) => {
      if (sortMode === "oldest") return first.publishedAt.localeCompare(second.publishedAt);
      if (sortMode === "title") return first.title.localeCompare(second.title);
      if (sortMode === "reading-time") return readingMinutes(first) - readingMinutes(second);
      return second.publishedAt.localeCompare(first.publishedAt);
    });
  }, [activeCategory, query, sortMode]);

  const markImageLoaded = useCallback((imageKey: string) => {
    setLoadedImages((current) => {
      if (current.has(imageKey)) return current;
      const next = new Set(current);
      next.add(imageKey);
      return next;
    });
  }, []);

  useEffect(() => {
    if (spotlightSelectionRef.current || orderedInsights.length === 0) return;
    spotlightSelectionRef.current = true;

    let previousSlug: string | null = null;
    try {
      previousSlug = window.sessionStorage.getItem(SPOTLIGHT_STORAGE_KEY);
    } catch {
      previousSlug = null;
    }

    const alternatives = orderedInsights.filter((insight) => insight.slug !== previousSlug);
    const choices = alternatives.length > 0 ? alternatives : orderedInsights;
    const selectedInsight = choices[Math.floor(Math.random() * choices.length)] ?? orderedInsights[0];

    setSpotlightSlug(selectedInsight.slug);
    setSpotlightReady(true);
    try {
      window.sessionStorage.setItem(SPOTLIGHT_STORAGE_KEY, selectedInsight.slug);
    } catch {
      // The random spotlight still works when browser storage is unavailable.
    }
  }, [orderedInsights]);

  useEffect(() => {
    const resetNavigation = () => setOpeningInsight(null);
    window.addEventListener("pageshow", resetNavigation);
    return () => {
      window.removeEventListener("pageshow", resetNavigation);
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 851px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const openInsight = (event: ReactMouseEvent<HTMLAnchorElement>, insight: InsightPost) => {
    const isPrimaryClick = event.button === 0
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey;

    if (!isPrimaryClick || openingInsight) return;

    event.preventDefault();
    setOpeningInsight(insight.slug);
    navigationTimerRef.current = window.setTimeout(() => {
      window.location.assign(articleHref(insight));
    }, reduceMotion ? 0 : 340);
  };

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setSortMode("newest");
    searchRef.current?.focus();
  };

  if (!spotlightInsight) return null;

  const spotlightCategory = getInsightCategory(spotlightInsight.categoryId);
  const spotlightImageKey = `spotlight:${spotlightInsight.slug}`;
  const spotlightImageLoaded = loadedImages.has(spotlightImageKey);
  const activeCategoryData = activeCategory === "all"
    ? undefined
    : getInsightCategory(activeCategory);

  return (
    <div className={styles.page}>
      <motion.div className={styles.scrollProgress} style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <div className={styles.pageGrid} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.shell}>
          <Link className={styles.brand} href="/" aria-label="Sagor Hossain portfolio home">
            <Image src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </Link>

          <nav className={styles.desktopNav} aria-label="Insights page navigation">
            {navLinks.map((link) => (
              <Link
                className={link.label === "Insights" ? styles.activeNav : undefined}
                href={link.href}
                key={link.label}
                aria-current={link.label === "Insights" ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a className={styles.talkButton} href="mailto:shsagor.11s@gmail.com">
            Let&apos;s Talk<ArrowUpRight size={15} />
          </a>
          <button
            className={styles.menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className={styles.mobileNavLayer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
            <motion.nav
              aria-label="Mobile insights page navigation"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scaleY: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scaleY: 0.95 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.08 + index * 0.04 }}
                  key={link.label}
                >
                  <Link href={link.href} onClick={() => setMenuOpen(false)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {link.label}
                    <ArrowUpRight size={16} />
                  </Link>
                </motion.div>
              ))}
              <a href="mailto:shsagor.11s@gmail.com" onClick={() => setMenuOpen(false)}>
                <Mail size={16} />Start a conversation<ArrowRight size={16} />
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openingInsight && (
          <motion.div
            className={styles.routeStatus}
            role="status"
            aria-live="assertive"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <LoaderCircle className={styles.spinner} size={20} />
            <span><small>Opening field note</small><strong>{insights.find((insight) => insight.slug === openingInsight)?.title}</strong></span>
            <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0.01 : 0.75 }} />
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section
          className={`${styles.hero} ${styles.shell}`}
          aria-labelledby="insights-index-title"
          data-spotlight-insight={spotlightInsight.slug}
          data-spotlight-ready={spotlightReady}
        >
          <Image
            key={spotlightInsight.slug}
            className={`${styles.heroImage} ${spotlightImageLoaded ? styles.imageLoaded : ""}`}
            src={spotlightInsight.image}
            alt={spotlightInsight.imageAlt}
            fill
            priority
            sizes="90vw"
            onLoad={() => markImageLoaded(spotlightImageKey)}
            onError={() => markImageLoaded(spotlightImageKey)}
          />
          <span
            className={`${styles.imageSkeleton} ${styles.heroImageSkeleton}`}
            data-loaded={spotlightImageLoaded}
            data-image-skeleton="spotlight"
            aria-hidden="true"
          />
          <div className={styles.heroShade} />
          <div className={styles.heroSignals} aria-hidden="true"><span /><span /><span /><i /></div>

          <motion.div
            className={styles.heroCopy}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.075 } } }}
          >
            <motion.span className={styles.eyebrow} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
              <LibraryBig size={15} />Engineering field notes
            </motion.span>
            <motion.h1 id="insights-index-title" variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
              Insights <span>Index</span>
            </motion.h1>
            <motion.p className={styles.heroIntro} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
              Practical writing shaped by designing, shipping, and operating software beyond the happy path.
            </motion.p>

            <motion.div className={styles.latestStory} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
              <span><Sparkles size={14} />Index spotlight</span>
              <h2>{spotlightInsight.title}</h2>
              <div>
                <span>{spotlightCategory?.label}</span>
                <span><CalendarDays size={13} />{formatDate(spotlightInsight.publishedAt)}</span>
                <span><Clock3 size={13} />{spotlightInsight.readTime}</span>
              </div>
            </motion.div>

            <motion.div className={styles.heroActions} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
              <a href={articleHref(spotlightInsight)} onClick={(event) => openInsight(event, spotlightInsight)}>
                Read spotlight<ArrowUpRight size={16} />
              </a>
              <a href="#library">Browse the index<ArrowRight size={16} /></a>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroMetrics}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
          >
            <div><strong>{String(insights.length).padStart(2, "0")}</strong><span>Published notes</span></div>
            <div><strong>{String(insightCategories.length).padStart(2, "0")}</strong><span>Editorial lanes</span></div>
            <div><strong>{totalReadingTime}</strong><span>Minutes of reading</span></div>
          </motion.div>
        </section>

        <section className={`${styles.library} ${styles.shell}`} id="library" aria-labelledby="library-title">
          <motion.header
            className={styles.libraryHeading}
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
          >
            <div><span>Knowledge archive</span><h2 id="library-title">Browse Every Insight</h2></div>
            <p>Filter the archive by discipline, search for a problem, or change how the notes are arranged.</p>
          </motion.header>

          <div className={styles.workspace}>
            <aside className={styles.categoryRail} aria-label="Filter insights by category">
              <div className={styles.categoryRailHeading}>
                <span>Editorial lanes</span>
                <strong>{insightCategories.length}</strong>
              </div>
              <button
                className={activeCategory === "all" ? styles.activeCategory : undefined}
                type="button"
                aria-pressed={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
              >
                <span><LibraryBig size={16} /></span>
                <strong>All insights</strong>
                <small>{insights.length}</small>
              </button>
              {insightCategories.map((category) => {
                const Icon = insightCategoryIcons[category.id];
                const count = categoryCounts[category.id];
                const isActive = activeCategory === category.id;

                return (
                  <button
                    className={isActive ? styles.activeCategory : undefined}
                    type="button"
                    key={category.id}
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category.id)}
                    title={category.description}
                  >
                    <span><Icon size={16} strokeWidth={1.8} /></span>
                    <strong>{category.label}</strong>
                    <small>{count}</small>
                  </button>
                );
              })}
              <div className={styles.categoryContext}>
                <span>{activeCategoryData ? "Selected lane" : "Full archive"}</span>
                <p>{activeCategoryData?.description ?? "All published notes across the engineering index."}</p>
              </div>
            </aside>

            <div className={styles.indexPanel} data-view-mode={viewMode} data-result-count={visibleInsights.length}>
              <div className={styles.toolbar}>
                <label className={styles.searchField}>
                  <span className={styles.srOnly}>Search insights</span>
                  <Search size={17} />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    placeholder="Search titles, topics, or problems"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query && <button type="button" aria-label="Clear insight search" onClick={() => setQuery("")}><X size={15} /></button>}
                </label>

                <label className={styles.sortControl}>
                  <span>Sort</span>
                  <select aria-label="Sort insights" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A-Z</option>
                    <option value="reading-time">Shortest read</option>
                  </select>
                </label>

                <div className={styles.viewControl} role="group" aria-label="Insight layout">
                  <button className={viewMode === "grid" ? styles.activeView : undefined} type="button" aria-label="Grid view" title="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><Grid2X2 size={16} /></button>
                  <button className={viewMode === "list" ? styles.activeView : undefined} type="button" aria-label="List view" title="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><List size={17} /></button>
                </div>
              </div>

              <div className={styles.resultsBar} aria-live="polite">
                <span><i />{visibleInsights.length} {visibleInsights.length === 1 ? "note" : "notes"} in view</span>
                {(query || activeCategory !== "all" || sortMode !== "newest") && (
                  <button type="button" onClick={resetFilters}><RotateCcw size={13} />Reset index</button>
                )}
              </div>

              <motion.div className={`${styles.articleGrid} ${styles[viewMode]}`} layout>
                <AnimatePresence mode="popLayout">
                  {visibleInsights.map((insight, index) => {
                    const category = getInsightCategory(insight.categoryId);
                    const CategoryIcon = insightCategoryIcons[insight.categoryId];
                    const isOpening = openingInsight === insight.slug;
                    const cardImageKey = `card:${insight.slug}`;
                    const cardImageLoaded = loadedImages.has(cardImageKey);

                    return (
                      <motion.article
                        className={`${styles.articleCard} ${isOpening ? styles.opening : ""}`}
                        key={insight.slug}
                        layout
                        initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ duration: 0.42, delay: Math.min(index * 0.045, 0.16) }}
                      >
                        <a className={styles.articleMedia} href={articleHref(insight)} onClick={(event) => openInsight(event, insight)} aria-label={`Read ${insight.title}`}>
                          <Image
                            className={cardImageLoaded ? styles.imageLoaded : ""}
                            src={insight.image}
                            alt={insight.imageAlt}
                            fill
                            sizes="(max-width: 720px) 90vw, (max-width: 1100px) 58vw, 34vw"
                            onLoad={() => markImageLoaded(cardImageKey)}
                            onError={() => markImageLoaded(cardImageKey)}
                          />
                          <span
                            className={`${styles.imageSkeleton} ${styles.cardImageSkeleton}`}
                            data-loaded={cardImageLoaded}
                            data-image-skeleton="card"
                            aria-hidden="true"
                          />
                          <span className={styles.articleCategory}><CategoryIcon size={13} />{category?.label}</span>
                          <span className={styles.articleAction} aria-hidden="true">{isOpening ? <LoaderCircle className={styles.spinner} size={17} /> : <ArrowUpRight size={17} />}</span>
                          <div className={styles.cardSignals} aria-hidden="true"><i /><i /><i /></div>
                          {isOpening && <span className={styles.mediaLoading}><LoaderCircle className={styles.spinner} size={23} />Opening note</span>}
                        </a>

                        <div className={styles.articleBody}>
                          <div className={styles.articleMeta}>
                            <span><CalendarDays size={13} />{formatDate(insight.publishedAt)}</span>
                            <span><Clock3 size={13} />{insight.readTime}</span>
                          </div>
                          <h3><a href={articleHref(insight)} onClick={(event) => openInsight(event, insight)}>{insight.title}</a></h3>
                          <p>{insight.excerpt}</p>
                          <div className={styles.articleTags} aria-label={`${insight.title} topics`}>
                            {insight.tags.map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                          <footer>
                            <a href={articleHref(insight)} onClick={(event) => openInsight(event, insight)}>Read Insight<ArrowRight size={15} /></a>
                          </footer>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {visibleInsights.length === 0 && (
                <motion.div className={styles.emptyState} initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <span><SearchX size={25} /></span>
                  <div><h3>No notes found in this lane</h3><p>Try another category or clear the current search to reopen the full archive.</p></div>
                  <button type="button" onClick={resetFilters}><RotateCcw size={15} />Reset index</button>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <motion.section
          className={`${styles.closingBand} ${styles.shell}`}
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
        >
          <span><BookOpen size={25} /></span>
          <div><p>From the index to production</p><h2>Need an engineering partner for the next hard problem?</h2></div>
          <a href="mailto:shsagor.11s@gmail.com">Start a conversation<ArrowUpRight size={16} /></a>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <Image src="/sh-logo.webp" alt="" width={64} height={43} />
          <p>Engineering insights by Sagor Hossain.</p>
          <Link href="/">Back to portfolio</Link>
        </div>
      </footer>
    </div>
  );
}
