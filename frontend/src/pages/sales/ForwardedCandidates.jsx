import React, { useEffect, useState } from "react";
import { Table, Collapse, Button } from "react-bootstrap";
import { getForwardedCandidates } from "../../services";

export default function ForwardedCandidates() {
  const [forwardedCandidates, setForwardedCandidates] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await getForwardedCandidates();
      const candidates = Array.isArray(response.candidates)
        ? response.candidates
        : response.candidates || [];
      setForwardedCandidates(candidates);
    } catch (err) {
      console.error("❌ Failed to fetch forwarded candidates", err);
      setForwardedCandidates([]);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const visibleFields = [
    "candidateId", // ✅ added here
    "name",
    "role",
    "email",
    "phone",
    "rate",
    "forwardedBy",
    "addedBy",
  ];

  const hiddenFields = [
    "source",
    "currentLocation",
    "relocation",
    "passportnumber",
    "Last4digitsofSSN",
    "LinkedinUrl",
    "clientdetails",
  ];

  const filteredCandidates = forwardedCandidates.filter((candidate) => {
    const query = searchQuery.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(query) ||
      candidate.role?.toLowerCase().includes(query) ||
      candidate.email?.toLowerCase().includes(query) ||
      candidate.forwardedBy?.toLowerCase().includes(query) ||
      candidate.addedBy?.toLowerCase().includes(query) ||
      candidate.candidateId?.toLowerCase().includes(query)
    );
  });

  return (
    <section className="container mt-4">
      {/* 🔍 Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by name, role, email, candidateId..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            {visibleFields.map((field, i) => (
              <th key={i} className="text-capitalize">{field}</th>
            ))}
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <React.Fragment key={candidate._id}>
                <tr>
                  {visibleFields.map((field, i) => (
                    <td key={i}>{candidate[field] || "N/A"}</td>
                  ))}
                  <td>
                    {Array.isArray(candidate.resumeUrls) &&
                    candidate.resumeUrls.length > 0 ? (
                      candidate.resumeUrls.map((url, idx) => (
                        <div key={idx}>
                          <a
                            href={url}
                            className="btn btn-sm btn-outline-primary mb-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📎 Resume {idx + 1}
                          </a>
                        </div>
                      ))
                    ) : typeof candidate.resumeUrls === "string" ? (
                      <a
                        href={candidate.resumeUrls}
                        className="btn btn-sm btn-outline-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📎 View Resume
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => toggleExpand(candidate._id)}
                    >
                      {expandedRows.includes(candidate._id) ? "Hide" : "View More"}
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td colSpan={visibleFields.length + 2} className="p-0">
                    <Collapse in={expandedRows.includes(candidate._id)}>
                      <div className="p-3 bg-light text-dark">
                        {hiddenFields.map((field) => (
                          <p key={field}>
                            <strong>{field}:</strong> {candidate[field] || "N/A"}
                          </p>
                        ))}
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={visibleFields.length + 2} className="text-center">
                No matching candidates found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </section>
  );
}
