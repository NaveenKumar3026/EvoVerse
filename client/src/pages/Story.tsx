import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";
import { parseStoryChapters } from "../utils/gameCalculations";

function Story() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [civilizations, setCivilizations] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    const loadContext = async () => {
      if (!worldId) return;
      try {
        const [civRes, histRes] = await Promise.all([
          api.get("/civilizations"),
          api.get(`/evolution/history/${worldId}`),
        ]);
        const civs = (civRes.data.civilizations ?? []).filter(
          (c: any) => c.species?.worldId === worldId
        );
        setCivilizations(civs);
        setTimeline((histRes.data.history ?? []).slice(-8).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    loadContext();
  }, [worldId]);

  const generateStory = async () => {
    if (!worldId) {
      setStory("No active world. Select a world from the main menu.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/ai/story/${worldId}`);
      setStory(response.data.story || "No story returned");
    } catch {
      setStory("Failed to generate story. Ensure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const parsed = story ? parseStoryChapters(story) : null;

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/70 mb-2">
          Galactic Archives · AI Historian 2.0
        </p>
        <h1 className="text-4xl font-black text-cyan-400">
          AI Galactic Historian
        </h1>
        <p className="text-slate-400 mt-2">
          Chronicle your civilization's journey through structured chapters.
        </p>
      </header>

      <button
        onClick={generateStory}
        disabled={loading || !worldId}
        className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 px-8 py-4 rounded-xl font-bold mb-8 transition shadow-lg shadow-cyan-900/20"
      >
        {loading ? "Composing Chronicle..." : "Generate Galactic History"}
      </button>

      {loading && <LoadingState label="AI Historian is writing..." />}

      {!loading && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {parsed ? (
              <>
                <HudPanel title={parsed.title} accent="cyan">
                  <p className="text-sm text-slate-400">
                    {parsed.chapters.length} chapter(s) · AI-generated chronicle
                  </p>
                </HudPanel>

                {parsed.chapters.map((chapter, i) => (
                  <HudPanel
                    key={i}
                    title={`Chapter ${i + 1}: ${chapter.heading}`}
                    accent={i % 2 === 0 ? "indigo" : "purple"}
                  >
                    <div className="prose prose-invert prose-sm max-w-none">
                      {chapter.body.split("\n").map((para, pi) => (
                        <p
                          key={pi}
                          className="text-slate-300 leading-relaxed mb-3 last:mb-0"
                        >
                          {para.replace(/^\*\*|\*\*$/g, "").replace(/\*\*/g, "")}
                        </p>
                      ))}
                    </div>
                  </HudPanel>
                ))}
              </>
            ) : (
              <HudPanel title="Awaiting Chronicle" accent="indigo">
                <p className="text-slate-500 text-sm">
                  Press the button above to generate your galactic history book.
                </p>
              </HudPanel>
            )}
          </div>

          <aside className="space-y-6">
            <HudPanel title="Civilization Highlights" accent="yellow">
              {civilizations.length === 0 ? (
                <p className="text-slate-500 text-sm">No civilizations yet.</p>
              ) : (
                <div className="space-y-3">
                  {civilizations.map((civ) => (
                    <div
                      key={civ.id}
                      className="p-3 rounded-lg bg-slate-950/50 border border-slate-800"
                    >
                      <div className="font-bold text-cyan-300 text-sm">
                        {civ.species.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {civ.stage} · Pop {civ.species.population} · Tech Lv{" "}
                        {civ.technology?.level ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </HudPanel>

            <HudPanel title="Timeline Cards" accent="cyan">
              {timeline.length === 0 ? (
                <p className="text-slate-500 text-sm">No events yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {timeline.map((e, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-slate-950/40 border border-slate-800 text-xs"
                    >
                      <span className="text-cyan-500 font-mono">
                        Y{e.year}
                      </span>
                      <span className="text-slate-500 ml-2 uppercase">
                        {e.eventType?.replace(/_/g, " ")}
                      </span>
                      <p className="text-slate-300 mt-1">{e.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </HudPanel>

            {parsed && parsed.highlights.length > 0 && (
              <HudPanel title="Key Highlights" accent="green">
                <ul className="space-y-2 text-sm text-slate-300">
                  {parsed.highlights.slice(0, 6).map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-green-400">▸</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </HudPanel>
            )}
          </aside>
        </div>
      )}
    </Layout>
  );
}

export default Story;
