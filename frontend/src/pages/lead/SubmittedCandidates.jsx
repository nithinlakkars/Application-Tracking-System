import React, { useEffect, useState } from "react";
import { Table, Button, Collapse } from "react-bootstrap";

export default function SubmittedCandidates({
  candidates = [],
  forwardCandidateToSales,
  setCandidates,
  leadEmail,
  setMessage,
  loadCandidates,
}) {
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleForward = async (id) => {
    try {
      const res = await forwardCandidateToSales(id, { forwardedBy: leadEmail });
      setMessage(res.data.message);
      await loadCandidates();
    } catch {
      setMessage("❌ Forwarding failed");
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // ✅ Added candidateId to visibleFields
  const visibleFields = [
    "candidateId", // <-- New field
    "name",
    "role",
    "email",
    "phone",
    "rate",
    "addedBy",
    "VisaStatus",
  ];

  const hiddenFields = [
    "source",
    "currentLocation",
    "relocation",
    "passportnumber",
    "Last4digitsofSSN",
    "LinkedinUrl",
    "clientdetails",
    "forwardedBy",
  ];

  return (
    <section className="container mt-4">
      <h4 className="text-primary mb-4">📦 Candidates Submitted by Recruiters</h4>
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
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <React.Fragment key={candidate._id}>
                <tr>
                  {visibleFields.map((field, i) => (
                    <td key={i}>{candidate[field] || "N/A"}</td>
                  ))}
                  <td>
                    {Array.isArray(candidate.resumeUrls) && candidate.resumeUrls.length > 0 ? (
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
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleForward(candidate._id)}
                        >
                          🚀 Forward to Sales
                        </Button>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={visibleFields.length + 2} className="text-center">
                No candidates submitted yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </section>
  );
}
