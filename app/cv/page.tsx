import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cv } from "@/data/cv";
import { projects } from "@/data/projects";
import { CvActions } from "./cv-actions";
import styles from "./cv.module.css";

export const metadata: Metadata = {
  title: { absolute: "Sagor Hossain - CV" },
  description: "The CV of Sagor Hossain, Senior Full Stack Developer at Mohuls Soft Limited. Experience, technical skills, and selected software projects.",
  alternates: { canonical: "/cv/" },
  openGraph: {
    title: "Sagor Hossain | Senior Full Stack Developer",
    description: "Experience, technical skills, and selected software projects.",
    url: "/cv/",
    images: [{ url: cv.photo, alt: "Sagor Hossain" }],
  },
};

function PageFooter({ page }: { page: number }) {
  return (
    <div className={styles.pageFooter}>
      <span>{cv.name}</span>
      <a href={cv.website}>shsagorhossain.github.io</a>
      <span>{page} / 2</span>
    </div>
  );
}

export default function CvPage() {
  return (
    <div className={styles.root}>
      <CvActions />
      <main className={styles.document} data-cv-document>
        <article className={styles.sheet} aria-label="CV: professional profile">
          <header className={styles.identity}>
            <div>
              <p className={styles.eyebrow}>Curriculum Vitae</p>
              <h1>{cv.name}</h1>
              <p className={styles.role}>{cv.title}</p>
              <address className={styles.contact}>
                <div className={styles.contactRow}>
                  <a href={`mailto:${cv.email}`}>{cv.email}</a>
                  <a href={`tel:${cv.phone}`}>{cv.phone}</a>
                </div>
                <p>{cv.address}</p>
                <div className={styles.contactLinks}>
                  <a href={cv.website}>shsagorhossain.github.io</a>
                  <a href={cv.github}>github.com/shsagorhossain</a>
                </div>
              </address>
            </div>
            <Image className={styles.portrait} src={cv.photo} alt="Sagor Hossain" width={118} height={148} priority />
          </header>

          <section className={styles.section} aria-labelledby="cv-summary">
            <h2 id="cv-summary">Professional Summary</h2>
            <p>{cv.summary}</p>
          </section>

          <section className={styles.section} aria-labelledby="cv-experience">
            <h2 id="cv-experience">Professional Experience</h2>
            <div className={styles.experienceHeading}>
              <div>
                <h3>{cv.employment.title}</h3>
                <p className={styles.company}>{cv.employment.company}</p>
              </div>
              <span className={styles.period}>{cv.employment.period}</span>
            </div>
            <ul className={styles.responsibilities}>
              {cv.employment.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="cv-skills">
            <h2 id="cv-skills">Technical Skills</h2>
            <dl className={styles.skillList}>
              {cv.skills.map((skill) => (
                <div key={skill.label}>
                  <dt>{skill.label}</dt>
                  <dd>{skill.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.section} aria-labelledby="cv-education">
            <h2 id="cv-education">Education &amp; Professional Development</h2>
            <h3>{cv.education.title}</h3>
            <p>{cv.education.description}</p>
          </section>

          <section className={styles.section} aria-labelledby="cv-languages">
            <h2 id="cv-languages">Languages</h2>
            <p>{cv.languages.join(" / ")}</p>
          </section>
          <PageFooter page={1} />
        </article>

        <article className={`${styles.sheet} ${styles.projectSheet}`} aria-labelledby="cv-projects">
          <header className={styles.continuation}>
            <span>{cv.name}</span>
            <span>{cv.title}</span>
          </header>
          <div className={styles.projectsHeading}>
            <h2 id="cv-projects">Selected Projects</h2>
            <p>Web products, business platforms, and desktop applications.</p>
          </div>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <section className={styles.project} key={project.href} aria-label={project.title}>
                <h3>
                  <a href={`${cv.website}${project.href}`}>
                    {project.title}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </h3>
                <p>{project.description}</p>
                <p className={styles.projectStack}><strong>Technologies:</strong> {project.tags.join(", ")}</p>
                <a className={styles.projectUrl} href={`${cv.website}${project.href}`}>
                  shsagorhossain.github.io{project.href}
                </a>
              </section>
            ))}
          </div>
          <PageFooter page={2} />
        </article>
      </main>
    </div>
  );
}
