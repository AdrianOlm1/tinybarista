"use client";

import { CATEGORIES, ITEMS } from "@/lib/menu";
import { money } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import styles from "./MenuView.module.css";

export default function MenuView() {
  const { cat, q, gotos, favs, quickAdd, openSheet, toggleFav } = useStore();

  const groups = CATEGORIES.filter((g) => cat === "All" || cat === g.id)
    .map((g) => ({ ...g, items: ITEMS.filter((i) => i.cat === g.id) }))
    .filter((g) => g.items.length || g.note);

  const showGotos = cat === "All" && !q && gotos.length > 0;

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroScript}>Order ahead</div>
        <div className={styles.heroBody}>
          Pickup at 34541 Yucaipa Blvd · today&rsquo;s window 7:00 AM – 1:30 PM. Porque el mejor café se hace desde
          el corazón.
        </div>
      </div>

      {showGotos && (
        <div className={styles.gotos}>
          <div className={styles.gotosHead}>
            <div className={styles.gotosTitle}>Your go-to&rsquo;s</div>
            <span className={styles.gotosNote}>saved from your last orders</span>
          </div>
          <div className={`${styles.gotosRail} hscroll`}>
            {gotos.map((g, i) => {
              const it = ITEMS.find((it) => it.id === g.id);
              if (!it) return null;
              return (
                <div className={styles.gotoCard} key={`${g.id}-${i}`}>
                  {it.img && <img src={`/img/${it.img}`} alt="" className={styles.gotoImg} />}
                  <div className={styles.gotoText}>
                    <div className={styles.gotoName}>{it.name}</div>
                    <div className={styles.gotoOpts}>{g.label}</div>
                  </div>
                  <button className={styles.gotoAdd} onClick={() => quickAdd(g)}>
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.groups}>
        {groups.map((g) => (
          <div key={g.id}>
            <div className={styles.groupHead}>
              <div className={styles.groupScript}>{g.script}</div>
              <div className={styles.groupSub}>{g.sub}</div>
            </div>
            {g.note && <div className={styles.groupNote}>{g.note}</div>}
            <div className={styles.grid}>
              {g.items.map((it) => (
                <div className={styles.card} key={it.id}>
                  <div className={styles.photo} onClick={() => openSheet(it.id)}>
                    {it.img ? (
                      <img src={`/img/${it.img}`} alt={it.name} className={styles.img} />
                    ) : (
                      <div className={styles.placeholder}>
                        <span>DRINK PHOTO</span>
                      </div>
                    )}
                    <button
                      className={styles.favBtn}
                      style={{ color: favs.includes(it.id) ? "var(--forest)" : "rgba(28,21,18,.25)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(it.id);
                      }}
                      aria-label="Favorite"
                    >
                      ♥
                    </button>
                  </div>
                  <div className={styles.body}>
                    <div className={styles.name}>{it.name}</div>
                    <div className={styles.blurb}>{it.blurb}</div>
                    <div className={styles.foot}>
                      <span className={styles.price}>
                        {it.opts.length ? "from " : ""}
                        {money(it.base)}
                      </span>
                      <button className={styles.customizeBtn} onClick={() => openSheet(it.id)}>
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
