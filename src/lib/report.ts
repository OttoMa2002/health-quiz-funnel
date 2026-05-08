import type { Frequency, Goal } from "@/store/quiz";

export type BmiCategory = "偏瘦" | "正常" | "偏胖" | "肥胖";
export type BmiTone = "warning" | "normal" | "danger";
export type Direction = "lose" | "gain" | "maintain";

export interface BmiInfo {
  value: number;
  category: BmiCategory;
  tone: BmiTone;
}

export interface TrendPoint {
  daysFromStart: number;
  date: Date;
  weightKg: number;
}

export interface ReportInput {
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  goal: Goal;
  frequency: Frequency;
}

export interface ReportResult {
  bmi: BmiInfo;
  weeklyRateKg: number;
  weeksToTarget: number;
  targetDate: Date;
  totalChangeKg: number;
  direction: Direction;
  trend: TrendPoint[];
}

const GOAL_BASE_RATE_KG_PER_WEEK: Record<Goal, number> = {
  lose: 0.6,
  gain: 0.35,
  tone: 0.25,
};

const FREQUENCY_MULTIPLIER: Record<Frequency, number> = {
  rarely: 0.7,
  "1-2": 0.85,
  "3-4": 1.0,
  daily: 1.15,
};

const MIN_WEEKS = 4;
const MAX_WEEKS = 52;
const MAINTAIN_THRESHOLD_KG = 0.5;
const MAINTAIN_DEFAULT_WEEKS = 8;

export function computeBmi(weightKg: number, heightCm: number): BmiInfo {
  const m = heightCm / 100;
  const value = Math.round((weightKg / (m * m)) * 10) / 10;
  if (value < 18.5) return { value, category: "偏瘦", tone: "warning" };
  if (value < 24) return { value, category: "正常", tone: "normal" };
  if (value < 28) return { value, category: "偏胖", tone: "warning" };
  return { value, category: "肥胖", tone: "danger" };
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeReport(input: ReportInput): ReportResult {
  const { weightKg, targetWeightKg, heightCm, goal, frequency } = input;

  const bmi = computeBmi(weightKg, heightCm);
  const weeklyRateKg =
    Math.round(GOAL_BASE_RATE_KG_PER_WEEK[goal] * FREQUENCY_MULTIPLIER[frequency] * 100) / 100;

  const delta = weightKg - targetWeightKg;
  const direction: Direction =
    Math.abs(delta) < MAINTAIN_THRESHOLD_KG ? "maintain" : delta > 0 ? "lose" : "gain";

  const rawWeeks = direction === "maintain"
    ? MAINTAIN_DEFAULT_WEEKS
    : Math.abs(delta) / weeklyRateKg;
  const weeksToTarget = Math.max(MIN_WEEKS, Math.min(MAX_WEEKS, Math.round(rawWeeks)));

  const today = startOfToday();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + weeksToTarget * 7);

  const totalDays = weeksToTarget * 7;
  const sampleCount = Math.min(weeksToTarget, 12);
  const trend: TrendPoint[] = [];
  for (let i = 0; i <= sampleCount; i++) {
    const t = i / sampleCount;
    // Ease-out: progress is faster early, decelerates near goal — feels realistic.
    const eased = 1 - Math.pow(1 - t, 1.6);
    const daysFromStart = Math.round(t * totalDays);
    const date = new Date(today);
    date.setDate(today.getDate() + daysFromStart);
    const w = direction === "maintain"
      ? weightKg
      : weightKg + (targetWeightKg - weightKg) * eased;
    trend.push({
      daysFromStart,
      date,
      weightKg: Math.round(w * 10) / 10,
    });
  }

  return {
    bmi,
    weeklyRateKg,
    weeksToTarget,
    targetDate,
    totalChangeKg: Math.round(Math.abs(delta) * 10) / 10,
    direction,
    trend,
  };
}

export function formatReportDate(date: Date): string {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
}

export function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}