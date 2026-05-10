"use client";

import { motion } from "framer-motion";
import { useT, type I18nKey } from "@/lib/i18n";
import type { Unit } from "@/store/quiz";

interface UnitToggleProps {
  value: Unit;
  onChange: (v: Unit) => void;
}

const OPTIONS: { value: Unit; labelKey: I18nKey; hintKey: I18nKey }[] = [
  { value: "metric", labelKey: "common.metric", hintKey: "common.metricHint" },
  { value: "imperial", labelKey: "common.imperial", hintKey: "common.imperialHint" },
];

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  const t = useT();
  return (
    <div className="inline-flex rounded-full border border-border bg-surface-2 p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors ${
              active ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {active && (
              <motion.div
                layoutId="unit-toggle-pill"
                className="absolute inset-0 rounded-full bg-surface shadow-[var(--shadow-card)]"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            <span className="relative flex items-baseline gap-1.5">
              {t(opt.labelKey)}
              <span className="text-[11px] font-normal text-subtle">
                {t(opt.hintKey)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}