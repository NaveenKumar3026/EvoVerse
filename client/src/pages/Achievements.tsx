import { useEffect, useState } from "react";
import { api } from "../services/api";
import Layout from "../components/Layout";
import HudPanel from "../components/HudPanel";
import LoadingState from "../components/LoadingState";
import { computeAchievements } from "../utils/gameCalculations";

function Achievements() {
  const [achievements, setAchievements] = useState<
    ReturnType<typeof computeAchievements>
  >([]);
  const [loading, setLoading] = useState(true);
  const worldId = localStorage.getItem("worldId");

  useEffect(() => {
    const load = async () => {
      try {
        const [civRes, warsRes, alliancesRes, analyticsRes, commanderRes] =
          await Promise.all([
            api.get("/civilizations"),
            api.get("/wars"),
            api.get("/alliances"),
            api.get("/analytics"),
            api.get("/commander/profile").catch(() => ({ data: {} })),
          ]);

        setAchievements(
          computeAchievements({
            civilizations: civRes.data.civilizations ?? [],
            wars: warsRes.data.wars ?? [],
            alliances: alliancesRes.data.alliances ?? [],
            analytics: analyticsRes.data.analytics,
            commander: commanderRes.data.commander ?? null,
            worldId,
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [worldId]);

  const unlocked = achievements.filter((a) => a.unlocked).length;

  if (loading) {
    return (
      <Layout>
        <LoadingState label="Scanning Achievements..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-500/70 mb-2">
          Commander Honors
        </p>
        <h1 className="text-4xl font-black text-yellow-400">Achievements</h1>
        <p className="text-slate-400 mt-2">
          {unlocked}/{achievements.length} unlocked in this galaxy
        </p>
      </header>

      <div className="mb-6">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-700"
            style={{
              width: `${achievements.length ? (unlocked / achievements.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <HudPanel
            key={achievement.id}
            title={achievement.title}
            accent={achievement.unlocked ? "yellow" : "indigo"}
            className={
              achievement.unlocked
                ? "ring-1 ring-yellow-500/20"
                : "opacity-70"
            }
          >
            <div className="flex gap-4">
              <div
                className={`text-4xl ${achievement.unlocked ? "" : "grayscale opacity-40"}`}
              >
                {achievement.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-400">
                  {achievement.description}
                </p>
                <p
                  className={`text-xs mt-2 font-bold uppercase tracking-wider ${
                    achievement.unlocked
                      ? "text-green-400"
                      : "text-slate-500"
                  }`}
                >
                  {achievement.unlocked ? "✓ Unlocked" : "Locked"} ·{" "}
                  {achievement.progress}
                </p>
              </div>
            </div>
          </HudPanel>
        ))}
      </div>
    </Layout>
  );
}

export default Achievements;
