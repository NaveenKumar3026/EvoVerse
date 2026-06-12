import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import worldRoutes from "./routes/world.routes";
import speciesRoutes from "./routes/species.routes";
import mutationRoutes
from "./routes/mutation.routes";
import evolutionRoutes
from "./routes/evolution.routes";
import storyRoutes
from "./routes/story.routes";
import civilizationRoutes
from "./routes/civilization.routes";
import warRoutes from "./routes/war.routes";
import allianceRoutes from "./routes/alliance.routes";
import tradeRoutes from "./routes/trade.routes";
import statisticsRoutes
from "./routes/statistics.routes";
import analyticsRoutes
from "./routes/analytics.routes";
import aiRoutes
  from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/api/species",
  speciesRoutes
);
app.use(
  "/api/mutations",
  mutationRoutes
);
app.use(
  "/api/evolution",
  evolutionRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);
app.use(
  "/api/story",
  storyRoutes
);
app.get("/", (req, res) => {
  res.json({
    message: "EvoVerse Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use(
  "/api/civilizations",
  civilizationRoutes
);
app.use(
  "/api/worlds",
  worldRoutes
);
app.use(
  "/api/wars",
  warRoutes
);

app.use(
  "/api/alliances",
  allianceRoutes
);
app.use(
  "/api/analytics",
  analyticsRoutes
);
app.use(
  "/api/trades",
  tradeRoutes
);
app.use(
  "/api/statistics",
  statisticsRoutes
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});