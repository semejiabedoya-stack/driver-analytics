import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: string;
};

export function StatCard({ label, value, detail, accent = "#22c55e" }: StatCardProps) {
  return (
    <Card className="min-h-28">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
          <strong className="mt-2 block text-2xl font-black text-white">{value}</strong>
          {detail ? <span className="mt-1 block text-xs text-slate-400">{detail}</span> : null}
        </div>
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </Card>
  );
}
