import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Civilizations() {

  const [civilizations, setCivilizations] =
    useState<any[]>([]);

  useEffect(() => {

    const fetchCivilizations =
      async () => {

        try {

          const response =
            await api.get(
              "/civilizations"
            );

          setCivilizations(
            response.data.civilizations
          );

        } catch (error) {

          console.error(
            "Failed to load civilizations",
            error
          );

        }
      };

    fetchCivilizations();

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
        Civilizations
      </h1>

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        "
      >

        {civilizations.map((civ) => (

          <div
            key={civ.id}
            className="
            bg-slate-900
            border
            border-cyan-500/20
            rounded-xl
            p-6
            shadow-lg
            "
          >

            <h2
              className="
              text-2xl
              font-bold
              text-cyan-400
              mb-4
              "
            >
              {civ.species.name}
            </h2>

            <div className="space-y-2">

              <p>
                <strong>
                  Stage:
                </strong>{" "}
                {civ.stage}
              </p>

              <p>
                <strong>
                  Population:
                </strong>{" "}
                {civ.species.population}
              </p>

              <p>
                <strong>
                  Technology Era:
                </strong>{" "}
                {civ.technology?.era}
              </p>

              <p>
                <strong>
                  Technology Level:
                </strong>{" "}
                {civ.technology?.level}
              </p>

              <p>
                <strong>
                  Food:
                </strong>{" "}
                {civ.resource?.food}
              </p>

              <p>
                <strong>
                  Wood:
                </strong>{" "}
                {civ.resource?.wood}
              </p>

              <p>
                <strong>
                  Stone:
                </strong>{" "}
                {civ.resource?.stone}
              </p>

              <p>
                <strong>
                  Metal:
                </strong>{" "}
                {civ.resource?.metal}
              </p>

              <p>
                <strong>
                  Energy:
                </strong>{" "}
                {civ.resource?.energy}
              </p>

            </div>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Civilizations;