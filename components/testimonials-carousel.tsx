"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeft, ChevronsRight, MapPin, Quote } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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
];

export function TestimonialsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentStory, setCurrentStory] = useState(0);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".testimonial-card");
    if (card) {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
      const nextStory = Math.min(testimonials.length - 1, Math.round(track.scrollLeft / (card.offsetWidth + gap)));
      setCurrentStory(nextStory);
      setCanScrollLeft(nextStory > 0);
    }
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener("scroll", updateControls, { passive: true });
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateControls);
      observer.disconnect();
    };
  }, [updateControls]);

  const scrollStories = (direction: -1 | 1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".testimonial-card");
    if (!track || !card) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 16;
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-track" ref={trackRef} aria-label="Client stories">
        {testimonials.map((testimonial, index) => (
          <motion.figure
            className={`testimonial-card ${testimonial.featured ? "testimonial-featured" : ""}`}
            key={testimonial.name}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, root: trackRef, amount: 0.3 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.24) }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <div className="testimonial-grid-lines" aria-hidden="true"><span /><span /><span /></div>
            <div className="testimonial-topline">
              <span className="testimonial-index">{String(index + 1).padStart(2, "0")}</span>
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
        ))}
      </div>

      <div className="carousel-footer">
        <div className="carousel-position" aria-live="polite" aria-atomic="true">
          <strong>{String(currentStory + 1).padStart(2, "0")}</strong>
          <span aria-hidden="true" />
          {String(testimonials.length).padStart(2, "0")}
        </div>
        <div className="carousel-controls">
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
