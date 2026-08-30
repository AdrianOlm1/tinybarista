"use client";

import { ITEMS } from "@/lib/menu";
import { money } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import styles from "./SearchOverlay.module.css";

const QUICK = ["Matcha", "Caramel", "Banana", "Cookie butter", "Strawberry", "Kids"];

export default function SearchOverlay() {
  const { q, setQuery, closeSearch, openSheet } = useStore();
  const query = q.trim().toLowerCase();

  const results = query
    ? ITEMS.filter((i) => `${i.name} ${i.blurb} ${i.cat}`.toLowerCase().includes(query))
    : ITEMS;
  const noResults = !!query && results.length === 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.band}>
        <div className={styles.searchRow}>
          <button className={styles.backBtn} onClick={closeSearch} aria-label="Close search">
            ←
          </button>
          <div className={styles.field}>
            <span className={styles.fieldDot} />
            <input
              className={styles.input}
              placeholder="What are you craving?"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className={`${styles.chips} hscroll`}>
          {QUICK.map((t) => {
            const active = query === t.toLowerCase();
            return (
              <button
                key={t}
                className={active ? styles.chipActive : styles.chip}
                onClick={() => setQuery(active ? "" : t.toLowerCase())}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {noResults && (
        <div className={styles.empty}>
          <div className={styles.emptyScript}>Nothing by that name</div>
          <div className={styles.emptyBody}>Try &ldquo;matcha&rdquo;, &ldquo;caramel&rdquo;, or tap a chip above.</div>
        </div>
      )}

      <div className={styles.results}>
        {results.map((it) => (
          <button className={styles.row} key={it.id} onClick={() => openSheet(it.id)}>
            <img src={it.img ? `/img/${it.img}` : "/img/bean.png"} alt="" className={styles.rowImg} />
            <span className={styles.rowText}>
              <span className={styles.rowName}>{it.name}</span>
              <span className={styles.rowBlurb}>{it.blurb}</span>
              <span className={styles.rowCat}>{it.cat}</span>
            </span>
            <span className={styles.rowRight}>
              <span className={styles.rowPrice}>
                {it.opts.length ? "from " : ""}
                {money(it.base)}
              </span>
              <span className={styles.rowAdd}>Add</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
