"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useQuizStore, type Unit } from "@/store/quiz";
import { UnitToggle } from "@/components/quiz/UnitToggle";
import { NumberField } from "@/components/quiz/NumberField";
import { TOTAL_STEPS } from "@/lib/quiz-config";
import { recommendTargetWeightKg } from "@/lib/report";
import { useT } from "@/lib/i18n";
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

type T = ReturnType<typeof useT>;

function validate(input: FormInput, unit: Unit, t: T): FormErrors {
  const errors: FormErrors = {};

  if (input.age == null) {
    errors.age = t("step3.errAgeRequired");
  } else if (input.age < RANGES.age.min || input.age > RANGES.age.max) {
    errors.age = t("step3.errAgeRange", {
      min: RANGES.age.min,
      max: RANGES.age.max,
    });
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
    errors.heightCm = t("step3.errHeightRequired");
  } else if (
    input.heightCm < RANGES.heightCm.min ||
    input.heightCm > RANGES.heightCm.max
  ) {
    errors.heightCm = t("step3.errHeightRange", { range: heightRange });
  }

  if (input.weightKg == null) {
    errors.weightKg = t("step3.errWeightRequired");
  } else if (
    input.weightKg < RANGES.weightKg.min ||
    input.weightKg > RANGES.weightKg.max
  ) {
    errors.weightKg = t("step3.errWeightRange", { range: weightRange });
  }

  if (input.targetWeightKg == null) {
    errors.targetWeightKg = t("step3.errTargetRequired");
  } else if (
    input.targetWeightKg < RANGES.weightKg.min ||
    input.targetWeightKg > RANGES.weightKg.max
  ) {
    errors.targetWeightKg = t("step3.errTargetRange", { range: weightRange });
  }

  return errors;
}

type FieldKey = keyof FormErrors;

export default function Step3Page() {
  const router = useRouter();
  const t = useT();

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

  const errors = validate({ age, heightCm, weightKg, targetWeightKg }, unit, t);
  if (targetIsAuto) delete errors.targetWeightKg;
  const allValid = Object.keys(errors).length === 0;

  const visibleError = (k: FieldKey) =>
    touched[k] ? errors[k] : undefined;
  const touch = (k: FieldKey) =>
    setTouched((prev) => ({ ...prev, [k]: true }));

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
          3 / {TOTAL_STEPS}
        </p>
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[32px]">
          {t("step3.title")}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted">
          {t("step3.subtitle")}
        </p>
      </header>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{t("step3.unitLabel")}</span>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      <div className="space-y-4">
        <NumberField
          label={t("step3.age")}
          value={age ?? undefined}
          onChange={(v) => setAge(v ?? null)}
          unit={t("step3.ageUnit")}
          placeholder={t("step3.agePlaceholder")}
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
          label={t("step3.weight")}
          unit={unit}
          weightKg={weightKg}
          onChange={setWeightKg}
          metricPlaceholder={t("step3.weightPlaceholderKg")}
          imperialPlaceholder={t("step3.weightPlaceholderLb")}
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
              label={t("step3.targetWeight")}
              unit={unit}
              weightKg={targetWeightKg}
              onChange={setTargetWeightKg}
              metricPlaceholder={t("step3.targetPlaceholderKg")}
              imperialPlaceholder={t("step3.targetPlaceholderLb")}
              error={visibleError("targetWeightKg")}
              onBlur={() => touch("targetWeightKg")}
            />
            <button
              type="button"
              onClick={() => setTargetIsAuto(true)}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              <Sparkles size={11} strokeWidth={2.4} />
              {t("step3.targetUseRec")}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allValid}
        className="group inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-accent-foreground shadow-[0_8px_24px_-8px_rgba(253,208,0,0.55)] transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_10px_32px_-8px_rgba(253,208,0,0.65)] active:scale-[0.985] disabled:pointer-events-none disabled:bg-surface-2 disabled:text-subtle disabled:shadow-none"
      >
        {t("step3.submit")}
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
  const t = useT();
  if (unit === "metric") {
    return (
      <NumberField
        label={t("step3.height")}
        value={heightCm ?? undefined}
        onChange={(v) => onChange(v ?? null)}
        unit="cm"
        placeholder={t("step3.heightPlaceholderCm")}
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
      <label className="block text-sm font-medium text-foreground">{t("step3.height")}</label>
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
  metricPlaceholder,
  imperialPlaceholder,
  error,
  onBlur,
}: {
  label: string;
  unit: Unit;
  weightKg: number | null;
  onChange: (v: number | null) => void;
  metricPlaceholder: string;
  imperialPlaceholder: string;
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
        placeholder={metricPlaceholder}
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
      placeholder={imperialPlaceholder}
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
  const t = useT();
  const display =
    valueKg == null
      ? null
      : unit === "metric"
        ? { value: Math.round(valueKg), suffix: "kg" }
        : { value: Math.round(kgToLb(valueKg)), suffix: "lb" };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{t("step3.targetWeight")}</label>
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
              {display ? t("step3.targetRecHint") : t("step3.targetRecPending")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
            <Sparkles size={10} strokeWidth={2.5} />
            {t("common.recommendBadge")}
          </span>
        </div>
        <button
          type="button"
          onClick={onCustomize}
          className="mt-3 cursor-pointer text-xs font-medium text-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
        >
          {t("step3.targetCustomize")}
        </button>
      </div>
    </div>
  );
}