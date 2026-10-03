import { useEffect, useState } from "react";
import axios from "axios";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./RiskMap.css";

function RiskMap() {
  const [roads, setRoads] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/road-health/")
      .then((response) => {
        setRoads(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load road risk data.");
      });
  }, []);

  const getRiskColor = (risk) => {
    if (risk === "LOW") return "green";
    if (risk === "MODERATE") return "orange";
    if (risk === "HIGH") return "red";
    if (risk === "CRITICAL") return "darkred";

    return "gray";
  };

  const lowRiskCount = roads.filter(
    (road) => road.risk_level === "LOW"
  ).length;

  const moderateRiskCount = roads.filter(
    (road) => road.risk_level === "MODERATE"
  ).length;

  const highRiskCount = roads.filter(
    (road) => road.risk_level === "HIGH"
  ).length;

  const criticalRiskCount = roads.filter(
    (road) => road.risk_level === "CRITICAL"
  ).length;

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main className="risk-map-content">

          <div className="risk-map-heading">
            <h1>Road Risk Map</h1>

            <p>
              View road locations and their current risk levels.
            </p>
          </div>

          {error && <p>{error}</p>}

          <div className="risk-map-layout">

            {/* Map */}

            <div className="map-card">

              <h2>Risk Distribution</h2>

              <p className="map-description">
                Road risk information is loaded from the SmartRoad backend.
              </p>

              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={12}
                className="road-map"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {roads.map((road) => (

                  <CircleMarker
                    key={road.id}
                    center={[18.5204, 73.8567]}
                    radius={10}
                    pathOptions={{
                      color: getRiskColor(road.risk_level),
                      fillColor: getRiskColor(road.risk_level),
                      fillOpacity: 0.7,
                    }}
                  >

                    <Popup>

                      <div className="map-popup">

                        <h3>{road.road_name}</h3>

                        <p>
                          <strong>Location:</strong>{" "}
                          {road.location}
                        </p>

                        <p>
                          <strong>Health Score:</strong>{" "}
                          {road.health_score}%
                        </p>

                        <p>
                          <strong>Risk Level:</strong>{" "}
                          {road.risk_level}
                        </p>

                        <p>
                          <strong>Priority:</strong>{" "}
                          {road.maintenance_priority}
                        </p>

                      </div>

                    </Popup>

                  </CircleMarker>

                ))}

              </MapContainer>

            </div>

            {/* Risk Summary */}

            <div className="risk-summary-card">

              <h2>Risk Levels</h2>

              <p className="map-description">
                Current distribution of road risks.
              </p>

              <div className="risk-item">
                <span className="risk-dot green"></span>
                <span>Low Risk</span>
                <strong>{lowRiskCount}</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot orange"></span>
                <span>Moderate Risk</span>
                <strong>{moderateRiskCount}</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot red"></span>
                <span>High Risk</span>
                <strong>{highRiskCount}</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot darkred"></span>
                <span>Critical Risk</span>
                <strong>{criticalRiskCount}</strong>
              </div>

              <div className="map-info">

                <strong>Map Information</strong>

                <p>
                  Road health and risk information is retrieved from
                  the SmartRoad backend.
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default RiskMap;