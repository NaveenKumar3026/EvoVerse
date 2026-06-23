import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
  icon?: string;
  accent?: "cyan" | "yellow" | "green" | "red" | "purple";
  hint?: string;
};

const accents = {
  cyan: "text-cyan-300 border-cyan-500/25 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
  yellow: "text-yellow-300 border-yellow-500/25 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]",
  green: "text-green-300 border-green-500/25 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]",
  red: "text-red-300 border-red-500/25 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  purple: "text-purple-300 border-purple-500/25 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
};

export default function CommandStatCard({
  label,
  value,
  icon,
  accent = "cyan",
  hint,
}: Props) {
  return (
    <div
      className={`
        group relative rounded-xl border bg-slate-950/60 p-4
        transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5
        ${accents[accent]}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[10px] uppercase tracking-widest text-slate-500">
          {label}
        </div>
        {icon && <span className="text-lg opacity-80">{icon}</span>}
      </div>
      <div className={`text-2xl font-black mt-2 ${accents[accent].split(" ")[0]}`}>
        {value}
      </div>
      {hint && (
        <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">
          {hint}
        </div>
      )}
    </div>
  );
}
