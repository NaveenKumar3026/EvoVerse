import { useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";

function Story() {

  const [story, setStory] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const generateStory =
    async () => {

      try {

        setLoading(true);

        const worldId =
          localStorage.getItem(
            "worldId"
          );

        console.log(
          "World ID:",
          worldId
        );

        if (!worldId) {

          setStory(
            "World ID not found"
          );

          return;
        }

        const response =
          await api.get(
            `/ai/story/${worldId}`
          );

        console.log(
          "Story Response:",
          response.data
        );

        setStory(
          response.data.story || "No story returned"
        );

      } catch (error) {

        console.error(
          "Story Error:",
          error
        );

        setStory(
          "Failed to generate story"
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
        AI Galactic Historian
      </h1>

      <button
        onClick={generateStory}
        className="
        bg-cyan-600
        hover:bg-cyan-700
        px-8
        py-4
        rounded-xl
        font-bold
        mb-8
        "
      >
        Generate Galactic History
      </button>

      {loading && (

        <div
          className="
          text-cyan-400
          text-xl
          mb-6
          "
        >
          Generating Story...
        </div>

      )}

      {story && (

        <div
          className="
          bg-slate-900
          border
          border-cyan-500/20
          rounded-xl
          p-6
          whitespace-pre-wrap
          leading-8
          text-lg
          max-h-[700px]
          overflow-y-auto
          "
        >
          {story}
        </div>

      )}

    </Layout>
  );
}

export default Story;