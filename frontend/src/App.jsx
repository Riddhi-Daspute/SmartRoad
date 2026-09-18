import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIInspection from "./pages/AIInspection";
import RoadHealth from "./pages/RoadHealth";
import RiskMap from "./pages/RiskMap";
import Maintenance from "./pages/Maintenance";
import InspectionHistory from "./pages/InspectionHistory";

function App() {
    return (
      <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/inspection" element={<AIInspection />} />

        <Route path="/road-health" element={<RoadHealth />} />

        <Route path="/risk-map" element={<RiskMap />} />

        <Route path="/maintenance" element={<Maintenance />} />

        <Route path="/history" element={<InspectionHistory />} />

      </Routes>

    </BrowserRouter>
    );
}

export default App;