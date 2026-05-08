"use client";

import type { ChangeEvent } from "react";

interface NumberFieldProps {
  label?: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  unit: string;
  placeholder?: string;
  error?: string;
  onBlur?: () => void;
  /** Hard cap on input — values above are clamped. */
  max?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  error,
  onBlur,
  max,
}: NumberFieldProps) {
  const display = value === undefined ? "" : String(value);
  const hasError = Boolean(error);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    if (raw === "") {
      onChange(undefined);
      return;
    }
    let next = Number.parseInt(raw, 10);
    if (!Number.isFinite(next)) {
      onChange(undefined);
      return;
    }
    if (max !== undefined && next > max) next = max;
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-2xl border bg-surface px-4 py-3 transition-colors ${
          hasError
            ? "border-danger"
            : "border-border focus-within:border-foreground/40"
        }`}
      >
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base font-medium text-foreground placeholder:text-subtle focus:outline-none"
        />
        <span className="ml-3 shrink-0 text-sm text-muted">{unit}</span>
      </div>
      {hasError && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}