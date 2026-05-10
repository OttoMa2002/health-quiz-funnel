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
  /**
   * "minimal" = no card border, larger icon, outlined icon-frame, no checkmark.
   * The "Claude-beige" `bg-surface-2` icon box is replaced by a thin outlined
   * frame to break that pattern.
   */
  variant?: "default" | "minimal";
}

export function OptionCard({
  label,
  description,
  icon,
  selected,
  onSelect,
  disabled = false,
  variant = "default",
}: OptionCardProps) {
  const isMinimal = variant === "minimal";

  const outerClasses = isMinimal
    ? selected
      ? "bg-accent-soft/35 shadow-[var(--shadow-card)]"
      : "bg-surface hover:shadow-[var(--shadow-card)]"
    : selected
      ? "border border-accent bg-accent-soft/30 shadow-[var(--shadow-card-hover)]"
      : "border border-border bg-surface hover:border-border-strong hover:shadow-[var(--shadow-card)]";

  // Minimal icon box: a slightly cool neutral instead of the Claude-style
  // warm beige (was bg-surface-2). Distinct from card surface and page bg
  // without being aggressive.
  const iconBox = isMinimal
    ? selected
      ? "h-16 w-16 bg-accent text-accent-foreground"
      : "h-16 w-16 bg-[#ebebe7] text-foreground dark:bg-[#1f1f1c]"
    : selected
      ? "h-14 w-14 scale-105 bg-accent text-accent-foreground"
      : "h-14 w-14 bg-surface-2 text-foreground";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={`group relative flex w-full cursor-pointer items-center rounded-[var(--radius-card)] p-4 text-left transition-all duration-200 ease-out disabled:cursor-not-allowed ${
        isMinimal ? "gap-5" : "gap-4"
      } ${outerClasses}`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${iconBox}`}
      >
        {icon}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span
          className={`font-semibold text-foreground ${
            isMinimal ? "text-lg" : "text-base"
          }`}
        >
          {label}
        </span>
        {description && (
          <span
            className={`leading-snug text-muted ${
              isMinimal ? "text-[11px]" : "text-[13px]"
            }`}
          >
            {description}
          </span>
        )}
      </div>

      {!isMinimal && (
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
      )}
    </motion.button>
  );
}