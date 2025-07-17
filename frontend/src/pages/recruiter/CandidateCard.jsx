// components/CandidateCard.jsx
import React from "react";

export default function CandidateCard({ candidate }) {
  const {
    candidateId, // ✅ Add this
    name,
    role,
    email,
    phone,
    rate,
    currentLocation,
    relocation,
    passportnumber,
    Last4digitsofSSN,
    VisaStatus,
    LinkedinUrl,
    clientdetails,
    addedBy,
    resumeUrls = [],
    requirementId, // ✅ Already added
  } = candidate;

  console.log(candidate, " candidate data");

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{name}</h5>

        {/* ✅ New: Candidate ID */}
        <p>
          <strong>Candidate ID:</strong> {candidateId || "N/A"}
        </p>

        <p>
          <strong>Role:</strong> {role || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
        <p>
          <strong>Rate:</strong> {rate || "N/A"}
        </p>
        <p>
          <strong>Current Location:</strong> {currentLocation || "N/A"}
        </p>
        <p>
          <strong>Relocation:</strong> {relocation || "N/A"}
        </p>
        <p>
          <strong>Passport Number:</strong> {passportnumber || "N/A"}
        </p>
        <p>
          <strong>Last 4 SSN:</strong> {Last4digitsofSSN || "N/A"}
        </p>
        <p>
          <strong>Visa Status:</strong> {VisaStatus || "N/A"}
        </p>
        <p>
          <strong>LinkedIn:</strong>{" "}
          {LinkedinUrl ? (
            <a href={LinkedinUrl} target="_blank" rel="noopener noreferrer">
              {LinkedinUrl}
            </a>
          ) : (
            "N/A"
          )}
        </p>
        <p>
          <strong>Client Details:</strong> {clientdetails || "N/A"}
        </p>
        
        <p>
          <strong>Requirement ID:</strong>{" "}
          {requirementId?.jobTitle || requirementId || "N/A"}
        </p>

        {resumeUrls.length > 0 ? (
          resumeUrls.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary me-2 mb-2"
            >
              📎 View Resume {idx + 1}
            </a>
          ))
        ) : (
          <p className="text-muted">No resumes attached</p>
        )}
      </div>
    </div>
  );
}
