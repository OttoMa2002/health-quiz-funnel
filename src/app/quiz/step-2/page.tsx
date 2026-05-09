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
import { useQuizStore, type Goal } from "@/store/quiz";

interface OptionMeta {
  value: Goal;
  label: string;
  description: string;
  Icon: LucideIcon;
}

const OPTIONS: OptionMeta[] = [
  {
    value: "lose",
    label: "减脂塑身",
    description: "降低体脂，让线条更清晰",
    Icon: Flame,
  },
  {
    value: "gain",
    label: "增肌增重",
    description: "增加肌肉量与力量",
    Icon: Dumbbell,
  },
  {
    value: "tone",
    label: "保持塑形",
    description: "维持现状，整体提升状态",
    Icon: Sparkles,
  },
];

const ADVANCE_DELAY_MS = 240;

export default function Step2Page() {
  const router = useRouter();
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
          Step 2 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          你的健身目标？
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          选择最贴近的一个。
        </p>
      </header>

      <div className="space-y-3">
        {OPTIONS.map(({ value, label, description, Icon }) => (
          <OptionCard
            key={value}
            label={label}
            description={description}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={goal === value}
            onSelect={() => handlePick(value)}
          />
        ))}
      </div>
    </section>
  );
}