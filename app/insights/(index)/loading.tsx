import styles from "../insights-loading.module.css";

const categoryRows = Array.from({ length: 10 }, (_, index) => index);
const articleCards = Array.from({ length: 3 }, (_, index) => index);

export default function InsightsLoading() {
  return (
    <div className={styles.page} role="status" aria-live="polite" aria-busy="true">
      <span className={styles.srOnly}>Loading the Insights Index</span>

      <header className={styles.header}>
        <div className={styles.shell}>
          <span className={`${styles.skeleton} ${styles.logo}`} />
          <nav aria-hidden="true">
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </nav>
          <span className={`${styles.skeleton} ${styles.headerAction}`} />
        </div>
      </header>

      <main>
        <section className={`${styles.hero} ${styles.shell}`} aria-hidden="true">
          <div className={styles.heroCopy}>
            <span className={`${styles.skeleton} ${styles.eyebrow}`} />
            <span className={`${styles.skeleton} ${styles.heroTitle}`} />
            <span className={`${styles.skeleton} ${styles.heroLine}`} />
            <span className={`${styles.skeleton} ${styles.heroLineShort}`} />
            <div className={styles.storyBlock}>
              <span className={`${styles.skeleton} ${styles.storyLabel}`} />
              <span className={`${styles.skeleton} ${styles.storyTitle}`} />
              <span className={`${styles.skeleton} ${styles.storyTitleShort}`} />
              <span className={`${styles.skeleton} ${styles.storyMeta}`} />
            </div>
            <div className={styles.heroActions}>
              <span className={styles.skeleton} />
              <span className={styles.skeleton} />
            </div>
          </div>
          <div className={styles.heroMetrics}>
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
            <span className={styles.skeleton} />
          </div>
        </section>

        <section className={`${styles.library} ${styles.shell}`} aria-hidden="true">
          <div className={styles.libraryHeading}>
            <div><span className={`${styles.skeleton} ${styles.headingLabel}`} /><span className={`${styles.skeleton} ${styles.headingTitle}`} /></div>
            <div><span className={`${styles.skeleton} ${styles.headingCopy}`} /><span className={`${styles.skeleton} ${styles.headingCopyShort}`} /></div>
          </div>

          <div className={styles.workspace}>
            <aside className={styles.categoryRail}>
              <span className={`${styles.skeleton} ${styles.railHeading}`} />
              {categoryRows.map((row) => <span className={`${styles.skeleton} ${styles.categoryRow}`} key={row} />)}
            </aside>

            <div className={styles.indexPanel}>
              <div className={styles.toolbar}>
                <span className={`${styles.skeleton} ${styles.search}`} />
                <span className={`${styles.skeleton} ${styles.sort}`} />
                <span className={`${styles.skeleton} ${styles.view}`} />
              </div>
              <span className={`${styles.skeleton} ${styles.resultLine}`} />
              <div className={styles.articleGrid}>
                {articleCards.map((card) => (
                  <article className={styles.articleCard} key={card}>
                    <span className={`${styles.skeleton} ${styles.cardMedia}`} />
                    <div>
                      <span className={`${styles.skeleton} ${styles.cardMeta}`} />
                      <span className={`${styles.skeleton} ${styles.cardTitle}`} />
                      <span className={`${styles.skeleton} ${styles.cardTitleShort}`} />
                      <span className={`${styles.skeleton} ${styles.cardCopy}`} />
                      <span className={`${styles.skeleton} ${styles.cardCopyShort}`} />
                      <span className={`${styles.skeleton} ${styles.cardFooter}`} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
