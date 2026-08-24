"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeft, ChevronsRight, MapPin, Pause, Play, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const AUTO_SCROLL_SPEED = 20;
const AUTO_RESUME_DELAY = 2600;

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  project?: string;
  featured?: boolean;
  showLocation?: boolean;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Working with Sagor on Zappilo has been a strong experience. He understood the product vision, handled complex full-stack requirements with care, and consistently turned ideas into reliable, polished features.",
    name: "Arshad Sayed",
    role: "Zappilo Client · Dubai, UAE",
    project: "Zappilo Project",
    initials: "AS",
    featured: true,
    showLocation: true,
  },
  {
    quote:
      "Sagor built One Lifestyle BD with a clear understanding of both the customer journey and the daily operations behind it. The storefront feels polished, while products, orders, payments, delivery, and reporting stay organized in one reliable system.",
    name: "Safquat",
    role: "One Lifestyle BD Client · Bangladesh",
    project: "One Lifestyle BD",
    initials: "SQ",
    featured: true,
    showLocation: true,
  },
  {
    quote:
      "Sagor turned my personal finance workflow into an intuitive desktop application. Expense tracking feels simple, the reports are clear, and the overall experience is fast, organized, and thoughtfully designed.",
    name: "Mohamed Saad",
    role: "Personal Cost Management Client · Dubai, UAE",
    project: "Cost Manager",
    initials: "MS",
    featured: true,
    showLocation: true,
  },
  {
    quote:
      "Sagor played a key role in turning Mohuls.com and MSL Lab into two connected parts of our product ecosystem. He translated complex business, product, staff, and infrastructure requirements into polished public experiences and dependable internal workflows, with strong ownership from architecture through delivery.",
    name: "Humaun Kabir",
    role: "CEO, Mohuls Soft Limited",
    project: "MSL Lab + Mohuls.com",
    initials: "HK",
    featured: true,
  },
  {
    quote:
      "Sagor transformed the BounceZip vision into a fast, dependable email verification platform. From real-time and bulk verification to catch-all intelligence and API workflows, he made a technically complex product feel clear, polished, and easy to use.",
    name: "Nasir Hosain",
    role: "BounceZip Client · Chittagong, Bangladesh",
    project: "BounceZip",
    initials: "NH",
    featured: true,
    showLocation: true,
  },
  {
    quote:
      "Sagor gave Trusty a clean, practical e-commerce experience that makes our products easy to present and simple to order. The bilingual product pages, mobile-friendly layout, clear pricing, and WhatsApp ordering flow help our customers shop with confidence.",
    name: "Roufur Rabin",
    role: "Trusty Client · Bangladesh",
    project: "Trusty E-Commerce",
    initials: "RR",
    featured: true,
    showLocation: true,
  },
];

export function TestimonialsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const loopWidthRef = useRef(0);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseForInteraction = useCallback(() => {
    clearResumeTimer();
    setIsInteractionPaused(true);
  }, [clearResumeTimer]);

  const scheduleAutoResume = useCallback(() => {
    clearResumeTimer();
    if (reduceMotion || isUserPaused) return;

    resumeTimerRef.current = window.setTimeout(() => {
      if (!isHoveredRef.current && !isFocusedRef.current) {
        setIsInteractionPaused(false);
      }
    }, AUTO_RESUME_DELAY);
  }, [clearResumeTimer, isUserPaused, reduceMotion]);

  const registerManualInteraction = useCallback(() => {
    pauseForInteraction();
    scheduleAutoResume();
  }, [pauseForInteraction, scheduleAutoResume]);

  const updateMeasurements = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".testimonial-card");
    if (card) {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
      const step = card.offsetWidth + gap;
      loopWidthRef.current = step * testimonials.length;
      const canLoop = track.scrollWidth > track.clientWidth + 4;
      setCanScrollLeft(canLoop);
      setCanScrollRight(canLoop);
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateMeasurements();
    const resizeObserver = new ResizeObserver(updateMeasurements);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    resizeObserver.observe(track);
    visibilityObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [updateMeasurements]);

  useEffect(() => clearResumeTimer, [clearResumeTimer]);

  useEffect(() => {
    if (reduceMotion || !isInView || isUserPaused || isInteractionPaused) return;

    let animationFrame = 0;
    let previousTime = 0;
    let scrollPosition = trackRef.current?.scrollLeft ?? 0;

    const moveTrack = (time: number) => {
      const track = trackRef.current;
      const loopWidth = loopWidthRef.current;
      if (!track || !loopWidth) {
        animationFrame = window.requestAnimationFrame(moveTrack);
        return;
      }

      if (previousTime) {
        if (Math.abs(track.scrollLeft - scrollPosition) > 2) {
          scrollPosition = track.scrollLeft;
        }
        const elapsedSeconds = Math.min(time - previousTime, 64) / 1000;
        scrollPosition += AUTO_SCROLL_SPEED * elapsedSeconds;
        if (scrollPosition >= loopWidth) scrollPosition -= loopWidth;
        track.scrollLeft = scrollPosition;
      }
      previousTime = time;
      animationFrame = window.requestAnimationFrame(moveTrack);
    };

    animationFrame = window.requestAnimationFrame(moveTrack);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [isInView, isInteractionPaused, isUserPaused, reduceMotion]);

  const scrollStories = (direction: -1 | 1, manual = true) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".testimonial-card");
    if (!track || !card) return;

    if (manual) registerManualInteraction();

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
    const step = card.offsetWidth + gap;
    if (direction === -1 && track.scrollLeft < step) {
      track.scrollLeft += loopWidthRef.current;
    }
    track.scrollBy({
      left: direction * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const toggleAutoScroll = () => {
    clearResumeTimer();
    setIsInteractionPaused(false);
    setIsUserPaused((paused) => !paused);
  };

  return (
    <div className="testimonial-carousel">
      <div
        className="testimonial-track"
        ref={trackRef}
        role="region"
        aria-label="Client stories"
        tabIndex={0}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          pauseForInteraction();
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          scheduleAutoResume();
        }}
        onFocus={() => {
          isFocusedRef.current = true;
          pauseForInteraction();
        }}
        onBlur={() => {
          isFocusedRef.current = false;
          scheduleAutoResume();
        }}
        onPointerDown={registerManualInteraction}
        onWheel={registerManualInteraction}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          scrollStories(event.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        {[0, 1].map((copyIndex) =>
          testimonials.map((testimonial) => (
            <motion.figure
              className={`testimonial-card ${testimonial.featured ? "testimonial-featured" : ""}`}
              key={`${testimonial.name}-${copyIndex}`}
              aria-hidden={copyIndex === 1 ? "true" : undefined}
              initial={false}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="testimonial-grid-lines" aria-hidden="true"><span /><span /><span /></div>
              <div className="testimonial-topline">
                {testimonial.project && <span className="testimonial-project">{testimonial.project}</span>}
                <Quote size={24} />
              </div>

              <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>

              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">{testimonial.initials}</span>
                <span className="testimonial-person">
                  <strong>{testimonial.name}</strong>
                  <span className="testimonial-role">
                    {testimonial.showLocation && <MapPin size={11} />}
                    {testimonial.role}
                  </span>
                </span>
                <span className="testimonial-signal" aria-hidden="true"><i /><i /><i /></span>
              </figcaption>
            </motion.figure>
          )),
        )}
      </div>

      <div className="carousel-footer">
        <div className="carousel-controls">
          <button
            className="testimonial-autoplay-button"
            type="button"
            aria-label={isUserPaused ? "Resume automatic client story scrolling" : "Pause automatic client story scrolling"}
            aria-pressed={isUserPaused}
            disabled={Boolean(reduceMotion)}
            data-paused={isUserPaused || isInteractionPaused || Boolean(reduceMotion)}
            title={reduceMotion ? "Automatic scrolling follows your reduced-motion preference" : isUserPaused ? "Resume automatic scrolling" : "Pause automatic scrolling"}
            onClick={toggleAutoScroll}
          >
            {isUserPaused || reduceMotion ? <Play size={15} /> : <Pause size={15} />}
            <span aria-hidden="true" />
          </button>
          <button
            className="testimonial-scroll-button testimonial-scroll-left"
            type="button"
            aria-label="Scroll client stories left"
            disabled={!canScrollLeft}
            onClick={() => scrollStories(-1)}
          >
            <ChevronsLeft size={21} />
          </button>
          <button
            className="testimonial-scroll-button testimonial-scroll-right"
            type="button"
            aria-label="Scroll client stories right"
            disabled={!canScrollRight}
            onClick={() => scrollStories(1)}
          >
            <ChevronsRight size={21} />
          </button>
        </div>
      </div>
    </div>
  );
}
