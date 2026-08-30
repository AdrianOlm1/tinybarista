"use client";

import { useStore } from "@/lib/store";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const { cookieChoice, sheetId, acceptCookies, declineCookies } = useStore();
  if (cookieChoice || sheetId) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.script}>A little something in your cup</span>
          <span className={styles.body}>
            We&rsquo;d like to remember your favorites, saved go-to&rsquo;s, and the name and pickup time you last
            used — stored on this device only, so your usual is one tap away next visit. Nothing sold, nothing
            shared, and clearing your browser data clears it all.
          </span>
        </div>
        <div className={styles.actions}>
          <button className={styles.accept} onClick={acceptCookies}>
            Sounds good
          </button>
          <button className={styles.decline} onClick={declineCookies}>
            Essentials only
          </button>
        </div>
      </div>
    </div>
  );
}
