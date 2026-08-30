"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Coffee,
  Download,
  Send,
  TerminalSquare,
  Users,
} from "lucide-react";
import {
  SiDjango,
  SiFastapi,
  SiNextdotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

const stats = [
  { value: 2, suffix: "+", label: "Years Experience", icon: Code2, tone: "blue" },
  { value: 20, suffix: "+", label: "Projects Completed", icon: BriefcaseBusiness, tone: "green" },
  { value: 15, suffix: "+", label: "Happy Clients", icon: Users, tone: "purple" },
  { value: 1500, suffix: "+", label: "Cups of Coffee", icon: Coffee, tone: "yellow" },
];

const technologies = [
  { label: "Python", icon: SiPython, tone: "python" },
  { label: "Django", icon: SiDjango, tone: "django" },
  { label: "React", icon: SiReact, tone: "react" },
  { label: "Next.js", icon: SiNextdotjs, tone: "next" },
  { label: "FastAPI", icon: SiFastapi, tone: "fastapi" },
  { label: "Tailwind CSS", icon: SiTailwindcss, tone: "tailwind" },
];

function PortraitOrbit({ layer }: { layer: "back" | "front" }) {
  const gradientId = `orbit-color-${layer}`;

  return (
    <div className={`orbit orbit-${layer}`} aria-hidden="true">
      <svg viewBox="0 0 465 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2786ff" />
            <stop offset="52%" stopColor="#4f7cff" />
            <stop offset="100%" stopColor="#9b42ff" />
          </linearGradient>
        </defs>
        <ellipse className="orbit-track" cx="232.5" cy="50" rx="229" ry="47" />
        <ellipse
          className="orbit-runner"
          cx="232.5"
          cy="50"
          rx="229"
          ry="47"
          pathLength="1"
          stroke={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
}

export function HomeScrollProgress() {
  const { scrollYProgress } = useScroll();

  return <motion.div className="home-scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />;
}

export function HomeHero() {
  const reduceMotion = useReducedMotionPreference();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { margin: "220px 0px" });
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const smoothTiltX = useSpring(tiltX, { stiffness: 170, damping: 24 });
  const smoothTiltY = useSpring(tiltY, { stiffness: 170, damping: 24 });
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltX.set(y * -4);
    tiltY.set(x * 4);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section className={`hero hero-live ${heroInView ? "is-visible" : "is-idle"}`} id="home" ref={heroRef}>
      <div className="hero-signal-grid" aria-hidden="true"><span /><span /><span /></div>
      <div className="hero-grid site-shell" id="about">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        >
          <motion.div className="hero-kicker-row" variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
            <div className="hello-pill"><span aria-hidden="true">Hi!</span>I&apos;m</div>
            <div className="availability-pill"><i />Available for select projects</div>
          </motion.div>
          <motion.h1 variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
            Sagor Hossain
          </motion.h1>
          <motion.p className="hero-role" variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
            Full Stack <span>Developer</span>
          </motion.p>
          <motion.p className="hero-intro" variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }}>
            I build modern, scalable, and high-performance web applications using Python,
            Django, React, and Next.js. Turning ideas into real-world solutions.
          </motion.p>
          <motion.div className="hero-actions" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <motion.a
              className="button button-primary"
              href="#projects"
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.015 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              View My Work
              <ArrowRight size={17} />
            </motion.a>
            <motion.a
              className="button button-quiet"
              href="mailto:shsagor.11s@gmail.com?subject=Resume%20request"
              whileHover={reduceMotion ? undefined : { x: 3 }}
            >
              <Download size={17} />
              Download CV
            </motion.a>
          </motion.div>
          <motion.div className="skills-block" id="skills" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <p>Tech Stack</p>
            <div className="tech-list" aria-label="Technology stack">
              {technologies.map((technology, index) => {
                const Icon = technology.icon;
                return (
                  <motion.span
                    className={`tech-tile ${technology.tone}`}
                    title={technology.label}
                    aria-label={technology.label}
                    key={technology.label}
                    whileHover={reduceMotion ? undefined : { y: -6, rotate: index % 2 === 0 ? -2 : 2 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  >
                    <Icon />
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="portrait-stage"
          aria-label="Portrait of Sagor Hossain"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 32 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: "easeOut" }}
            style={reduceMotion || !heroInView ? undefined : { y: portraitY, scale: portraitScale, rotateX: smoothTiltX, rotateY: smoothTiltY }}
        >
          <div className="portrait-scan" aria-hidden="true" />
          <div className="portrait-dots" aria-hidden="true" />
          <div className="portrait-circle" aria-hidden="true" />
          <PortraitOrbit layer="back" />
          <motion.div
            className="floating-code code-left"
            aria-hidden="true"
            animate={reduceMotion || !heroInView ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          ><TerminalSquare size={25} /></motion.div>
          <motion.div
            className="floating-code code-right"
            aria-hidden="true"
            animate={reduceMotion || !heroInView ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          ><Code2 size={27} /></motion.div>
          <Image
            className="portrait"
            src="/sagor-hossain.webp"
            alt="Sagor Hossain"
            fill
            priority
            sizes="(max-width: 900px) 90vw, 48vw"
          />
          <PortraitOrbit layer="front" />
          <div className="portrait-telemetry" aria-hidden="true"><i /><span>System online</span><b>01</b></div>
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedStat({ value, suffix, label, tone, icon: Icon, index }: (typeof stats)[number] & { index: number }) {
  const reduceMotion = useReducedMotionPreference();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;

    const controls = animate(0, value, {
      duration: value > 100 ? 1.6 : 1.15,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <motion.div
      className={`stat stat-live ${inView ? "is-visible" : "is-idle"}`}
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <span className={`icon-disc ${tone}`}><Icon size={23} /></span>
      <div>
        <strong>{reduceMotion ? value : displayValue}{suffix}</strong>
        <span>{label}</span>
      </div>
      <span className="stat-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <span className={`stat-pulse ${tone}`} aria-hidden="true"><i /><i /><i /></span>
    </motion.div>
  );
}

export function HomeStats() {
  return (
    <div className="stats-wrap stats-live site-shell" aria-label="Career highlights">
      {stats.map((stat, index) => <AnimatedStat {...stat} index={index} key={stat.label} />)}
    </div>
  );
}

export function HomeSection({ children, className, id }: { children: ReactNode; className: string; id: string }) {
  const reduceMotion = useReducedMotionPreference();

  return (
    <motion.section
      className={className}
      id={id}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-6% 0px -6% 0px" }}
      transition={{ duration: 0.68, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

export function HomeReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotionPreference();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function HomeContactBanner() {
  const reduceMotion = useReducedMotionPreference();
  const contactRef = useRef<HTMLElement>(null);
  const contactInView = useInView(contactRef, { margin: "220px 0px" });

  return (
    <motion.section
      className={`contact-banner contact-banner-live site-shell ${contactInView ? "is-visible" : "is-idle"}`}
      id="contact"
      ref={contactRef}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.68 }}
    >
      <div className="contact-signal-lines" aria-hidden="true"><span /><span /><span /></div>
      <div>
        <p><i />Available for new projects</p>
        <h2>Have a Project in Mind?</h2>
        <span>I&apos;m available for freelance work and exciting opportunities.</span>
        <span>Let&apos;s build something amazing together.</span>
      </div>
      <div className="contact-path" aria-hidden="true"><Send size={42} /></div>
      <motion.a
        className="button contact-button"
        href="mailto:shsagor.11s@gmail.com"
        whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      >
        Get In Touch
        <ArrowRight size={17} />
      </motion.a>
    </motion.section>
  );
}
