"use client";

import { useCallback } from "react";
import { useQuizStore } from "@/store/quiz";
import { DICTS, type Dict, type Locale } from "./dict";

export type { Locale };
export { DICTS, SUPPORTED_LOCALES } from "./dict";

// Build a dot-path union of all string-leaf keys, e.g. "home.cta" | "step3.title".
type DotPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? P extends ""
      ? K
      : `${P}.${K}`
    : T[K] extends object
      ? DotPath<T[K], P extends "" ? K : `${P}.${K}`>
      : never;
}[keyof T & string];

export type I18nKey = DotPath<Dict>;

type Vars = Record<string, string | number>;

function resolve(dict: Dict, key: string): string {
  const parts = key.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur != null && typeof cur === "object" && p in cur) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof cur === "string" ? cur : key;
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_m, name: string) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}

export function useT() {
  const locale = useQuizStore((s) => s.locale);
  return useCallback(
    (key: I18nKey, vars?: Vars) => interpolate(resolve(DICTS[locale], key), vars),
    [locale],
  );
}

export function useLocale(): Locale {
  return useQuizStore((s) => s.locale);
}

export function useSetLocale() {
  return useQuizStore((s) => s.setLocale);
}

/**
 * Format a Date according to current locale using the dictionary's "date.full" template.
 * Saves us writing locale-specific formatters everywhere.
 */
export function formatDate(date: Date, locale: Locale): string {
  const tpl = resolve(DICTS[locale], "date.full");
  return interpolate(tpl, {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}