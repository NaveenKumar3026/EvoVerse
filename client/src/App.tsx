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

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />
  <Route
  path="/simulation"
  element={<Simulation />}
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

      </Routes>

    </BrowserRouter>
  );
}

export default App;