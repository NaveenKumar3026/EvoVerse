import { useNavigate } from "react-router-dom";

type Props = {
  world: any;
};

export default function WorldCard({ world }: Props) {
  const navigate = useNavigate();

  const handleContinue = () => {
    localStorage.setItem("worldId", String(world.id));
    navigate("/dashboard");
  };

  return (
    <div className="bg-slate-900/70 border border-cyan-500/10 rounded-xl p-4 hover:scale-[1.01] transition-shadow shadow-sm hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-cyan-300 font-bold text-lg">{world.name}</h3>
          <p className="text-xs text-slate-400 mt-1">Year: {world.currentYear ?? world.year ?? "—"}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-300">Civilizations</div>
          <div className="font-bold text-cyan-300">{world.civilizationCount ?? world.civilizations?.length ?? 0}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={handleContinue}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          ▶ Continue
        </button>

        <div className="text-[11px] text-slate-500">Last updated: {world.updatedAt ? new Date(world.updatedAt).toLocaleDateString() : "—"}</div>
      </div>
    </div>
  );
}
