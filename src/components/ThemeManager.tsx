"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/store/quiz";

/**
 * Two responsibilities:
 *  1. Sync `<html>` class with store's theme on every change.
 *  2. One-shot auto-detect via `prefers-color-scheme` after persist hydration,
 *     IF the user has never manually toggled.
 *
 * The initial paint is handled by the inline script in app/layout.tsx —
 * this component takes over after React mounts.
 */
export function ThemeManager() {
  const theme = useQuizStore((s) => s.theme);

  // Mirror store theme onto <html> class.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // First-visit auto-detect from system preference.
  useEffect(() => {
    const apply = () => {
      const state = useQuizStore.getState();
      if (state.themeManuallySet) return;
      const detected =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      if (detected !== state.theme) {
        state.setThemeAutoDetected(detected);
      }
    };

    if (useQuizStore.persist.hasHydrated()) {
      apply();
    } else {
      const unsub = useQuizStore.persist.onFinishHydration(apply);
      return () => unsub();
    }
  }, []);

  return null;
}
