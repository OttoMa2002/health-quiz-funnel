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
import { useQuizStore, type Frequency } from "@/store/quiz";

interface OptionMeta {
  value: Frequency;
  label: string;
  description: string;
  Icon: LucideIcon;
}

const FREQUENCY_OPTIONS: OptionMeta[] = [
  {
    value: "rarely",
    label: "几乎不运动",
    description: "目前基本不动",
    Icon: Armchair,
  },
  {
    value: "1-2",
    label: "每周 1–2 次",
    description: "偶尔走走或周末活动",
    Icon: Footprints,
  },
  {
    value: "3-4",
    label: "每周 3–4 次",
    description: "已经形成训练习惯",
    Icon: Bike,
  },
  {
    value: "daily",
    label: "每天坚持",
    description: "训练已经是日常",
    Icon: Zap,
  },
];

const ADVANCE_DELAY_MS = 240;

export default function Step4Page() {
  const router = useRouter();
  const [locked, setLocked] = useState(false);
  const frequency = useQuizStore((s) => s.frequency);
  const setFrequency = useQuizStore((s) => s.setFrequency);

  const handlePick = (value: Frequency) => {
    if (locked) return;
    setLocked(true);
    setFrequency(value);
    window.setTimeout(() => {
      router.push("/quiz/step-5");
    }, ADVANCE_DELAY_MS);
  };

  return (
    <section className="space-y-7">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Step 4 / 6
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          你目前的运动频率？
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          诚实选最贴近的一项 —— 方案会根据你的当前水平来制定。
        </p>
      </header>

      <div className="space-y-3">
        {FREQUENCY_OPTIONS.map(({ value, label, description, Icon }) => (
          <OptionCard
            key={value}
            label={label}
            description={description}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={frequency === value}
            onSelect={() => handlePick(value)}
            disabled={locked}
          />
        ))}
      </div>
    </section>
  );
}