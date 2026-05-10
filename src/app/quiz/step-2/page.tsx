"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Flame,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { useT, type I18nKey } from "@/lib/i18n";
import { useQuizStore, type Goal } from "@/store/quiz";

interface OptionMeta {
  value: Goal;
  labelKey: I18nKey;
  descKey: I18nKey;
  Icon: LucideIcon;
}

const OPTIONS: OptionMeta[] = [
  { value: "lose", labelKey: "step2.loseLabel", descKey: "step2.loseDesc", Icon: Flame },
  { value: "gain", labelKey: "step2.gainLabel", descKey: "step2.gainDesc", Icon: Dumbbell },
  { value: "tone", labelKey: "step2.toneLabel", descKey: "step2.toneDesc", Icon: Sparkles },
];

const ADVANCE_DELAY_MS = 240;

export default function Step2Page() {
  const router = useRouter();
  const t = useT();
  const [locked, setLocked] = useState(false);
  const goal = useQuizStore((s) => s.goal);
  const setGoal = useQuizStore((s) => s.setGoal);

  const handlePick = (value: Goal) => {
    if (locked) return;
    setLocked(true);
    setGoal(value);
    window.setTimeout(() => router.push("/quiz/step-3"), ADVANCE_DELAY_MS);
  };

  return (
    <section className="space-y-7">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          2 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          {t("step2.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          {t("step2.subtitle")}
        </p>
      </header>

      <div className="space-y-3">
        {OPTIONS.map(({ value, labelKey, descKey, Icon }) => (
          <OptionCard
            key={value}
            label={t(labelKey)}
            description={t(descKey)}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={goal === value}
            onSelect={() => handlePick(value)}
          />
        ))}
      </div>
    </section>
  );
}