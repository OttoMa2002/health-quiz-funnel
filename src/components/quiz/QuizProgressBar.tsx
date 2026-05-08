"use client";

import { motion } from "framer-motion";

export function QuizProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const clamped = Math.max(0, Math.min(current, total));
  const pct = (clamped / total) * 100;

  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted">
        {clamped}/{total}
      </span>
    </div>
  );
}