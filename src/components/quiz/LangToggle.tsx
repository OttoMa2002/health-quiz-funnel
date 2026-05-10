"use client";

import { motion } from "framer-motion";
import { useLocale, useSetLocale, type Locale } from "@/lib/i18n";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "zh", label: "中" },
  { value: "en", label: "EN" },
];

export function LangToggle() {
  const value = useLocale();
  const setLocale = useSetLocale();

  return (
    <div className="inline-flex rounded-full border border-border bg-surface-2 p-0.5">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            aria-label={`Switch to ${opt.value === "zh" ? "Chinese" : "English"}`}
            aria-pressed={active}
            className={`relative cursor-pointer px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              active ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {active && (
              <motion.div
                layoutId="lang-toggle-pill"
                className="absolute inset-0 rounded-full bg-surface shadow-[var(--shadow-card)]"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
