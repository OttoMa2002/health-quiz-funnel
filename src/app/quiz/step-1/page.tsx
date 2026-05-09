"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRound, type LucideIcon } from "lucide-react";
import { OptionCard } from "@/components/quiz/OptionCard";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { useQuizStore, type Gender } from "@/store/quiz";

interface OptionMeta {
  value: Gender;
  label: string;
  description: string;
  Icon: LucideIcon;
}

const OPTIONS: OptionMeta[] = [
  { value: "male", label: "男生", description: "Male", Icon: User },
  { value: "female", label: "女生", description: "Female", Icon: UserRound },
];

const ADVANCE_DELAY_MS = 240;

export default function Step1Page() {
  const router = useRouter();
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
          你的性别？
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          基于性别，方案会有不同的代谢和训练侧重。
        </p>
      </header>

      <div className="space-y-3">
        {OPTIONS.map(({ value, label, description, Icon }) => (
          <OptionCard
            key={value}
            label={label}
            description={description}
            icon={<Icon size={26} strokeWidth={1.6} />}
            selected={gender === value}
            onSelect={() => handlePick(value)}
          />
        ))}
      </div>
    </section>
  );
}