"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/store/quiz";

/**
 * One-shot browser locale detector. Runs once after persist hydration.
 * If the user has never manually toggled language, infer from navigator.language.
 * No UI; mount once at the root.
 */
export function I18nDetector() {
  useEffect(() => {
    const apply = () => {
      const state = useQuizStore.getState();
      if (state.localeManuallySet) return;
      const lang = (navigator.language || "").toLowerCase();
      const detected = lang.startsWith("zh") ? "zh" : "en";
      if (detected !== state.locale) {
        state.setLocaleAutoDetected(detected);
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