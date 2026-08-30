"use client";

import { CATS, useStore } from "@/lib/store";
import styles from "./Header.module.css";

export default function Header() {
  const { view, cat, goHome, goMenu, goSearch, pickCategory } = useStore();
  const onOrder = view === "menu" || view === "search";

  return (
    <div className={styles.header}>
      <div className={styles.row}>
        <button className={styles.brand} onClick={goHome} aria-label="Tiny Baristas home">
          <img src="/img/logo.png" alt="Tiny Baristas" className={styles.logo} />
          <div className={styles.status}>
            <span className={styles.wordmark}>Tiny Baristas</span>
            <span className={styles.hours}>
              <span className={styles.dot} />
              Open &rsquo;til 1:30 · Yucaipa, CA
            </span>
          </div>
        </button>

        <div className={styles.pillTrack}>
          <button className={view === "home" ? styles.pillBtnActive : styles.pillBtn} onClick={goHome}>
            Home
          </button>
          <button className={onOrder ? styles.pillBtnActive : styles.pillBtn} onClick={() => goMenu()}>
            Order
          </button>
        </div>

        <div className={styles.searchWrap}>
          <button className={styles.searchBtn} onClick={goSearch} aria-label="Search drinks">
            <span className={styles.searchIcon}>
              <span />
              <span />
            </span>
            <span className={styles.searchLabel}>Search drinks</span>
          </button>
        </div>
      </div>

      {view === "menu" && (
        <div className={`${styles.cats} hscroll`}>
          {CATS.map((c) => (
            <button
              key={c}
              className={c === cat ? styles.catChipActive : styles.catChip}
              onClick={() => pickCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
