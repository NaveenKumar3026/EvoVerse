import { useMemo } from "react";

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 200 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: (i % 5) + 2,
        delay: `${(i % 20) * 0.15}s`,
        duration: `${2 + (i % 4)}s`,
        opacity: 0.15 + (i % 5) * 0.08,
      })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950/30" />

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.3)`,
          }}
        />
      ))}

      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl" />
    </div>
  );
}

export default Starfield;
