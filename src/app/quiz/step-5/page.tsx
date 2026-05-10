"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, TrendingUp, Target, Calendar } from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import { computeReport } from "@/lib/report";
import { useT, useLocale, formatDate } from "@/lib/i18n";
import { kgToLb } from "@/lib/units";
import { WeightTrendChart } from "@/components/quiz/WeightTrendChart";
import { PriceModal } from "@/components/quiz/PriceModal";

// SSR-safe: server returns false, client subscribes to persist hydration.
const subscribeHydration = (cb: () => void) =>
  useQuizStore.persist.onFinishHydration(cb);
const getHydrationSnapshot = () => useQuizStore.persist.hasHydrated();
const getHydrationServerSnapshot = () => false;

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getHydrationServerSnapshot,
  );
}

export default function Step5Page() {
  const hydrated = useHasHydrated();
  const t = useT();
  const locale = useLocale();
  const [modalOpen, setModalOpen] = useState(false);

  const goal = useQuizStore((s) => s.goal);
  const frequency = useQuizStore((s) => s.frequency);
  const heightCm = useQuizStore((s) => s.heightCm);
  const weightKg = useQuizStore((s) => s.weightKg);
  const targetWeightKg = useQuizStore((s) => s.targetWeightKg);
  const unit = useQuizStore((s) => s.unit);

  const ready =
    hydrated &&
    goal != null &&
    frequency != null &&
    heightCm != null &&
    weightKg != null &&
    targetWeightKg != null;

  const report = useMemo(() => {
    if (!ready) return null;
    return computeReport({
      weightKg: weightKg!,
      targetWeightKg: targetWeightKg!,
      heightCm: heightCm!,
      goal: goal!,
      frequency: frequency!,
    });
  }, [ready, weightKg, targetWeightKg, heightCm, goal, frequency]);

  if (!hydrated) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-pulse rounded-full bg-border-strong" />
      </section>
    );
  }

  if (!report) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          {t("step5.missingTitle")}
        </h1>
        <p className="text-sm text-muted">{t("step5.missingHint")}</p>
        <Link
          href="/quiz/step-1"
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground"
        >
          {t("step5.restart")}
        </Link>
      </section>
    );
  }

  const isImperial = unit === "imperial";
  const wUnit = isImperial ? "lb" : "kg";
  const toDisplay = (kg: number) =>
    isImperial ? Math.round(kgToLb(kg) * 10) / 10 : Math.round(kg * 10) / 10;

  const startWeight = toDisplay(weightKg!);
  const endWeight = toDisplay(targetWeightKg!);
  const totalChange = toDisplay(report.totalChangeKg);
  const weeklyRate = toDisplay(report.weeklyRateKg);

  const chartPoints = report.trend.map((p) => ({
    x: p.daysFromStart,
    y: toDisplay(p.weightKg),
    date: p.date,
  }));

  const DirectionIcon =
    report.direction === "gain" ? TrendingUp : TrendingDown;

  // BMI tone → color class
  const bmiToneClass =
    report.bmi.tone === "normal"
      ? "text-success"
      : report.bmi.tone === "danger"
        ? "text-danger"
        : "text-foreground";

  const badgeText =
    report.direction === "maintain"
      ? t("step5.badgeMaintain")
      : report.direction === "lose"
        ? t("step5.badgeLose", { amount: totalChange, unit: wUnit })
        : t("step5.badgeGain", { amount: totalChange, unit: wUnit });

  const insight =
    report.direction === "maintain"
      ? t("step5.insightMaintain")
      : report.direction === "lose"
        ? t("step5.insightLose", { rate: weeklyRate, unit: wUnit })
        : t("step5.insightGain", { rate: weeklyRate, unit: wUnit });

  const targetDateStr = formatDate(report.targetDate, locale);

  // Stagger: show each card in sequence on mount.
  const card = (i: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="space-y-6 pb-8">
      <motion.header className="space-y-3" {...card(0)}>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          <Sparkles size={12} strokeWidth={2.4} /> {t("step5.eyebrow")}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          {t("step5.titleLine1")}<br />{t("step5.titleLine2")}
        </h1>
      </motion.header>

      {/* Stat row: BMI + Target date */}
      <motion.div className="grid grid-cols-2 gap-3" {...card(1)}>
        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-subtle">
            {t("step5.bmiLabel")}
          </div>
          <div className={`mt-1 text-3xl font-semibold tracking-tight ${bmiToneClass}`}>
            {report.bmi.value}
          </div>
          <div className="mt-1 text-xs text-muted">{t(`bmi.${report.bmi.category}`)}</div>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-subtle">
            <Calendar size={11} strokeWidth={2.2} /> {t("step5.targetDateLabel")}
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {report.weeksToTarget}
            <span className="ml-1 text-base font-medium text-muted">{t("step5.weeksUnit")}</span>
          </div>
          <div className="mt-1 text-xs text-muted">
            {targetDateStr}
          </div>
        </div>
      </motion.div>

      {/* Trend chart */}
      <motion.div
        className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
        {...card(2)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-foreground">
              {t("step5.trendTitle")}
            </div>
            <div className="mt-0.5 text-xs text-muted">
              {t("step5.trendRange", { date: targetDateStr })}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-foreground">
            <DirectionIcon size={12} strokeWidth={2.4} />
            {badgeText}
          </div>
        </div>

        <div className="mt-4 -mx-1">
          <WeightTrendChart
            points={chartPoints}
            unitLabel={wUnit}
            startWeight={startWeight}
            endWeight={endWeight}
          />
        </div>
      </motion.div>

      {/* Insight */}
      <motion.div
        className="flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-accent-soft/40 p-4"
        {...card(3)}
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Target size={16} strokeWidth={2.2} />
        </div>
        <p className="text-sm leading-relaxed text-foreground">{insight}</p>
      </motion.div>

      {/* CTA */}
      <motion.div className="space-y-3" {...card(4)}>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(234,179,8,0.6)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_10px_32px_-8px_rgba(234,179,8,0.7)] active:scale-[0.985]"
        >
          {t("step5.cta")}
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
        </button>
        <p className="text-center text-xs text-subtle">
          {t("step5.disclaimer")}
        </p>
      </motion.div>

      <PriceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}