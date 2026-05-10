"use client";

import { Moon, Sun } from "lucide-react";
import { useQuizStore } from "@/store/quiz";

export function ThemeToggle() {
  const theme = useQuizStore((s) => s.theme);
  const setTheme = useQuizStore((s) => s.setTheme);

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
      suppressHydrationWarning
    >
      <Icon size={13} strokeWidth={2.2} suppressHydrationWarning />
    </button>
  );
}