"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { LangToggle } from "@/components/quiz/LangToggle";
import { ThemeToggle } from "@/components/quiz/ThemeToggle";

export default function Home() {
  const t = useT();
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-20%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--color-accent-soft)_0%,_transparent_70%)] opacity-70"
      />

      <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
        <ThemeToggle />
        <LangToggle />
      </div>

      <div className="relative flex w-full max-w-md flex-col items-center text-center">

        <h1 className="mt-5 text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-[44px]">
          {t("home.titleLine1")}<br />
          {t("home.titleLine2")}
        </h1>

        <p className="max-w-sm text-[15px] leading-relaxed text-muted">
          {t("home.subtitle")}
        </p>

        <Link
          href="/quiz/step-1"
          className="group mt-10 inline-flex h-14 w-full items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(253,208,0,0.55)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_10px_32px_-8px_rgba(253,208,0,0.65)] active:scale-[0.985]"
        >
          {t("home.cta")}
          <svg
            className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>

        <p className="mt-4 text-xs text-subtle">{t("home.footnote")}</p>
      </div>
    </main>
  );
}