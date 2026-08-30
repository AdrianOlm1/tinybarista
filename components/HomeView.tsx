"use client";

import { FEATURED, findItem } from "@/lib/menu";
import { money } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import styles from "./HomeView.module.css";

export default function HomeView() {
  const { goMenu, openSheet } = useStore();

  return (
    <div>
      <div className={styles.hero}>
        <img src="/img/beans.jpg" alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>Yucaipa, CA · small batch</div>
          <div className={styles.rule} />
          <div className={styles.heroName}>Tiny Baristas</div>
          <div className={styles.heroScript}>Brewed with love</div>
          <div className={styles.flourish}>♥ ✦ ♥</div>
          <div className={styles.intro}>
            Order ahead, skip the wait, and pick it up warm — or iced, in a 24 oz, with cold foam. Porque el mejor
            café se hace desde el corazón.
          </div>
          <div className={styles.tags}>
            <span>family run</span>
            <span>·</span>
            <span>oat milk always free</span>
            <span>·</span>
            <span>ready in ~12 min</span>
          </div>
          <div className={styles.heroBtns}>
            <button className={styles.ctaPrimary} onClick={() => goMenu()}>
              <span className={styles.sheen} />
              <span>Start your order</span>
            </button>
            <button className={styles.ctaSecondary} onClick={() => goMenu("Matcha")}>
              Matcha menu
            </button>
          </div>
        </div>
      </div>

      <div className={styles.statusStrip}>
        <span>
          <span className={styles.statusDot} />
          Open today · 7:00 AM – 1:30 PM
        </span>
        <span>Pickup only — ready in ~12 min</span>
        <span>34541 Yucaipa Blvd</span>
      </div>

      <div className={styles.couponSection}>
        <div className={styles.coupon}>
          <span className={styles.couponTab}>This week only</span>
          <div className={styles.couponHead}>
            <div className={styles.couponEyebrow}>Weekday mornings &rsquo;til 11</div>
            <div className={styles.couponScript}>$5 Specials</div>
            <div className={styles.couponBody}>
              A rotating pick every week — same drinks, smaller price. Published straight from your $5 Specials
              collection.
            </div>
          </div>
          <button className={styles.couponBtn} onClick={() => goMenu("$5 Specials")}>
            See what&rsquo;s $5
          </button>
        </div>
      </div>

      <button className={styles.divider} onClick={() => goMenu()}>
        <span className={styles.dividerLine} />
        <span>See the full menu →</span>
        <span className={styles.dividerLine} />
      </button>

      <div className={styles.favorites}>
        <div className={styles.favHead}>
          <div className={styles.favRule}>
            <span />
            <span>✦</span>
            <span />
          </div>
          <div className={styles.favTitle}>This week&rsquo;s favorites</div>
          <div className={styles.favSub}>Pulled from what Yucaipa keeps reordering</div>
        </div>
        <div className={styles.favGrid}>
          {FEATURED.map(({ id, tag }) => {
            const item = findItem(id);
            if (!item) return null;
            return (
              <div className={styles.card} key={id}>
                <div className={styles.cardPhoto} onClick={() => openSheet(id)}>
                  {item.img ? (
                    <img src={`/img/${item.img}`} alt={item.name} className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardImg} style={{ background: "#EDE9DF" }} />
                  )}
                  <span className={styles.tag}>{tag}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{item.name}</div>
                  <div className={styles.cardBlurb}>{item.blurb}</div>
                  <div className={styles.cardFoot}>
                    <span className={styles.price}>from {money(item.base)}</span>
                    <button className={styles.customizeBtn} onClick={() => openSheet(id)}>
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <button className={styles.moreCard} onClick={() => goMenu()}>
            <span className={styles.moreHeart}>♥</span>
            <span className={styles.moreScript}>and lots more</span>
            <span className={styles.moreBody}>Signatures, matcha, and little sips for the kiddos</span>
            <span className={styles.moreLink}>See the full menu →</span>
          </button>
        </div>
      </div>

      <div className={styles.ribbon}>
        <span>oat milk always free</span>
        <span>✦</span>
        <span>real ceremonial matcha</span>
        <span>✦</span>
        <span>house-made syrups</span>
      </div>

      <div className={styles.about}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <div className={styles.aboutScript}>Two sisters, one cart</div>
            <div className={styles.aboutRule} />
            <div className={styles.aboutBody}>
              Tiny Baristas started as a small side hustle between two sisters, Veronica and Alexis, who simply
              loved great coffee and wanted to share it with their community. What began as a fun project grew into
              a family-run coffee company built on passion, hard work, and a whole lot of love (and caffeine).
            </div>
            <div className={styles.aboutBody2}>
              You&rsquo;re not just getting coffee — you&rsquo;re getting a taste of the ♥ behind it.
            </div>
          </div>
          <div className={styles.aboutPhotos}>
            <img src="/img/life-1.jpg" alt="" className={styles.aboutPhoto} />
            <img src="/img/life-2.jpg" alt="" className={styles.aboutPhotoMid} />
            <img src="/img/life-3.jpg" alt="" className={styles.aboutPhoto} />
          </div>
        </div>
      </div>

      <div className={styles.quote}>
        <div className={styles.quoteRule}>
          <span />
          <span>♥</span>
          <span />
        </div>
        <div className={styles.quoteScript}>Porque el mejor café se hace desde el corazón</div>
        <div className={styles.quoteEn}>Because the best coffee is made from the heart</div>
      </div>

      <div className={styles.visit}>
        <div className={styles.visitGrid}>
        <div>
          <div className={styles.visitLabel}>Pickup hours</div>
          <div className={styles.visitBody}>
            Mon – Fri · 7:00 AM – 1:30 PM
            <br />
            Saturday · 8:00 AM – 2:00 PM
            <br />
            Sunday · closed ♥
          </div>
        </div>
        <div>
          <div className={styles.visitLabel}>Find us</div>
          <div className={styles.visitBody}>
            34541 Yucaipa Blvd
            <br />
            Yucaipa, CA 92399
            <br />
            <a href="#">Get directions →</a>
          </div>
        </div>
        <div>
          <div className={styles.visitLabel}>Catch a pop-up</div>
          <div className={styles.visitBody}>
            We post pop-ups, new drinks, and specials first on Instagram.
            <br />
            <a href="#">@tinybaristas →</a>
          </div>
        </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLogoBar}>
          <img src="/img/logo.png" alt="Tiny Baristas" className={styles.footerLogo} />
        </div>
        <div className={styles.footerWordmark}>Tiny Baristas</div>
        <div className={styles.footerAddr}>
          34541 Yucaipa Blvd, Yucaipa, CA 92399
          <br />
          Curated by Silly Gal Studio
        </div>
      </div>
    </div>
  );
}
