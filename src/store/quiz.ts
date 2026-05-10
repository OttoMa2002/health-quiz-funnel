"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Gender = "male" | "female";
export type Goal = "lose" | "gain" | "tone";
export type Frequency = "rarely" | "1-2" | "3-4" | "daily";
export type Unit = "metric" | "imperial";
export type Locale = "zh" | "en";
export type Theme = "light" | "dark";

export interface QuizState {
  gender: Gender | null;
  goal: Goal | null;
  unit: Unit;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  targetIsAuto: boolean;
  frequency: Frequency | null;
  locale: Locale;
  // True once the user has explicitly toggled language. Auto-detect skips override.
  localeManuallySet: boolean;
  theme: Theme;
  // True once the user has explicitly toggled theme. Auto-detect skips override.
  themeManuallySet: boolean;

  setGender: (v: Gender) => void;
  setGoal: (v: Goal) => void;
  setUnit: (v: Unit) => void;
  setAge: (v: number | null) => void;
  setHeightCm: (v: number | null) => void;
  setWeightKg: (v: number | null) => void;
  setTargetWeightKg: (v: number | null) => void;
  setTargetIsAuto: (v: boolean) => void;
  setFrequency: (v: Frequency) => void;
  setLocale: (v: Locale) => void;
  setLocaleAutoDetected: (v: Locale) => void;
  setTheme: (v: Theme) => void;
  setThemeAutoDetected: (v: Theme) => void;
  reset: () => void;
}

const initialData = {
  gender: null,
  goal: null,
  unit: "metric" as Unit,
  age: null,
  heightCm: null,
  weightKg: null,
  targetWeightKg: null,
  targetIsAuto: true,
  frequency: null,
  locale: "zh" as Locale,
  localeManuallySet: false,
  theme: "light" as Theme,
  themeManuallySet: false,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialData,
      setGender: (v) => set({ gender: v }),
      setGoal: (v) => set({ goal: v }),
      setUnit: (v) => set({ unit: v }),
      setAge: (v) => set({ age: v }),
      setHeightCm: (v) => set({ heightCm: v }),
      setWeightKg: (v) => set({ weightKg: v }),
      setTargetWeightKg: (v) => set({ targetWeightKg: v }),
      setTargetIsAuto: (v) => set({ targetIsAuto: v }),
      setFrequency: (v) => set({ frequency: v }),
      setLocale: (v) => set({ locale: v, localeManuallySet: true }),
      setLocaleAutoDetected: (v) => set({ locale: v }),
      setTheme: (v) => set({ theme: v, themeManuallySet: true }),
      setThemeAutoDetected: (v) => set({ theme: v }),
      reset: () => set(initialData),
    }),
    {
      name: "hqf:quiz",
      version: 1,
    },
  ),
);