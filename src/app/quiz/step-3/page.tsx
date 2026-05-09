"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useQuizStore, type Unit } from "@/store/quiz";
import { UnitToggle } from "@/components/quiz/UnitToggle";
import { NumberField } from "@/components/quiz/NumberField";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { recommendTargetWeightKg } from "@/lib/report";
import { cmToFtIn, cmToInches, ftInToCm, kgToLb, lbToKg } from "@/lib/units";

const RANGES = {
  age: { min: 13, max: 100 },
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 30, max: 300 },
} as const;

interface FormErrors {
  age?: string;
  heightCm?: string;
  weightKg?: string;
  targetWeightKg?: string;
}

interface FormInput {
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
}

function validate(input: FormInput, unit: Unit): FormErrors {
  const errors: FormErrors = {};

  if (input.age == null) {
    errors.age = "请输入年龄";
  } else if (input.age < RANGES.age.min || input.age > RANGES.age.max) {
    errors.age = `年龄需在 ${RANGES.age.min}–${RANGES.age.max} 岁之间`;
  }

  const heightRange =
    unit === "imperial"
      ? (() => {
          // ceil min / floor max — so displayed bounds round-trip back into [min, max] cm.
          const minIn = Math.ceil(cmToInches(RANGES.heightCm.min));
          const maxIn = Math.floor(cmToInches(RANGES.heightCm.max));
          return `${Math.floor(minIn / 12)}'${minIn % 12}"–${Math.floor(maxIn / 12)}'${maxIn % 12}"`;
        })()
      : `${RANGES.heightCm.min}–${RANGES.heightCm.max} cm`;

  const weightRange =
    unit === "imperial"
      ? `${Math.ceil(kgToLb(RANGES.weightKg.min))}–${Math.floor(kgToLb(RANGES.weightKg.max))} lb`
      : `${RANGES.weightKg.min}–${RANGES.weightKg.max} kg`;

  if (input.heightCm == null) {
    errors.heightCm = "请输入身高";
  } else if (
    input.heightCm < RANGES.heightCm.min ||
    input.heightCm > RANGES.heightCm.max
  ) {
    errors.heightCm = `身高需在 ${heightRange} 之间`;
  }

  if (input.weightKg == null) {
    errors.weightKg = "请输入体重";
  } else if (
    input.weightKg < RANGES.weightKg.min ||
    input.weightKg > RANGES.weightKg.max
  ) {
    errors.weightKg = `体重需在 ${weightRange} 之间`;
  }

  if (input.targetWeightKg == null) {
    errors.targetWeightKg = "请输入目标体重";
  } else if (
    input.targetWeightKg < RANGES.weightKg.min ||
    input.targetWeightKg > RANGES.weightKg.max
  ) {
    errors.targetWeightKg = `目标体重需在 ${weightRange} 之间`;
  }

  return errors;
}

type FieldKey = keyof FormErrors;

export default function Step3Page() {
  const router = useRouter();

  const age = useQuizStore((s) => s.age);
  const heightCm = useQuizStore((s) => s.heightCm);
  const weightKg = useQuizStore((s) => s.weightKg);
  const targetWeightKg = useQuizStore((s) => s.targetWeightKg);
  const targetIsAuto = useQuizStore((s) => s.targetIsAuto);
  const goal = useQuizStore((s) => s.goal);
  const unit = useQuizStore((s) => s.unit);
  const setAge = useQuizStore((s) => s.setAge);
  const setHeightCm = useQuizStore((s) => s.setHeightCm);
  const setWeightKg = useQuizStore((s) => s.setWeightKg);
  const setTargetWeightKg = useQuizStore((s) => s.setTargetWeightKg);
  const setTargetIsAuto = useQuizStore((s) => s.setTargetIsAuto);
  const setUnit = useQuizStore((s) => s.setUnit);

  useEffect(() => {
    if (!targetIsAuto) return;
    const recommended = recommendTargetWeightKg(heightCm, goal, weightKg);
    if (recommended != null && recommended !== targetWeightKg) {
      setTargetWeightKg(recommended);
    }
  }, [targetIsAuto, heightCm, goal, weightKg, targetWeightKg, setTargetWeightKg]);

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    age: false,
    heightCm: false,
    weightKg: false,
    targetWeightKg: false,
  });

  const errors = validate({ age, heightCm, weightKg, targetWeightKg }, unit);
  if (targetIsAuto) delete errors.targetWeightKg;
  const allValid = Object.keys(errors).length === 0;

  const visibleError = (k: FieldKey) =>
    touched[k] ? errors[k] : undefined;
  const touch = (k: FieldKey) =>
    setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = () => {
    setTouched({
      age: true,
      heightCm: true,
      weightKg: true,
      targetWeightKg: true,
    });
    if (allValid) router.push("/quiz/step-4");
  };

  return (
    <section className="space-y-7 pb-4">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Step 3 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          你的身体数据
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          我们用这些数据计算 BMI 和你的个性化目标。
        </p>
      </header>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">单位</span>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      <div className="space-y-4">
        <NumberField
          label="年龄"
          value={age ?? undefined}
          onChange={(v) => setAge(v ?? null)}
          unit="岁"
          placeholder="例如 25"
          max={120}
          error={visibleError("age")}
          onBlur={() => touch("age")}
        />

        <HeightField
          unit={unit}
          heightCm={heightCm}
          onChange={setHeightCm}
          error={visibleError("heightCm")}
          onBlur={() => touch("heightCm")}
        />

        <WeightField
          label="当前体重"
          unit={unit}
          weightKg={weightKg}
          onChange={setWeightKg}
          error={visibleError("weightKg")}
          onBlur={() => touch("weightKg")}
        />

        {targetIsAuto ? (
          <RecommendedTargetCard
            unit={unit}
            valueKg={targetWeightKg}
            onCustomize={() => {
              setTargetIsAuto(false);
              touch("targetWeightKg");
            }}
          />
        ) : (
          <div className="space-y-2">
            <WeightField
              label="目标体重"
              unit={unit}
              weightKg={targetWeightKg}
              onChange={setTargetWeightKg}
              error={visibleError("targetWeightKg")}
              onBlur={() => touch("targetWeightKg")}
            />
            <button
              type="button"
              onClick={() => setTargetIsAuto(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              <Sparkles size={11} strokeWidth={2.4} />
              用回系统推荐
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allValid}
        className="group inline-flex h-14 w-full items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(234,179,8,0.6)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_10px_32px_-8px_rgba(234,179,8,0.7)] active:scale-[0.985] disabled:pointer-events-none disabled:bg-surface-2 disabled:text-subtle disabled:shadow-none"
      >
        下一步
      </button>
    </section>
  );
}

function HeightField({
  unit,
  heightCm,
  onChange,
  error,
  onBlur,
}: {
  unit: Unit;
  heightCm: number | null;
  onChange: (v: number | null) => void;
  error?: string;
  onBlur?: () => void;
}) {
  if (unit === "metric") {
    return (
      <NumberField
        label="身高"
        value={heightCm ?? undefined}
        onChange={(v) => onChange(v ?? null)}
        unit="cm"
        placeholder="例如 175"
        max={300}
        error={error}
        onBlur={onBlur}
      />
    );
  }

  const ftIn = heightCm != null ? cmToFtIn(heightCm) : null;
  const ft = ftIn?.ft;
  const inches = ftIn?.in;

  const setFromFtIn = (nextFt: number | undefined, nextIn: number | undefined) => {
    if (nextFt === undefined && nextIn === undefined) {
      onChange(null);
      return;
    }
    onChange(ftInToCm(nextFt ?? 0, nextIn ?? 0));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">身高</label>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          value={ft}
          onChange={(v) => setFromFtIn(v, inches)}
          unit="ft"
          placeholder="ft"
          max={9}
          onBlur={onBlur}
        />
        <NumberField
          value={inches}
          onChange={(v) => setFromFtIn(ft, v)}
          unit="in"
          placeholder="in"
          max={11}
          onBlur={onBlur}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function WeightField({
  label,
  unit,
  weightKg,
  onChange,
  error,
  onBlur,
}: {
  label: string;
  unit: Unit;
  weightKg: number | null;
  onChange: (v: number | null) => void;
  error?: string;
  onBlur?: () => void;
}) {
  if (unit === "metric") {
    return (
      <NumberField
        label={label}
        value={weightKg != null ? Math.round(weightKg) : undefined}
        onChange={(v) => onChange(v ?? null)}
        unit="kg"
        placeholder={label === "目标体重" ? "例如 65" : "例如 70"}
        max={500}
        error={error}
        onBlur={onBlur}
      />
    );
  }

  return (
    <NumberField
      label={label}
      value={weightKg != null ? Math.round(kgToLb(weightKg)) : undefined}
      onChange={(v) => onChange(v == null ? null : lbToKg(v))}
      unit="lb"
      placeholder={label === "目标体重" ? "例如 143" : "例如 154"}
      max={1000}
      error={error}
      onBlur={onBlur}
    />
  );
}

function RecommendedTargetCard({
  unit,
  valueKg,
  onCustomize,
}: {
  unit: Unit;
  valueKg: number | null;
  onCustomize: () => void;
}) {
  const display =
    valueKg == null
      ? null
      : unit === "metric"
        ? { value: valueKg, suffix: "kg" }
        : { value: Math.round(kgToLb(valueKg)), suffix: "lb" };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">目标体重</label>
      <div className="rounded-[var(--radius-card)] border border-accent/40 bg-accent-soft/40 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              {display ? (
                <>
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {display.value}
                  </span>
                  <span className="text-sm text-muted">{display.suffix}</span>
                </>
              ) : (
                <span className="text-2xl font-semibold tracking-tight text-subtle">
                  —
                </span>
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-muted">
              {display
                ? "基于 BMI 22 的健康范围推算"
                : "填写身高后自动计算"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            <Sparkles size={10} strokeWidth={2.5} />
            推荐
          </span>
        </div>
        <button
          type="button"
          onClick={onCustomize}
          className="mt-3 text-xs font-medium text-accent-foreground/80 underline-offset-4 hover:text-accent-foreground hover:underline"
        >
          自定义目标 →
        </button>
      </div>
    </div>
  );
}