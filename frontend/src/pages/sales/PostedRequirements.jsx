import React, { useEffect, useState } from "react";
import { fetchSalesRequirements } from "../../services";

export default function PostedRequirements() {
  const [submittedReqs, setSubmittedReqs] = useState([]);
  const [expandedReq, setExpandedReq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRequirements = async () => {
      try {
        const res = await fetchSalesRequirements();
        console.log("✅ fetched requirements:", res);

        // Safely extract array
        const dataArray = res?.data || (Array.isArray(res) ? res : []);
        setSubmittedReqs(dataArray);
      } catch (err) {
        console.error("Failed to fetch posted requirements", err);
      }
    };
    loadRequirements();
  }, []);

  // Safe includes helper
  const safeLowerIncludes = (value, query) => {
    if (Array.isArray(value)) {
      return value.join(", ").toLowerCase().includes(query);
    }
    return (value || "").toLowerCase().includes(query);
  };

  const filteredReqs = submittedReqs.filter((req) => {
    const query = searchQuery.toLowerCase();
    return (
      safeLowerIncludes(req.requirementId, query) ||
      safeLowerIncludes(req.title, query) ||
      safeLowerIncludes(req.leadAssignedTo, query) ||
      safeLowerIncludes(req.recruiterEmails, query) ||
      safeLowerIncludes(req.locations, query) ||
      safeLowerIncludes(req.primarySkills, query) ||
      safeLowerIncludes(req.rate, query)
    );
  });

  return (
    <section className="mt-4">
      <h4 className="text-success mb-3">📄 Posted Requirements</h4>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Req ID, title, lead, recruiters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredReqs.length === 0 ? (
        <p className="text-muted">No matching requirements found.</p>
      ) : (
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Req ID</th>
              <th>Title</th>
              <th>Lead</th>
              <th>Recruiters</th>
              <th>Location(s)</th>
              <th>Rate</th>
              <th>Skills</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredReqs.map((req) => (
              <React.Fragment key={req._id}>
                <tr>
                  <td>{req.requirementId || "—"}</td>
                  <td>{req.title || "Untitled"}</td>
                  <td>{req.leadAssignedTo || "N/A"}</td>
                  <td>
                    {Array.isArray(req.recruiterEmails)
                      ? req.recruiterEmails.join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {Array.isArray(req.locations)
                      ? req.locations.join(", ")
                      : "N/A"}
                  </td>
                  <td>{req.rate || "N/A"}</td>
                  <td>{req.primarySkills || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-link text-primary"
                      onClick={() =>
                        setExpandedReq(expandedReq === req._id ? null : req._id)
                      }
                    >
                      {expandedReq === req._id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expandedReq === req._id && (
                  <tr>
                    <td colSpan="8">
                      <div className="p-3 bg-light border rounded">
                        <p>
                          <strong>Description:</strong>{" "}
                          {req.description || "No description provided."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
