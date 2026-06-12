import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="
      w-64
      h-screen
      overflow-y-auto
      bg-slate-900
      border-r
      border-slate-800
      p-6
      "
    >
      <h1
        className="
        text-2xl
        font-bold
        text-cyan-400
        mb-8
        "
      >
        EvoVerse
      </h1>

      <nav className="flex flex-col gap-4">

        <Link
          to="/"
          className="hover:text-cyan-400"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/civilizations"
          className="hover:text-cyan-400"
        >
          🌍 Civilizations
        </Link>

        <Link
          to="/wars"
          className="hover:text-cyan-400"
        >
          ⚔ Wars
        </Link>

        <Link
          to="/alliances"
          className="hover:text-cyan-400"
        >
          🤝 Alliances
        </Link>

        <Link
          to="/trades"
          className="hover:text-cyan-400"
        >
          💱 Trades
        </Link>

        <Link
          to="/timeline"
          className="hover:text-cyan-400"
        >
          📜 Timeline
        </Link>

        <Link
          to="/simulation"
          className="hover:text-cyan-400"
        >
          ⚡ Simulation
        </Link>

        <Link
          to="/analytics"
          className="hover:text-cyan-400"
        >
          📈 Analytics
        </Link>

        <Link
          to="/galaxy"
          className="hover:text-cyan-400"
        >
          🌌 Galaxy
        </Link>

        <Link
          to="/story"
          className="hover:text-cyan-400"
        >
          🤖 AI Historian
        </Link>

        <Link
          to="/achievements"
          className="hover:text-cyan-400"
        >
          🏆 Achievements
        </Link>

        <Link
          to="/victory"
          className="hover:text-cyan-400"
        >
          👑 Victory
        </Link>

        <Link
          to="/leaderboards"
          className="hover:text-cyan-400"
        >
          🏅 Leaderboards
        </Link>

      </nav>
    </div>
  );
}

export default Sidebar;