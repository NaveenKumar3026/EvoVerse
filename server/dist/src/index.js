"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const world_routes_1 = __importDefault(require("./routes/world.routes"));
const species_routes_1 = __importDefault(require("./routes/species.routes"));
const mutation_routes_1 = __importDefault(require("./routes/mutation.routes"));
const evolution_routes_1 = __importDefault(require("./routes/evolution.routes"));
const story_routes_1 = __importDefault(require("./routes/story.routes"));
const civilization_routes_1 = __importDefault(require("./routes/civilization.routes"));
const war_routes_1 = __importDefault(require("./routes/war.routes"));
const alliance_routes_1 = __importDefault(require("./routes/alliance.routes"));
const trade_routes_1 = __importDefault(require("./routes/trade.routes"));
const statistics_routes_1 = __importDefault(require("./routes/statistics.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const decision_routes_1 = __importDefault(require("./routes/decision.routes"));
const star_routes_1 = __importDefault(require("./routes/star.routes"));
const commander_routes_1 = __importDefault(require("./routes/commander.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/species", species_routes_1.default);
app.use("/api/mutations", mutation_routes_1.default);
app.use("/api/evolution", evolution_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/story", story_routes_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "EvoVerse Backend Running",
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/civilizations", civilization_routes_1.default);
app.use("/api/worlds", world_routes_1.default);
app.use("/api/wars", war_routes_1.default);
app.use("/api/alliances", alliance_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/trades", trade_routes_1.default);
app.use("/api/statistics", statistics_routes_1.default);
app.use("/api/decisions", decision_routes_1.default);
app.use("/api/stars", star_routes_1.default);
app.use("/api/commander", commander_routes_1.default);
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
