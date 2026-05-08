"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "正在分析你的身体数据...",
  "计算你的 BMI...",
  "评估你的代谢效率...",
  "生成个性化方案...",
  "马上完成...",
];

const TOTAL_DURATION_MS = 3500;
const MESSAGE_INTERVAL_MS = 700;

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface AnalyzeLoaderProps {
  onComplete?: () => void;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function AnalyzeLoader({ onComplete }: AnalyzeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let completed = false;

    const tick = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);
      setProgress(easeOutQuart(t));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!completed) {
        completed = true;
        onComplete?.();
      }
    };

    raf = requestAnimationFrame(tick);

    const messageInterval = window.setInterval(() => {
      setMessageIdx((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, MESSAGE_INTERVAL_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(messageInterval);
    };
  }, [onComplete]);

  const percent = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <div className="relative flex h-44 w-44 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--color-surface-2)"
            strokeWidth="4"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <div className="relative flex items-baseline tabular-nums">
          <span className="text-5xl font-semibold text-foreground">
            {percent}
          </span>
          <span className="ml-1 text-base text-muted">%</span>
        </div>
      </div>

      <div
        className="flex h-7 items-center justify-center"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-base font-medium text-foreground"
          >
            {MESSAGES[messageIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
