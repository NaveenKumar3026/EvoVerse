type Props = {
  rank: string;
  size?: "sm" | "md" | "lg";
};

export default function RankBadge({ rank, size = "md" }: Props) {
  const emoji = (() => {
    switch (rank) {
      case "Bronze": return "🥉";
      case "Silver": return "🥈";
      case "Gold": return "🥇";
      case "Platinum": return "💠";
      case "Diamond": return "💎";
      case "Master": return "👑";
      case "Legend": return "🌟";
      default: return "🎖";
    }
  })();

  const sizes: Record<string, string> = {
    sm: "w-12 h-12 text-2xl",
    md: "w-20 h-20 text-4xl",
    lg: "w-28 h-28 text-6xl",
  };

  return (
    <div className={`flex items-center justify-center bg-gradient-to-tr from-cyan-600/20 to-indigo-600/10 rounded-full border border-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.08)] ${sizes[size]}`}>
      <div className="flex flex-col items-center">
        <div className="text-center" aria-hidden>
          <span className="block drop-shadow-[0_4px_20px_rgba(6,182,212,0.25)]">{emoji}</span>
        </div>
      </div>
    </div>
  );
}
