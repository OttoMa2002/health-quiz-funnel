"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { TOTAL_STEPS, getStepFromPath } from "@/lib/quiz-config";
import { QuizProgressBar } from "./QuizProgressBar";

export function QuizShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const step = getStepFromPath(pathname) ?? 1;
  const backHref = step <= 1 ? "/" : `/quiz/step-${step - 1}`;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-5 py-4">
          <Link
            href={backHref}
            aria-label="返回"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <QuizProgressBar current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      <main className="relative flex flex-1 items-stretch justify-center overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl px-5 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}