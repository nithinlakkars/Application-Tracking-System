import React, { useEffect, useState } from "react";
import { Table, Button, Form, Collapse } from "react-bootstrap";
import {
  fetchUnassignedRequirements,
  fetchRecruiters,
  bulkAssignRequirements,
} from "../../services";

export default function NewRequirementsSection({ setMessage }) {
  const [requirements, setRequirements] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [selectedReqs, setSelectedReqs] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

  const user = sessionStorage.getItem("user");

  // Shown by default
  const mainFields = ["requirementId", "title", "locations", "employmentType", "rate"];

  // Hidden inside "View More"
  const extraFields = [
    "description",
    "primarySkills",
    // "leadEmails",
    // "recruiterEmails",
    "workSetting",
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const reqRes = await fetchUnassignedRequirements();
        const recRes = await fetchRecruiters();
        setRequirements(reqRes?.data || reqRes);
        setRecruiters(recRes?.data || recRes);
      } catch (error) {
        console.error("❌ Fetch error", error);
        setMessage("❌ Failed to load data.");
      }
    };
    loadData();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleCheckboxChange = (id) => {
    setSelectedReqs((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedReqs.length === 0 || selectedRecruiters.length === 0) {
      alert("❌ Select at least one requirement and one recruiter.");
      return;
    }

    try {
      const res = await bulkAssignRequirements({
        requirementIds: selectedReqs,
        recruiterEmails: selectedRecruiters,
        leadEmail: user,
      });

      setMessage(res.message || "✅ Requirements assigned successfully.");
      setSelectedReqs([]);
      setSelectedRecruiters([]);

      const updated = await fetchUnassignedRequirements();
      setRequirements(updated?.data || updated);
    } catch (error) {
      console.error("❌ Assignment error", error);
      setMessage("❌ Assignment failed.");
    }
  };

  return (
    <section className="container mt-4">
      <h4 className="text-primary mb-4">📋 Job Requirements</h4>

      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Select</th>
            {mainFields.map((field, index) => (
              <th key={index} className="text-capitalize">
                {field}
              </th>
            ))}
            <th>More</th>
          </tr>
        </thead>
        <tbody>
          {requirements.length > 0 ? (
            requirements.map((req, idx) => (
              <React.Fragment key={req._id}>
                <tr>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedReqs.includes(req._id)}
                      onChange={() => handleCheckboxChange(req._id)}
                    />
                  </td>
                  {mainFields.map((field, i) => (
                    <td key={i}>
                      {Array.isArray(req[field])
                        ? req[field].join(", ")
                        : req[field] || "N/A"}
                    </td>
                  ))}
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => toggleExpand(req._id)}
                    >
                      {expanded.includes(req._id)
                        ? "🔽 View Less"
                        : "🔼 View More"}
                    </Button>
                  </td>
                </tr>

                <tr>
                  <td colSpan={mainFields.length + 2} className="p-0">
                    <Collapse in={expanded.includes(req._id)}>
                      <div className="p-3 bg-light">
                        {extraFields.map((field, i) => (
                          <p key={i} className="mb-1">
                            <strong className="text-capitalize">
                              {field}:
                            </strong>{" "}
                            {Array.isArray(req[field])
                              ? req[field].join(", ")
                              : req[field] || "N/A"}
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
              <td colSpan={mainFields.length + 2} className="text-center">
                No requirements available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Recruiter Selection */}
      <div className="mb-3">
        <h5>Select Recruiters:</h5>
        {recruiters.map((r) => (
          <Form.Check
            inline
            key={r.email}
            label={r.name || r.email}
            type="checkbox"
            checked={selectedRecruiters.includes(r.email)}
            onChange={() =>
              setSelectedRecruiters((prev) =>
                prev.includes(r.email)
                  ? prev.filter((e) => e !== r.email)
                  : [...prev, r.email]
              )
            }
          />
        ))}
      </div>

      {/* ✅ Assign Button */}
      <Button
        variant="success"
        disabled={selectedReqs.length === 0 || selectedRecruiters.length === 0}
        onClick={handleAssign}
      >
        🎯 Assign Selected Requirements
      </Button>
    </section>
  );
}
