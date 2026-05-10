"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Armchair,
  Bike,
  Footprints,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { useT, type I18nKey } from "@/lib/i18n";
import { useQuizStore, type Frequency } from "@/store/quiz";

interface OptionMeta {
  value: Frequency;
  labelKey: I18nKey;
  descKey: I18nKey;
  Icon: LucideIcon;
}

const FREQUENCY_OPTIONS: OptionMeta[] = [
  { value: "rarely", labelKey: "step4.rarelyLabel", descKey: "step4.rarelyDesc", Icon: Armchair },
  { value: "1-2", labelKey: "step4.weekly12Label", descKey: "step4.weekly12Desc", Icon: Footprints },
  { value: "3-4", labelKey: "step4.weekly34Label", descKey: "step4.weekly34Desc", Icon: Bike },
  { value: "daily", labelKey: "step4.dailyLabel", descKey: "step4.dailyDesc", Icon: Zap },
];

const ADVANCE_DELAY_MS = 240;

export default function Step4Page() {
  const router = useRouter();
  const t = useT();
  const [locked, setLocked] = useState(false);
  const frequency = useQuizStore((s) => s.frequency);
  const setFrequency = useQuizStore((s) => s.setFrequency);

  const handlePick = (value: Frequency) => {
    if (locked) return;
    setLocked(true);
    setFrequency(value);
    window.setTimeout(() => {
      router.push("/quiz/analyzing");
    }, ADVANCE_DELAY_MS);
  };

  return (
    <section className="space-y-7">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Step 4 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          {t("step4.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          {t("step4.subtitle")}
        </p>
      </header>

      <div className="space-y-3">
        {FREQUENCY_OPTIONS.map(({ value, labelKey, descKey, Icon }) => (
          <OptionCard
            key={value}
            label={t(labelKey)}
            description={t(descKey)}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={frequency === value}
            onSelect={() => handlePick(value)}
          />
        ))}
      </div>
    </section>
  );
}