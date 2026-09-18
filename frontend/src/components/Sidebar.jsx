import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>SmartRoad</h2>
        <p>Road Monitoring</p>
      </div>

      <nav className="sidebar-menu">

        <Link to="/dashboard" className="menu-item">
          Dashboard
        </Link>

        <Link to="/inspection" className="menu-item">
          AI Inspection
        </Link>

        <Link to="/road-health" className="menu-item">
          Road Health
        </Link>

        <Link to="/risk-map" className="menu-item">
          Risk Map
        </Link>

        <Link to="/maintenance" className="menu-item">
          Maintenance
        </Link>

        <Link to="/history" className="menu-item">
          Inspection History
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;