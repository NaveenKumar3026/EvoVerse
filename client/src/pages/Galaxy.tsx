import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";
import CivilizationModal from "../components/CivilizationModal";


function Galaxy() {
  const [civilizations, setCivilizations] =
    useState<any[]>([]);

  const [wars, setWars] =
    useState<any[]>([]);

  const [alliances, setAlliances] =
    useState<any[]>([]);

  const [trades, setTrades] =
    useState<any[]>([]);

    const [selectedCivilization,
  setSelectedCivilization] =
    useState<any>(null);

  const [analytics, setAnalytics] =
    useState<any>(null);

     const getSpeciesIcon =
  (name: string) => {

    if (
      name.includes("Terran")
    ) return "🧬";

    if (
      name.includes("Aurel")
    ) return "👽";

    if (
      name.includes("Synth")
    ) return "🤖";

    return "🌌";
  };

  useEffect(() => {
    const fetchData =
      async () => {
        try {

          const civResponse =
            await api.get(
              "/civilizations"
            );

          const analyticsResponse =
            await api.get(
              "/analytics"
            );

          const warsResponse =
            await api.get(
              "/wars"
            );

          const alliancesResponse =
            await api.get(
              "/alliances"
            );

          const tradesResponse =
            await api.get(
              "/trades"
            );

           

          setCivilizations(
            civResponse.data.civilizations
          );

          setAnalytics(
            analyticsResponse.data.analytics
          );

          setWars(
            warsResponse.data.wars
          );

          setAlliances(
            alliancesResponse.data.alliances
          );

          setTrades(
            tradesResponse.data.trades
          );

        } catch (error) {
          console.error(error);
        }
      };

    fetchData();
  }, []);

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
        Galaxy Map
      </h1>

      {/* Analytics */}

      {analytics && (

        <div
          className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-4
          mb-10
          "
        >

          <div className="bg-slate-900 p-4 rounded-xl">
            <div className="text-2xl">🏆</div>

            <p className="text-gray-400">
              Strongest
            </p>

            <h3
              className="
              font-bold
              text-cyan-400
              "
            >
              {analytics.strongestCivilization}
            </h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl">
            <div className="text-2xl">💰</div>

            <p className="text-gray-400">
              Richest
            </p>

            <h3
              className="
              font-bold
              text-green-400
              "
            >
              {analytics.richestCivilization}
            </h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl">
            <div className="text-2xl">🚀</div>

            <p className="text-gray-400">
              Most Advanced
            </p>

            <h3
              className="
              font-bold
              text-purple-400
              "
            >
              {analytics.mostAdvancedCivilization}
            </h3>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl">
            <div className="text-2xl">👥</div>

            <p className="text-gray-400">
              Largest Population
            </p>

            <h3
              className="
              font-bold
              text-yellow-400
              "
            >
              {analytics.largestPopulation}
            </h3>
          </div>

        </div>

      )}

      {/* Civilizations */}
{/* Galaxy Map */}

<div
  className="
  relative
  h-[900px]
  rounded-xl
  border
  border-cyan-500/20
  bg-slate-950
  overflow-hidden
  mb-12
  "
>

  {/* Stars */}

  {Array.from({ length: 120 }).map(
    (_, i) => (

      <div
        key={i}
        className="
        absolute
        text-white
        opacity-40
        pointer-events-none
        "
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      >
        ✦
      </div>

    )
  )}

  <svg
  className="
  absolute
  inset-0
  w-full
  h-full
  "
>

  <line
    x1="20%"
    y1="20%"
    x2="50%"
    y2="50%"
    stroke="#00ff88"
    strokeWidth="2"
  />

  <line
    x1="50%"
    y1="50%"
    x2="75%"
    y2="20%"
    stroke="#00ff88"
    strokeWidth="2"
  />

  <line
    x1="20%"
    y1="20%"
    x2="75%"
    y2="20%"
    stroke="#ff3333"
    strokeWidth="3"
  />

</svg>

  {/* Civilizations */}

  {civilizations.map(
  (civ, index) => {

    const power =
      civ.species.population +
      (civ.technology?.level || 0) * 100;

    const tier =
      power > 1000
        ? "Galactic Empire"
        : power > 500
        ? "Spacefaring"
        : "Primitive";

    return (

      <div
        key={civ.id}
        onClick={() =>
          setSelectedCivilization(civ)
        }
        className="
        absolute
        text-center
        cursor-pointer
        hover:scale-110
        transition
        "
        style={{
          left: `${15 + index * 25}%`,
          top: `${15 + (index % 2) * 35}%`,
        }}
      >

        <div
          className="
          text-7xl
          drop-shadow-lg
          "
        >
          {
            civ.technology?.level >= 8
              ? "🚀"
              : getSpeciesIcon(
                  civ.species.name
                )
          }
        </div>

        <div
          className="
          text-purple-400
          text-xs
          uppercase
          "
        >
          {tier}
        </div>

        <div
          className="
          mt-2
          text-cyan-400
          font-bold
          text-xl
          "
        >
          {civ.species.name}
        </div>

        <div
          className="
          text-sm
          text-gray-400
          "
        >
          Pop: {civ.species.population}
        </div>

        <div
          className="
          text-yellow-400
          text-sm
          "
        >
          Power: {power}
        </div>

      </div>

    );

  }
)}

</div>

      {/* Wars */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          text-red-400
          mb-6
          "
        >
          Active Wars
        </h2>

        <div
          className="
          grid
          md:grid-cols-2
          gap-4
          "
        >

          {wars.slice(0, 5).map((war) => (

            <div
              key={war.id}
              className="
              bg-slate-900
              p-4
              rounded-xl
              border
              border-red-500/30
              "
            >

              <p className="font-bold">
                Year {war.year}
              </p>

              <p className="text-gray-400">
                Winner:
                {" "}
                {war.winnerCivilizationId}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Alliances */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          text-yellow-400
          mb-6
          "
        >
          Alliances
        </h2>

        <div
          className="
          grid
          md:grid-cols-2
          gap-4
          "
        >

          {alliances.slice(0, 5).map((alliance) => (

            <div
              key={alliance.id}
              className="
              bg-slate-900
              p-4
              rounded-xl
              border
              border-yellow-500/30
              "
            >

              <p className="font-bold">
                Alliance Formed
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* Trades */}

      <div className="mt-12">

        <h2
          className="
          text-3xl
          font-bold
          text-green-400
          mb-6
          "
        >
          Trade Network
        </h2>

        <div
          className="
          grid
          md:grid-cols-2
          gap-4
          "
        >

          {trades.slice(0, 5).map((trade) => (

            <div
              key={trade.id}
              className="
              bg-slate-900
              p-4
              rounded-xl
              border
              border-green-500/30
              "
            >

              <p className="font-bold">
                Trade Route
              </p>

            </div>

          ))}

        </div>

        

      </div>


        {
  selectedCivilization && (

    <CivilizationModal
      civilization={
        selectedCivilization
      }
      onClose={() =>
        setSelectedCivilization(null)
      }
    />

  )
}
    </Layout>
  );
}

export default Galaxy;