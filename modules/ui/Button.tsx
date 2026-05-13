import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  accent?: string;
};

export function Button({ children, variant = "primary", accent = "#22c55e", className = "", style, ...props }: ButtonProps) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "text-white shadow-glow",
    secondary: "border border-white/10 bg-white/8 text-slate-100 hover:bg-white/12",
    ghost: "text-slate-300 hover:bg-white/10",
    danger: "bg-red-500 text-white hover:bg-red-400"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={variant === "primary" ? { backgroundColor: accent, ...style } : style}
      {...props}
    >
      {children}
    </button>
  );
}
