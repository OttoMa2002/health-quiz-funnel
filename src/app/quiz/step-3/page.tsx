"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore, type Unit } from "@/store/quiz";
import { UnitToggle } from "@/components/quiz/UnitToggle";
import { NumberField } from "@/components/quiz/NumberField";
import { cmToFtIn, ftInToCm, kgToLb, lbToKg } from "@/lib/units";

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

function validate(input: FormInput): FormErrors {
  const errors: FormErrors = {};

  if (input.age == null) {
    errors.age = "请输入年龄";
  } else if (input.age < RANGES.age.min || input.age > RANGES.age.max) {
    errors.age = `年龄需在 ${RANGES.age.min}–${RANGES.age.max} 岁之间`;
  }

  if (input.heightCm == null) {
    errors.heightCm = "请输入身高";
  } else if (
    input.heightCm < RANGES.heightCm.min ||
    input.heightCm > RANGES.heightCm.max
  ) {
    errors.heightCm = `身高需在 ${RANGES.heightCm.min}–${RANGES.heightCm.max} cm 之间`;
  }

  if (input.weightKg == null) {
    errors.weightKg = "请输入体重";
  } else if (
    input.weightKg < RANGES.weightKg.min ||
    input.weightKg > RANGES.weightKg.max
  ) {
    errors.weightKg = `体重需在 ${RANGES.weightKg.min}–${RANGES.weightKg.max} kg 之间`;
  }

  if (input.targetWeightKg == null) {
    errors.targetWeightKg = "请输入目标体重";
  } else if (
    input.targetWeightKg < RANGES.weightKg.min ||
    input.targetWeightKg > RANGES.weightKg.max
  ) {
    errors.targetWeightKg = `目标体重需在 ${RANGES.weightKg.min}–${RANGES.weightKg.max} kg 之间`;
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
  const unit = useQuizStore((s) => s.unit);
  const setAge = useQuizStore((s) => s.setAge);
  const setHeightCm = useQuizStore((s) => s.setHeightCm);
  const setWeightKg = useQuizStore((s) => s.setWeightKg);
  const setTargetWeightKg = useQuizStore((s) => s.setTargetWeightKg);
  const setUnit = useQuizStore((s) => s.setUnit);

  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    age: false,
    heightCm: false,
    weightKg: false,
    targetWeightKg: false,
  });

  const errors = validate({ age, heightCm, weightKg, targetWeightKg });
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
          Step 3 / 6
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

        <WeightField
          label="目标体重"
          unit={unit}
          weightKg={targetWeightKg}
          onChange={setTargetWeightKg}
          error={visibleError("targetWeightKg")}
          onBlur={() => touch("targetWeightKg")}
        />
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
        value={weightKg ?? undefined}
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
      onChange={(v) => onChange(v == null ? null : Math.round(lbToKg(v)))}
      unit="lb"
      placeholder={label === "目标体重" ? "例如 143" : "例如 154"}
      max={1000}
      error={error}
      onBlur={onBlur}
    />
  );
}