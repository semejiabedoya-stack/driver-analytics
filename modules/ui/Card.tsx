import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[.06] p-4 shadow-glow backdrop-blur ${className}`} {...props}>
      {children}
    </section>
  );
}
