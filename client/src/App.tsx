import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainMenu from "./pages/MainMenu";
import GameLobby from "./pages/GameLobby";
import CommanderProfile from "./pages/CommanderProfile";
import EmpireProfile from "./pages/EmpireProfile";
import TechTree from "./pages/TechTree";
import Dashboard from "./pages/Dashboard";
import Civilizations from "./pages/Civilizations";
import Wars from "./pages/Wars";
import Alliances from "./pages/Alliances";
import Trades from "./pages/Trades";
import Timeline from "./pages/Timeline";
import Simulation from "./pages/Simulation";
import Analytics from "./pages/Analytics";
import Galaxy from "./pages/Galaxy";
import Story from "./pages/Story";
import Achievements from "./pages/Achievements";
import Victory from "./pages/Victory";
import Leaderboards from "./pages/Leaderboards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/menu" element={<Navigate to="/" replace />} />
        <Route path="/create-world" element={<GameLobby />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<CommanderProfile />} />
        <Route path="/empire/:civilizationId" element={<EmpireProfile />} />
        <Route path="/tech-tree" element={<TechTree />} />
        <Route path="/ai-historian" element={<Navigate to="/story" replace />} />

        <Route path="/simulation" element={<Simulation />} />
        <Route path="/civilizations" element={<Civilizations />} />
        <Route path="/wars" element={<Wars />} />
        <Route path="/alliances" element={<Alliances />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/galaxy" element={<Galaxy />} />
        <Route path="/story" element={<Story />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/victory" element={<Victory />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
