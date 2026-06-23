import React from "react";

type Props = {
  label?: string;
  title?: string;
  value: React.ReactNode;
  hint?: string;
};

export default function StatCard({ label, title, value, hint }: Props) {
  const displayLabel = label ?? title ?? "";

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between h-full shadow-lg">
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">
          {displayLabel}
        </div>
        <div className="text-2xl font-bold text-cyan-300 mt-2">{value}</div>
      </div>
      {hint && (
        <div className="text-[11px] text-slate-500 mt-3">{hint}</div>
      )}
    </div>
  );
}
