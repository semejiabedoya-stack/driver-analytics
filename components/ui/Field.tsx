"use client";

import { useMemo, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { formatNumber, parseNumericInput } from "@/utils/format";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Field({ label, className = "", ...props }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        className={`min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none ring-0 transition focus:border-emerald-400 ${className}`}
        {...props}
      />
    </label>
  );
}

type NumericFieldProps = {
  label: string;
  value?: number;
  onValueChange: (value: number) => void;
  mode?: "money" | "decimal";
  placeholder?: string;
  disabled?: boolean;
};

export function NumericField({ label, value = 0, onValueChange, mode = "decimal", placeholder, disabled }: NumericFieldProps) {
  const displayValue = useMemo(() => {
    if (!value) return "";
    return mode === "money" ? formatNumber(value, 0) : formatNumber(value, 2);
  }, [mode, value]);

  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        className="min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none ring-0 transition focus:border-emerald-400 disabled:opacity-60"
        disabled={disabled}
        inputMode="decimal"
        pattern="[0-9.,]*"
        placeholder={placeholder}
        type="text"
        value={displayValue}
        onChange={(event) => {
          const nextValue = mode === "money" ? Number(event.target.value.replace(/\D/g, "")) : parseNumericInput(event.target.value);
          onValueChange(Number.isFinite(nextValue) ? nextValue : 0);
        }}
      />
    </label>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function SelectField({ label, className = "", children, ...props }: SelectFieldProps) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <select
        className={`min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none focus:border-emerald-400 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
