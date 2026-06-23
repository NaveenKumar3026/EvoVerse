import React, { useState } from "react";
import { api } from "../services/api";

type Decision = {
  id: string;
  worldId: string;
  year: number;
  title: string;
  description: string;
  optionsJson: string;
};

type Props = {
  decision: Decision;
  onResolved: () => void;
  onClose?: () => void;
};

export default function DecisionModal({ decision, onResolved, onClose }: Props) {
  const [resolving, setResolving] = useState(false);
  const options = React.useMemo(() => {
    try {
      return JSON.parse(decision.optionsJson || "[]");
    } catch {
      return [];
    }
  }, [decision.optionsJson]);

  const handleChoose = async (index: number) => {
    try {
      setResolving(true);
      await api.post(`/decisions/resolve/${decision.id}`, { choiceIndex: index });
      onResolved();
    } catch (err) {
      console.error("Failed to resolve decision", err);
      alert("Failed to resolve decision");
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-cyan-400">{decision.title}</h3>
            <p className="text-sm text-slate-400 mt-2">Year: {decision.year}</p>
          </div>
          <button
            className="text-slate-400 hover:text-white"
            onClick={onClose}
            aria-label="Close decision"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-slate-300">{decision.description}</p>

        <div className="mt-6 grid gap-3">
          {options.map((opt: any, idx: number) => (
            <button
              key={idx}
              className="text-left bg-slate-800 hover:bg-slate-700 p-4 rounded-lg border border-slate-700"
              onClick={() => handleChoose(idx)}
              disabled={resolving}
            >
              <div className="flex items-start gap-3">
                <div className="text-cyan-400 font-bold">Option {idx + 1}</div>
                <div className="text-sm text-slate-300">{opt.text}</div>
              </div>
            </button>
          ))}
        </div>

        {resolving && <p className="mt-4 text-slate-400">Applying decision...</p>}
      </div>
    </div>
  );
}
