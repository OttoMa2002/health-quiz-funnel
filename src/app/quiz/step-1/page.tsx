"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRound, type LucideIcon } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { useT } from "@/lib/i18n";
import { useQuizStore, type Gender } from "@/store/quiz";

interface OptionMeta {
  value: Gender;
  labelKey: "step1.male" | "step1.female";
  hintKey: "step1.maleHint" | "step1.femaleHint";
  Icon: LucideIcon;
}

const OPTIONS: OptionMeta[] = [
  { value: "male", labelKey: "step1.male", hintKey: "step1.maleHint", Icon: User },
  { value: "female", labelKey: "step1.female", hintKey: "step1.femaleHint", Icon: UserRound },
];

const ADVANCE_DELAY_MS = 240;

export default function Step1Page() {
  const router = useRouter();
  const t = useT();
  const [locked, setLocked] = useState(false);
  const gender = useQuizStore((s) => s.gender);
  const setGender = useQuizStore((s) => s.setGender);

  const handlePick = (value: Gender) => {
    if (locked) return;
    setLocked(true);
    setGender(value);
    window.setTimeout(() => router.push("/quiz/step-2"), ADVANCE_DELAY_MS);
  };

  return (
    <section className="space-y-7">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Step 1 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          {t("step1.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          {t("step1.subtitle")}
        </p>
      </header>

      <div className="space-y-3">
        {OPTIONS.map(({ value, labelKey, hintKey, Icon }) => (
          <OptionCard
            key={value}
            label={t(labelKey)}
            description={t(hintKey)}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={gender === value}
            onSelect={() => handlePick(value)}
          />
        ))}
      </div>
    </section>
  );
}