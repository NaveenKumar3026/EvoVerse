import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Simulation() {

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [years, setYears] =
    useState(100);

  const [stats, setStats] =
    useState<any>(null);

  const loadStats =
    async () => {

      const worldId =
        localStorage.getItem("worldId");

      if (!worldId) return;

      const response =
        await api.get(
          `/statistics/${worldId}`
        );

      setStats(
        response.data.stats
      );
    };

  useEffect(() => {
    loadStats();
  }, []);

  const runEvolution =
    async (yearsToRun: number) => {

      try {

        setLoading(true);

        const worldId =
          localStorage.getItem("worldId");

        if (!worldId) {
          setMessage(
            "World ID not found"
          );
          return;
        }

        await api.post(
          `/evolution/run/${worldId}`,
          {
            years: yearsToRun,
          }
        );

        setMessage(
          `Evolution advanced by ${yearsToRun} years`
        );

        await loadStats();

      } catch {

        setMessage(
          "Simulation failed"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-cyan-400
        mb-10
        "
      >
        Evolution Command Center
      </h1>

      {/* World Status */}

      {stats && (

        <div
          className="
          bg-slate-900
          rounded-xl
          p-6
          mb-8
          border
          border-cyan-500/20
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-4
            "
          >
            🌍 World Status
          </h2>

          <div
            className="
            grid
            md:grid-cols-3
            gap-4
            "
          >

            <p>
              Current Year:
              {" "}
              <strong>
                {stats.currentYear}
              </strong>
            </p>

            <p>
              Species:
              {" "}
              <strong>
                {stats.speciesCount}
              </strong>
            </p>

            <p>
              Civilizations:
              {" "}
              <strong>
                {stats.civilizationCount}
              </strong>
            </p>

            <p>
              Wars:
              {" "}
              <strong>
                {stats.warCount}
              </strong>
            </p>

            <p>
              Alliances:
              {" "}
              <strong>
                {stats.allianceCount}
              </strong>
            </p>

            <p>
              Trades:
              {" "}
              <strong>
                {stats.tradeCount}
              </strong>
            </p>

          </div>

        </div>

      )}

      {/* Custom Simulation */}

      <div
        className="
        bg-slate-900
        rounded-xl
        p-6
        mb-8
        border
        border-cyan-500/20
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-4
          "
        >
          ⚡ Custom Evolution
        </h2>

        <input
          type="number"
          value={years}
          onChange={(e) =>
            setYears(
              Number(
                e.target.value
              )
            )
          }
          className="
          bg-slate-800
          border
          border-slate-700
          rounded-lg
          px-4
          py-2
          w-full
          mb-4
          "
        />

        <button
          onClick={() =>
            runEvolution(years)
          }
          className="
          bg-cyan-600
          hover:bg-cyan-700
          rounded-xl
          px-6
          py-3
          font-bold
          "
        >
          Run Evolution
        </button>

      </div>

      {/* Quick Buttons */}

      <div
        className="
        grid
        md:grid-cols-4
        gap-4
        "
      >

        <button
          onClick={() =>
            runEvolution(1)
          }
          className="
          bg-cyan-600
          p-4
          rounded-xl
          "
        >
          +1 Year
        </button>

        <button
          onClick={() =>
            runEvolution(10)
          }
          className="
          bg-green-600
          p-4
          rounded-xl
          "
        >
          +10 Years
        </button>

        <button
          onClick={() =>
            runEvolution(100)
          }
          className="
          bg-yellow-600
          p-4
          rounded-xl
          "
        >
          +100 Years
        </button>

        <button
          onClick={() =>
            runEvolution(1000)
          }
          className="
          bg-red-600
          p-4
          rounded-xl
          "
        >
          +1000 Years
        </button>

      </div>

      {/* Loading */}

      {loading && (

        <div
          className="
          mt-8
          text-cyan-400
          text-xl
          "
        >
          Running Simulation...
        </div>

      )}

      {/* Report */}

      {message && (

        <div
          className="
          mt-8
          bg-slate-900
          border
          border-cyan-500/30
          rounded-xl
          p-5
          "
        >

          <h2
            className="
            text-xl
            font-bold
            mb-2
            "
          >
            📜 Evolution Report
          </h2>

          {message}

        </div>

      )}

    </Layout>
  );
}

export default Simulation;