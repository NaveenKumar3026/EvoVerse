import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Leaderboards() {

  const [civilizations, setCivilizations] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const response =
          await api.get("/civilizations");

        setCivilizations(
          response.data.civilizations
        );

      } catch (error) {

        console.error(error);

      }

    };

    fetchData();

  }, []);

  const strongest =
    [...civilizations]
      .sort((a, b) => {

        const powerA =
          a.species.population *
          (a.technology?.level || 1);

        const powerB =
          b.species.population *
          (b.technology?.level || 1);

        return powerB - powerA;

      })
      .slice(0, 10);

  return (

    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-yellow-400
        mb-10
        "
      >
        🏅 Galactic Leaderboards
      </h1>

      <div
        className="
        bg-slate-900
        rounded-xl
        p-6
        border
        border-yellow-500/20
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-6
          "
        >
          Strongest Civilizations
        </h2>

        {strongest.map(
          (civ, index) => {

            const power =
              civ.species.population *
              (civ.technology?.level || 1);

            return (

              <div
                key={civ.id}
                className="
                flex
                justify-between
                items-center
                border-b
                border-slate-700
                py-3
                "
              >

                <span>
                  #{index + 1}
                  {" "}
                  {civ.species.name}
                </span>

                <span
                  className="
                  text-cyan-400
                  font-bold
                  "
                >
                  {power}
                </span>

              </div>

            );

          }
        )}

      </div>

    </Layout>

  );
}

export default Leaderboards;