"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Gender = "male" | "female";
export type Goal = "lose" | "gain" | "tone";
export type Frequency = "rarely" | "1-2" | "3-4" | "daily";
export type Unit = "metric" | "imperial";

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

  setGender: (v: Gender) => void;
  setGoal: (v: Goal) => void;
  setUnit: (v: Unit) => void;
  setAge: (v: number | null) => void;
  setHeightCm: (v: number | null) => void;
  setWeightKg: (v: number | null) => void;
  setTargetWeightKg: (v: number | null) => void;
  setTargetIsAuto: (v: boolean) => void;
  setFrequency: (v: Frequency) => void;
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
      reset: () => set(initialData),
    }),
    {
      name: "hqf:quiz",
      version: 1,
    },
  ),
);