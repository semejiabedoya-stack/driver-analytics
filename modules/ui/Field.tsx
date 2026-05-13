import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

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
