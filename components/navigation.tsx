"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Insights", href: "#insights" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector(href))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 80) {
          setActive("home");
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0, 0.15, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    const syncHomeAtTop = () => {
      if (window.scrollY < 80) setActive("home");
    };
    window.addEventListener("scroll", syncHomeAtTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncHomeAtTop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 851px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className={`site-header ${open ? "menu-open" : ""}`}>
        <div className="site-shell nav-inner">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="Sagor Hossain home">
            <Image className="brand-logo" src="/sh-logo.webp" alt="" width={72} height={48} priority />
          </a>

          <nav className="nav-links" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link.href}
                className={active === link.href.slice(1) ? "active" : ""}
                href={link.href}
                onClick={closeMenu}
                aria-current={active === link.href.slice(1) ? "page" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a className="nav-cta" href="mailto:shsagor.11s@gmail.com">
            Let&apos;s Talk
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>

          <button
            className={`menu-button ${open ? "is-open" : ""}`}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                className="menu-button-icon"
                key={open ? "close" : "open"}
                initial={reduceMotion ? false : { opacity: 0, rotate: open ? -70 : 70, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, rotate: open ? 70 : -70, scale: 0.7 }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-nav-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
          >
            <motion.button
              className="mobile-nav-backdrop"
              type="button"
              tabIndex={-1}
              aria-label="Close navigation"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              className="mobile-nav-panel"
              id="mobile-navigation"
              aria-label="Primary navigation"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -22, scaleY: 0.88 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scaleY: 0.93 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-nav-signals" aria-hidden="true"><span /><span /><span /></div>
              <div className="mobile-nav-head">
                <span>Sagor / Portfolio</span>
                <span className="mobile-nav-status"><i />Available</span>
              </div>

              <div className="mobile-nav-links">
                {links.map((link, index) => {
                  const isActive = active === link.href.slice(1);
                  return (
                    <motion.a
                      className={isActive ? "mobile-nav-link active" : "mobile-nav-link"}
                      href={link.href}
                      key={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.32, delay: reduceMotion ? 0 : 0.1 + index * 0.045 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.985, x: 4 }}
                    >
                      <span className="mobile-nav-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <strong>{link.label}</strong>
                      {isActive ? <span className="mobile-nav-active" aria-hidden="true"><i />Live</span> : <ArrowUpRight size={18} aria-hidden="true" />}
                    </motion.a>
                  );
                })}
              </div>

              <motion.a
                className="mobile-nav-contact"
                href="mailto:shsagor.11s@gmail.com"
                onClick={closeMenu}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.38, duration: 0.32 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              >
                <span><small>Have a project?</small>Start a conversation</span>
                <ArrowUpRight size={20} />
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
