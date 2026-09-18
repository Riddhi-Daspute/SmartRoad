import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./RiskMap.css";

function RiskMap() {
  const roads = [
    {
      name: "College Road",
      lat: 19.9975,
      lng: 73.7898,
      score: 88,
      risk: "Low",
    },
    {
      name: "MG Road",
      lat: 20.0059,
      lng: 73.7797,
      score: 67,
      risk: "Medium",
    },
    {
      name: "Station Road",
      lat: 19.9915,
      lng: 73.7845,
      score: 42,
      risk: "High",
    },
    {
      name: "Main Street",
      lat: 20.0125,
      lng: 73.7932,
      score: 24,
      risk: "Critical",
    },
  ];

  const getRiskColor = (risk) => {
    if (risk === "Low") return "green";
    if (risk === "Medium") return "orange";
    if (risk === "High") return "red";
    return "darkred";
  };

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

          <div className="risk-map-layout">

            {/* Map */}
            <div className="map-card">

              <h2>Risk Distribution</h2>

              <p className="map-description">
                Road locations are displayed according to their calculated
                risk level.
              </p>

              <MapContainer
                center={[20.0000, 73.7870]}
                zoom={13}
                className="road-map"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {roads.map((road, index) => (
                  <CircleMarker
                    key={index}
                    center={[road.lat, road.lng]}
                    radius={10}
                    pathOptions={{
                      color: getRiskColor(road.risk),
                      fillColor: getRiskColor(road.risk),
                      fillOpacity: 0.7,
                    }}
                  >
                    <Popup>
                      <div className="map-popup">
                        <h3>{road.name}</h3>

                        <p>
                          <strong>Health Score:</strong>{" "}
                          {road.score}%
                        </p>

                        <p>
                          <strong>Risk Level:</strong>{" "}
                          {road.risk}
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
                <strong>58</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot orange"></span>
                <span>Medium Risk</span>
                <strong>32</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot red"></span>
                <span>High Risk</span>
                <strong>21</strong>
              </div>

              <div className="risk-item">
                <span className="risk-dot darkred"></span>
                <span>Critical Risk</span>
                <strong>14</strong>
              </div>

              <div className="map-info">
                <strong>Map Information</strong>

                <p>
                  Click on a road marker to view its health score and
                  risk level.
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