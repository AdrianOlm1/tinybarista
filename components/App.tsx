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

  // Belt-and-suspenders scroll reset: runs after the new view has actually
  // mounted, so a bean/nav click always lands at the top of the next page
  // regardless of click-event timing.
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
