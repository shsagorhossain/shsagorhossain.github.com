import Image from "next/image";
import {
  ArrowRight,
  Mail,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaWhatsapp } from "react-icons/fa";
import { Navigation } from "@/components/navigation";
import { ServicesNetwork } from "@/components/services-network";
import { ProjectsCarousel } from "@/components/projects-carousel";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
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
          <ServicesNetwork />
        </HomeSection>

        <HomeSection className="section site-shell projects" id="projects">
          <HomeReveal className="section-heading-row">
            <div className="section-heading">
              <p>My Work</p>
              <h2>Featured Projects</h2>
            </div>
            <a className="text-link" href="https://github.com/shsagorhossain" target="_blank" rel="noreferrer">
              View All Projects
              <ArrowRight size={16} />
            </a>
          </HomeReveal>
          <ProjectsCarousel />
        </HomeSection>

        <HomeContactBanner />

        <HomeSection className="section site-shell testimonials" id="testimonials">
          <HomeReveal className="section-heading">
            <p>Client Stories</p>
            <h2>What People Say</h2>
          </HomeReveal>
          <TestimonialsCarousel />
        </HomeSection>
      </main>

      <footer>
        <div className="site-shell footer-inner">
          <a className="brand" href="#home" aria-label="Back to top">
            <Image className="brand-logo" src="/sh-logo.png" alt="" width={72} height={48} />
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
