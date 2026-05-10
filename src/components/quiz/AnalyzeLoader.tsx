"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useT, type I18nKey } from "@/lib/i18n";

const ITEM_KEYS: I18nKey[] = [
  "analyzing.msg1",
  "analyzing.msg2",
  "analyzing.msg3",
  "analyzing.msg4",
];

const TOTAL_DURATION_MS = 3500;
const PER_ITEM_MS = TOTAL_DURATION_MS / ITEM_KEYS.length;

interface AnalyzeLoaderProps {
  onComplete?: () => void;
}

export function AnalyzeLoader({ onComplete }: AnalyzeLoaderProps) {
  const t = useT();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const transitions = ITEM_KEYS.map((_, idx) =>
      window.setTimeout(
        () => {
          setActiveIdx(idx + 1);
        },
        PER_ITEM_MS * (idx + 1),
      ),
    );

    const completeTimeout = window.setTimeout(() => {
      onComplete?.();
    }, TOTAL_DURATION_MS);

    return () => {
      transitions.forEach(window.clearTimeout);
      window.clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <ul className="flex w-full max-w-xs flex-col" role="list">
      {ITEM_KEYS.map((key, idx) => {
        const status: "done" | "active" | "pending" =
          idx < activeIdx ? "done" : idx === activeIdx ? "active" : "pending";
        const isLast = idx === ITEM_KEYS.length - 1;

        return (
          <li key={key} className="relative flex items-start gap-4 pb-7 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-px overflow-hidden bg-border"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleY: idx < activeIdx ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "top" }}
                  className="block h-full w-full bg-accent"
                />
              </span>
            )}

            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              {status === "pending" && (
                <span className="h-2.5 w-2.5 rounded-full border border-border-strong" />
              )}

              {status === "active" && (
                <>
                  <motion.span
                    aria-hidden
                    animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute h-3 w-3 rounded-full bg-accent"
                  />
                  <span className="relative h-3 w-3 rounded-full bg-accent" />
                </>
              )}

              {status === "done" && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground"
                >
                  <Check size={14} strokeWidth={3} />
                </motion.span>
              )}
            </span>

            <motion.span
              animate={{
                opacity: status === "pending" ? 0.45 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`pt-0.5 text-[15px] leading-6 ${
                status === "active"
                  ? "font-semibold text-foreground"
                  : status === "done"
                    ? "text-muted"
                    : "text-subtle"
              }`}
            >
              {t(key)}
            </motion.span>
          </li>
        );
      })}
    </ul>
  );
}