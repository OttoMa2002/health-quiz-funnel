"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface OptionCardProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  disabled = false,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={`group relative flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius-card)] border p-4 text-left transition-all duration-200 ease-out disabled:cursor-not-allowed ${
        selected
          ? "border-accent bg-accent-soft/30 shadow-[var(--shadow-card-hover)]"
          : "border-border bg-surface hover:border-border-strong hover:shadow-[var(--shadow-card)]"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
          selected
            ? "scale-105 bg-accent text-accent-foreground"
            : "bg-surface-2 text-foreground"
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-base font-semibold text-foreground">{label}</span>
        {description && (
          <span className="text-[13px] leading-snug text-muted">
            {description}
          </span>
        )}
      </div>

      <div className="relative h-6 w-6 shrink-0">
        <motion.div
          initial={false}
          animate={{
            scale: selected ? 1 : 0,
            opacity: selected ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-accent text-accent-foreground"
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      </div>
    </motion.button>
  );
}