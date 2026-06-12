import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard
from "./pages/Dashboard";
import Civilizations from "./pages/Civilizations";
import Wars from "./pages/Wars";
import Alliances from "./pages/Alliances";
import Trades from "./pages/Trades";
import Timeline from "./pages/Timeline";
import Simulation from "./pages/Simulation";
import Analytics from "./pages/Analytics";
import Galaxy from "./pages/Galaxy";
import Story from "./pages/Story";
import Achievements
  from "./pages/Achievements";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
  path="/achievements"
  element={<Achievements />}
/>
        <Route
  path="/story"
  element={<Story />}
/>

        <Route
          path="/"
          element={<Dashboard />}
        />
  <Route
  path="/simulation"
  element={<Simulation />}
/>
<Route
  path="/analytics"
  element={<Analytics />}
/>
<Route
  path="/timeline"
  element={<Timeline />}
/>
<Route
  path="/trades"
  element={<Trades />}
/>
      <Route
  path="/alliances"
  element={<Alliances />}
/>
        <Route
  path="/civilizations"
  element={<Civilizations />}
/>

<Route
  path="/wars"
  element={<Wars />}
/>
<Route
  path="/galaxy"
  element={<Galaxy />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;