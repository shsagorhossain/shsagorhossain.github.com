import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaWhatsapp } from "react-icons/fa";
import { Navigation } from "@/components/navigation";
import {
  HomeFaqExperience,
  HomeInsightsShowcase,
  HomeProjectsCarousel,
  HomeServicesNetwork,
  HomeTestimonialsCarousel,
} from "@/components/home-interactive-sections";
import { insightCategories, insights } from "@/data/insights";
import {
  HomeContactBanner,
  HomeHero,
  HomeReveal,
  HomeScrollProgress,
  HomeSection,
  HomeStats,
} from "@/components/home-experience";

export default function Home() {
  return (
    <>
      <HomeScrollProgress />
      <Navigation />
      <main className="home-main">
        <HomeHero />
        <HomeStats />

        <HomeSection className="section site-shell services" id="services">
          <HomeReveal className="section-heading">
            <p>What I Do</p>
            <h2>Services That I Provide</h2>
          </HomeReveal>
          <HomeServicesNetwork />
        </HomeSection>

        <HomeSection className="section site-shell projects" id="projects">
          <HomeReveal className="section-heading-row">
            <div className="section-heading">
              <p>My Work</p>
              <h2>Featured Projects</h2>
            </div>
            <Link className="text-link" href="/projects/">
              View All Projects
              <ArrowRight size={16} />
            </Link>
          </HomeReveal>
          <HomeProjectsCarousel />
        </HomeSection>

        <HomeSection className="section insights" id="insights">
          <div className="site-shell">
            <HomeReveal className="section-heading-row insights-heading">
              <div className="section-heading">
                <p>Ideas in Practice</p>
                <h2>Insights</h2>
              </div>
              <span className="insights-heading-meta">
                {insightCategories.length} Editorial Categories · {insights.length} Published
              </span>
            </HomeReveal>
            <HomeInsightsShowcase />
          </div>
        </HomeSection>

        <HomeSection className="section site-shell testimonials" id="testimonials">
          <HomeReveal className="section-heading">
            <p>Client Stories</p>
            <h2>What People Say</h2>
          </HomeReveal>
          <HomeTestimonialsCarousel />
        </HomeSection>

        <HomeSection className="section faq" id="faq">
          <div className="site-shell">
            <HomeFaqExperience />
          </div>
        </HomeSection>

        <HomeContactBanner />
      </main>

      <footer>
        <div className="site-shell footer-inner">
          <a className="brand" href="#home" aria-label="Back to top">
            <Image className="brand-logo" src="/sh-logo.webp" alt="" width={72} height={48} loading="lazy" />
          </a>
          <p>Full Stack Developer based in Bangladesh.</p>
          <div className="social-links">
            <a href="https://github.com/shsagorhossain" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={18} /></a>
            <a href="https://wa.me/8801303488968" target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp size={18} /></a>
            <a href="https://www.facebook.com/sh.sagor.10441/" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF size={17} /></a>
            <a href="mailto:shsagor.11s@gmail.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </div>
      </footer>
    </>
  );
}
