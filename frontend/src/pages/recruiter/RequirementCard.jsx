import React from "react";

export default function RequirementCard({
  req,
  onApplyClick,
  expandedReq,
  setExpandedReq,
}) {
  const handleCopyId = () => {
    if (req.requirementId) {
      navigator.clipboard.writeText(req.requirementId);
      alert("📋 Requirement ID copied to clipboard!");
    }
  };

  return (
    <div className="card shadow-sm border-success mb-3">
      <div className="card-body">
        {/* ✅ Requirement ID with copy button */}
        <p className="mb-2" style={{ fontSize: "0.9rem" }}>
          <strong>Requirement ID:</strong>{" "}
          <span className="text-monospace">{req.requirementId || "—"}</span>
          {req.requirementId && (
            <button
              className="btn btn-sm btn-outline-secondary ms-2"
              title="Copy ID"
              onClick={handleCopyId}
            >
              📋
            </button>
          )}
        </p>

        <h5 className="card-title">{req.title}</h5>

        <p>
          <strong>Location:</strong> {req.locations?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Rate:</strong> {req.rate || "N/A"}
        </p>
        <p>
          <strong>Skills:</strong> {req.primarySkills || "N/A"}
        </p>
        <p>
          <strong>Employment:</strong> {req.employmentType || "N/A"}
        </p>
        <p>
          <strong>Setting:</strong> {req.workSetting || "N/A"}
        </p>

        <button
          className="btn btn-sm btn-link p-0 text-primary"
          onClick={() =>
            setExpandedReq(expandedReq === req._id ? null : req._id)
          }
        >
          {expandedReq === req._id ? "Hide Description" : "View Description"}
        </button>

        {expandedReq === req._id && (
          <p className="mt-2">{req.description || "No description provided."}</p>
        )}

        <button
          className="btn btn-outline-primary btn-sm mt-2"
          onClick={() => onApplyClick(req._id, req.title)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
