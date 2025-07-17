import React, { useEffect, useState } from "react";
import { fetchAllRequirements } from "../../services";

export default function RequirementHistory() {
  const [allReqs, setAllReqs] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const allReqsRes = await fetchAllRequirements();
    setAllReqs(allReqsRes.data);
  };
  return (
    <section>
      <h4 className="text-primary mb-3">📚 Full Requirement History</h4>
      {allReqs.length === 0 ? (
        <p className="text-muted">No requirements in history.</p>
      ) : (
        allReqs.map((req) => (
          <div key={req._id} className="card mb-3 border-secondary shadow-sm">
            <div className="card-body">
              <h6 className="text-secondary">{req.title || "N/A"}</h6>
              <p>{req.description || "N/A"}</p>
              <small>
                <strong>Sales:</strong> {req.createdBy || "N/A"} <br />
                <strong>Lead:</strong> {req.leadAssignedTo || "—"} <br />
                <strong>Recruiters:</strong>{" "}
                {Array.isArray(req.recruiterAssignedTo)
                  ? req.recruiterAssignedTo.join(", ")
                  : req.recruiterAssignedTo || "—"}
              </small>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
