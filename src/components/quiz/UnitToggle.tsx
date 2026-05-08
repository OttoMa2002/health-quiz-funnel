"use client";

import { motion } from "framer-motion";
import type { Unit } from "@/store/quiz";

interface UnitToggleProps {
  value: Unit;
  onChange: (v: Unit) => void;
}

const OPTIONS: { value: Unit; label: string; hint: string }[] = [
  { value: "metric", label: "公制", hint: "cm · kg" },
  { value: "imperial", label: "英制", hint: "ft · lb" },
];

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-surface-2 p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
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
              {opt.label}
              <span className="text-[11px] font-normal text-subtle">
                {opt.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}