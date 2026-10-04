import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ContractorAccountability() {
  const [contractors, setContractors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/contractors/")
      .then((response) => {
        setContractors(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load contractor data.");
      });
  }, []);

  return (
    <div className="dashboard">

      <Sidebar />

      <div className="dashboard-main">

        <Navbar />

        <main style={{ padding: "30px" }}>

          <div>
            <h1>Contractor Accountability</h1>

            <p>
              Monitor contractor performance, repair completion and
              accountability.
            </p>
          </div>

          {error && <p>{error}</p>}

          <div style={{ marginTop: "30px", overflowX: "auto" }}>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>
                <tr>
                  <th>Contractor ID</th>
                  <th>Contractor</th>
                  <th>Total Projects</th>
                  <th>Completed</th>
                  <th>Delayed</th>
                  <th>Repeat Defects</th>
                  <th>Average Repair Time</th>
                  <th>Performance Score</th>
                </tr>
              </thead>

              <tbody>

                {contractors.map((contractor) => (

                  <tr key={contractor.id}>

                    <td>{contractor.contractor_id}</td>

                    <td>
                      {contractor.company_name ||
                        contractor.name}
                    </td>

                    <td>
                      {contractor.total_projects}
                    </td>

                    <td>
                      {contractor.completed_projects}
                    </td>

                    <td>
                      {contractor.delayed_projects}
                    </td>

                    <td>
                      {contractor.repeat_defects}
                    </td>

                    <td>
                      {contractor.average_repair_time}
                    </td>

                    <td>
                      {contractor.performance_score}
                    </td>

                  </tr>

                ))}

                {contractors.length === 0 && (

                  <tr>
                    <td colSpan="8">
                      No contractor records found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}

export default ContractorAccountability;