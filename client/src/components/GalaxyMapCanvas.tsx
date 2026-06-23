import { useCallback, useMemo, useRef, useState } from "react";
import { api } from "../services/api";
import { civColor } from "../utils/gameCalculations";

type StarSystem = {
  id: string;
  name: string;
  x: number;
  y: number;
  planets: {
    id: string;
    name: string;
    type: string;
    ownerId?: string | null;
    owner?: { id: string; species: { name: string } } | null;
    resources?: string;
  }[];
};

type Props = {
  galaxy: StarSystem[];
  civilizations: any[];
  wars: any[];
  trades: any[];
  worldId: string;
  onRefresh: () => void;
};

export default function GalaxyMapCanvas({
  galaxy,
  civilizations,
  wars,
  trades,
  worldId,
  onRefresh,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSystem, setSelectedSystem] = useState<StarSystem | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [colonizing, setColonizing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const worldCivs = useMemo(
    () =>
      civilizations.filter((c) => c.species?.worldId === worldId),
    [civilizations, worldId]
  );

  const civSystemMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const sys of galaxy) {
      for (const planet of sys.planets) {
        if (planet.ownerId) {
          map.set(planet.ownerId, { x: sys.x, y: sys.y });
        }
      }
    }
    return map;
  }, [galaxy]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(0.5, z - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-system]")) return;
    setDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleColonize = async (planetId: string) => {
    if (worldCivs.length === 0) {
      setMessage("No civilization available to colonize.");
      return;
    }
    setColonizing(planetId);
    setMessage("");
    try {
      await api.post(`/stars/colonize/${planetId}`, {
        civilizationId: worldCivs[0].id,
      });
      setMessage("Planet colonized successfully.");
      onRefresh();
    } catch {
      setMessage("Colonization failed.");
    } finally {
      setColonizing(null);
    }
  };

  const warLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const war of wars.slice(0, 20)) {
      const a = civSystemMap.get(war.attackerId);
      const b = civSystemMap.get(war.defenderId);
      if (a && b) lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    return lines;
  }, [wars, civSystemMap]);

  const tradeLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const trade of trades.slice(0, 20)) {
      const a = civSystemMap.get(trade.sellerId);
      const b = civSystemMap.get(trade.buyerId);
      if (a && b) lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    return lines;
  }, [trades, civSystemMap]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div
        ref={containerRef}
        className="relative flex-1 h-[600px] rounded-2xl border border-cyan-500/20 bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
            className="px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded hover:border-cyan-500/40"
          >
            +
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            className="px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded hover:border-cyan-500/40"
          >
            −
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded hover:border-cyan-500/40"
          >
            Reset
          </button>
        </div>

        <div
          className="absolute inset-0 origin-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {tradeLines.map((l, i) => (
              <line
                key={`trade-${i}`}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="#22c55e"
                strokeWidth="0.15"
                strokeOpacity="0.5"
                strokeDasharray="1 0.5"
              />
            ))}
            {warLines.map((l, i) => (
              <line
                key={`war-${i}`}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                stroke="#ef4444"
                strokeWidth="0.2"
                strokeOpacity="0.7"
              />
            ))}

            {galaxy.map((sys) => {
              const owners = sys.planets
                .map((p) => p.ownerId)
                .filter(Boolean) as string[];
              const primaryOwner = owners[0];
              const color = primaryOwner
                ? civColor(primaryOwner)
                : "#06b6d4";
              const isHovered = hovered === sys.id;
              const isSelected = selectedSystem?.id === sys.id;

              return (
                <g
                  key={sys.id}
                  data-system="true"
                  className="cursor-pointer"
                  onClick={() => setSelectedSystem(sys)}
                  onMouseEnter={() => setHovered(sys.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {(isHovered || isSelected) && (
                    <circle
                      cx={sys.x}
                      cy={sys.y}
                      r="4"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.2"
                      opacity="0.5"
                    />
                  )}
                  <circle
                    cx={sys.x}
                    cy={sys.y}
                    r={isSelected ? 2.2 : 1.8}
                    fill={color}
                    style={{
                      filter: `drop-shadow(0 0 4px ${color})`,
                    }}
                  />
                  {sys.planets.map((p, pi) => {
                    const angle = (pi / sys.planets.length) * Math.PI * 2;
                    const px = sys.x + Math.cos(angle) * 2.5;
                    const py = sys.y + Math.sin(angle) * 2.5;
                    return (
                      <circle
                        key={p.id}
                        cx={px}
                        cy={py}
                        r="0.5"
                        fill={p.ownerId ? civColor(p.ownerId) : "#64748b"}
                        opacity={p.ownerId ? 1 : 0.6}
                      />
                    );
                  })}
                  {(isHovered || isSelected) && (
                    <text
                      x={sys.x}
                      y={sys.y - 3.5}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="2"
                      className="pointer-events-none select-none"
                    >
                      {sys.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-500 inline-block" /> War routes
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-green-500 inline-block border-dashed" />{" "}
            Trade routes
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 shrink-0">
        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4 h-full min-h-[300px]">
          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
            System Intel
          </h3>
          {message && (
            <p className="text-xs text-cyan-300 mb-3 p-2 bg-cyan-950/30 rounded">
              {message}
            </p>
          )}
          {!selectedSystem ? (
            <p className="text-slate-500 text-sm">
              Click a star system to view planets and colonization options.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedSystem.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Coordinates: {selectedSystem.x}, {selectedSystem.y}
                </p>
              </div>
              <div className="space-y-2">
                {selectedSystem.planets.map((planet) => (
                  <div
                    key={planet.id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-sm text-white">
                          {planet.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {planet.type}
                        </div>
                      </div>
                      {planet.owner ? (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-bold"
                          style={{
                            color: civColor(planet.owner.id),
                            border: `1px solid ${civColor(planet.owner.id)}`,
                          }}
                        >
                          {planet.owner.species.name}
                        </span>
                      ) : (
                        <button
                          disabled={colonizing === planet.id}
                          onClick={() => handleColonize(planet.id)}
                          className="text-[10px] uppercase px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50"
                        >
                          {colonizing === planet.id
                            ? "..."
                            : "Colonize"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
