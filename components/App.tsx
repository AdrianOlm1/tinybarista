"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import Header from "./Header";
import HomeView from "./HomeView";
import MenuView from "./MenuView";
import CheckoutView from "./CheckoutView";
import DoneView from "./DoneView";
import SearchOverlay from "./SearchOverlay";
import CustomizeSheet from "./CustomizeSheet";
import FloatingBean from "./FloatingBean";
import CookieConsent from "./CookieConsent";

export default function App() {
  const { view, navDir, sheetId } = useStore();

  const animClass = navDir === "back" ? "slideFromLeft" : navDir === "fwd" ? "slideFromRight" : "viewIn";

  // Scroll to top once, after the new view has actually mounted — this is the
  // only scroll-reset in the nav flow (a second one used to fire pre-emptively
  // on click, and the double reset mid-transition looked like a zoom on mobile).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div>
      <Header />
      <main key={view} className={animClass}>
        {view === "home" && <HomeView />}
        {view === "menu" && <MenuView />}
        {view === "checkout" && <CheckoutView />}
        {view === "done" && <DoneView />}
      </main>
      {view === "search" && <SearchOverlay />}
      <CookieConsent />
      {!!sheetId && <CustomizeSheet />}
      <FloatingBean />
    </div>
  );
}
