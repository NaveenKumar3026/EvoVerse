import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  accent?: "cyan" | "yellow" | "green" | "red" | "purple" | "indigo";
  children: ReactNode;
  className?: string;
};

const accentMap = {
  cyan: "border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.08)]",
  yellow: "border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.08)]",
  green: "border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.08)]",
  red: "border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.08)]",
  purple: "border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.08)]",
  indigo: "border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.08)]",
};

export default function HudPanel({
  title,
  subtitle,
  accent = "cyan",
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border bg-slate-900/70
        backdrop-blur-md transition-all duration-300 hover:border-opacity-60
        ${accentMap[accent]} ${className}
      `}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="p-5">
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Command Interface
          </div>
          <h3 className="text-lg font-bold text-white mt-1">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
