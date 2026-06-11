import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Timeline() {

  const [events, setEvents] =
    useState<any[]>([]);

  useEffect(() => {

    const worldId =
      localStorage.getItem("worldId");

      console.log("Timeline World ID:", worldId);
    if (!worldId) return;
const fetchTimeline =
  async () => {

    try {

      const response =
        await api.get(
          `/evolution/history/${worldId}`
        );

      console.log(
        "Timeline Response:",
        response.data
      );

      console.log(
        "History Count:",
        response.data.history?.length
      );

      setEvents(
        response.data.history || []
      );

    } catch (error) {

      console.error(
        "Timeline Error:",
        error
      );

    }
  };;

    fetchTimeline();

  }, []);

  const getColor =
    (eventType: string) => {

      switch (eventType) {

        case "WAR":
          return "border-red-500";

        case "ALLIANCE":
          return "border-yellow-500";

        case "TRADE":
          return "border-green-500";

        case "MUTATION":
          return "border-purple-500";

        case "DISASTER":
          return "border-orange-500";

        case "TECHNOLOGY_ADVANCED":
          return "border-cyan-500";

        default:
          return "border-slate-500";
      }
    };

    console.log(
  "Events State:",
  events
);

  return (
    <Layout>

      <h1
        className="
        text-5xl
        font-bold
        text-amber-400
        mb-10
        "
      >
        Evolution Timeline
      </h1>

      <p className="text-white mb-4">
  Total Events: {events.length}
</p>

      <div className="space-y-4">

        {events.map((event) => (

          <div
            key={event.id}
            className={`
              bg-slate-900
              border-l-4
              ${getColor(event.eventType)}
              rounded-xl
              p-5
            `}
          >

            <div className="flex justify-between">

              <h3
                className="
                font-bold
                text-lg
                "
              >
                {event.eventType}
              </h3>

              <span
                className="
                text-cyan-400
                font-bold
                "
              >
                Year {event.year}
              </span>

            </div>

            <p className="mt-3 text-gray-300">
              {event.description}
            </p>

          </div>

        ))}

      </div>

    </Layout>
  );
}

export default Timeline;