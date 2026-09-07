"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Printer } from "lucide-react";
import styles from "./cv.module.css";

export function CvActions() {
  const [ready, setReady] = useState(false);
  const printRequested = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;

    // Print only after the portrait, fonts, and document layout are ready.
    const prepareDocument = async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>("[data-cv-document] img"));
      await Promise.allSettled([
        document.fonts.ready,
        ...images.map((image) => image.decode()),
      ]);
      if (cancelled) return;

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
      });
    };

    void prepareDocument();
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  const printCv = useCallback(() => {
    printRequested.current = true;
    const url = new URL(window.location.href);

    // Consume the one-time request so Back or Refresh does not reopen printing.
    if (url.searchParams.has("print")) {
      url.searchParams.delete("print");
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    }

    window.print();
  }, []);

  useEffect(() => {
    if (!ready || printRequested.current) return;
    if (new URLSearchParams(window.location.search).get("print") === "1") printCv();
  }, [ready, printCv]);

  return (
    <header className={styles.toolbar}>
      <nav className={styles.toolbarInner} aria-label="CV actions">
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Portfolio</span>
        </Link>
        <span className={styles.documentLabel}>Curriculum Vitae</span>
        <button className={styles.printButton} type="button" onClick={printCv} disabled={!ready} aria-busy={!ready}>
          {ready ? <Printer size={17} aria-hidden="true" /> : <LoaderCircle size={17} className={styles.spinner} aria-hidden="true" />}
          <span>{ready ? "Print / Save PDF" : "Preparing CV"}</span>
        </button>
      </nav>
    </header>
  );
}
