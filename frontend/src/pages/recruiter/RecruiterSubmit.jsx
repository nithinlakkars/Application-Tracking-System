import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  submitCandidate,
  getAssignedRequirements,
  getRecruiterCandidates,
  fetchSalesLeads,
} from "../../services";
import SubmitCandidateModal from "./SubmitCandidateForm";
import Navbar from "../../componenets/Navbar";

export default function RecruiterSubmit() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    source: "",
    currentLocation: "",
    rate: "",
    relocation: "",
    passportNumber: "",
    last4SSN: "",
    visaStatus: "",
    linkedinUrl: "",
    clientDetails: "",
    forwardToLeads: [],
    addedBy: "",
  });
  const [resume, setResume] = useState([]);
  const [message, setMessage] = useState("");
  const [submittedCandidates, setSubmittedCandidates] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormId, setShowFormId] = useState(null);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [expandedReq, setExpandedReq] = useState(null);
  const [activeSection, setActiveSection] = useState("assignedRequirements");

  const userEmail = sessionStorage.getItem("user");

  useEffect(() => {
    if (!userEmail) return;

    setFormData((prev) => ({ ...prev, addedBy: userEmail }));

    const fetchData = async () => {
      try {
        const reqRes = await getAssignedRequirements(userEmail);
        setRequirements(Array.isArray(reqRes.data) ? reqRes.data : []);

        const candidatesRes = await getRecruiterCandidates(userEmail);
        const myCandidates = Array.isArray(candidatesRes)
          ? candidatesRes.filter((c) => c.addedBy === userEmail)
          : [];
        setSubmittedCandidates(myCandidates);


        const leadsData = await fetchSalesLeads();
        setLeads(leadsData || []);
      } catch (err) {
        console.error("❌ Failed to fetch data", err);
      }
    };

    fetchData();
  }, [userEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(Array.from(e.target.files));
  };

  const handleLeadSelect = (leadEmail) => {
    setFormData((prev) => ({
      ...prev,
      forwardToLeads: prev.forwardToLeads.includes(leadEmail)
        ? prev.forwardToLeads.filter((email) => email !== leadEmail)
        : [...(prev.forwardToLeads || []), leadEmail],
    }));
  };

  const onApplyClick = (reqId, title) => {
    setFormData({
      name: "",
      role: title || "",
      email: "",
      phone: "",
      source: "",
      currentLocation: "",
      rate: "",
      relocation: "",
      passportNumber: "",
      last4SSN: "",
      visaStatus: "",
      linkedinUrl: "",
      clientDetails: "",
      forwardToLeads: [],
      addedBy: userEmail,
    });
    setResume([]);
    setShowFormId(reqId);
  };

  const handleSubmit = async (e, reqId) => {
    e.preventDefault();
    if (!resume.length) {
      setMessage("❌ Please upload at least one resume");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => data.append(`${key}[]`, v));
      } else {
        data.append(key, value);
      }
    });
    data.append("requirementId", reqId);
    resume.forEach((file) => data.append("resumes", file));

    try {
      setLoading(true);
      const res = await submitCandidate(data);
      setMessage(`✅ ${res.data?.message || "Candidate submitted successfully"}`);

      setFormData({
        name: "",
        role: "",
        email: "",
        phone: "",
        source: "",
        currentLocation: "",
        rate: "",
        relocation: "",
        passportNumber: "",
        last4SSN: "",
        visaStatus: "",
        linkedinUrl: "",
        clientDetails: "",
        forwardToLeads: [],
        addedBy: userEmail,
      });
      setResume([]);
      setShowFormId(null);

      const updatedCandidates = await getRecruiterCandidates(userEmail);
      const myCandidates = Array.isArray(updatedCandidates)
        ? updatedCandidates.filter((c) => c.addedBy === userEmail)
        : [];
      setSubmittedCandidates(myCandidates);
    } catch (err) {
      console.error("❌ Error submitting candidate:", err);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row">
        <nav className="sidebar-hover col-md-3 col-lg-2 bg-dark sidebar text-white pt-3">
          <h5 className="text-warning text-center mb-4">📋 Sections</h5>
          <ul className="nav flex-column">
            <li
              className={`nav-link ${activeSection === "assignedRequirements" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("assignedRequirements")}
              role="button"
            >
              📌 Assigned Requirements
            </li>
            <li
              className={`nav-link ${activeSection === "submittedCandidates" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("submittedCandidates")}
              role="button"
            >
              🧾 Submitted Candidates
            </li>
          </ul>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <h2 className="text-center text-primary mb-4">👷 Recruiter Dashboard</h2>
          {message && (
            <div className={`alert ${message.startsWith("✅") ? "alert-success" : "alert-danger"} text-center`}>
              {message}
            </div>
          )}

          {activeSection === "assignedRequirements" && (
            <>
              <h4 className="text-success mb-3">📌 Assigned Requirements</h4>
              {requirements.length === 0 ? (
                <p className="text-muted">No requirements assigned yet.</p>
              ) : (
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Requirement ID</th> {/* ✅ Add this */}

                      <th>Job Title</th>
                      <th>Post Date</th>
                      <th>Location</th>
                      <th>Experience</th>
                      <th>Rate</th>
                      <th>Employment</th>
                      <th>Setting</th>
                      <th>Skills</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((req) => (
                      <React.Fragment key={req._id}>
                        <tr>
                          <td>
                            {req.requirementId || "—"}
                            {/* {req.requirementId && (
                              <button
                                className="btn btn-sm btn-outline-secondary ms-2"
                                title="Copy ID"
                                onClick={() => {
                                  navigator.clipboard.writeText(req.requirementId);
                                  alert(" Requirement ID copied to clipboard!");
                                }}
                              >
                            
                              </button>
                            )} */}
                          </td>
                          <td>{req.title}</td>
                          <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                          <td>{req.locations?.join(", ") || req.location || "N/A"}</td>
                          <td>{req.experience || "N/A"}</td>
                          <td>{req.rate || "N/A"}</td>
                          <td>{req.employmentType || "N/A"}</td>
                          <td>{req.workSetting || "N/A"}</td>
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
                            <td colSpan="9">
                              <div className="p-3 bg-light border rounded">
                                <p><strong>Description:</strong> {req.description}</p>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => onApplyClick(req._id, req.title)}
                                >
                                  Apply
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}

              {requirements.map((req) => (
                <SubmitCandidateModal
                  key={`modal-${req._id}`}
                  show={showFormId === req._id}
                  handleClose={() => setShowFormId(null)}
                  formData={formData}
                  loading={loading}
                  handleChange={handleChange}
                  handleFileChange={handleFileChange}
                  handleSubmit={(e) => handleSubmit(e, req._id)}
                  leads={leads}
                  handleLeadSelect={handleLeadSelect}
                />
              ))}
            </>
          )}

          {activeSection === "submittedCandidates" && (
            <>
              <h4 className="text-info mb-3">🧾 Your Submitted Candidates</h4>
              {submittedCandidates.length === 0 ? (
                <p className="text-muted">No submissions yet.</p>
              ) : (
                <table className="table table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>Candidate ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {submittedCandidates.map((c) => (
                      <React.Fragment key={c._id}>
                        <tr>
                          <td>{c.candidateId || "—"}</td> {/* ✅ Show candidateId */}
                          <td>{c.name}</td>
                          <td>{c.email}</td>
                          <td>{c.phone}</td>
                          <td>{c.role}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-link text-primary"
                              onClick={() =>
                                setExpandedCandidate(expandedCandidate === c._id ? null : c._id)
                              }
                            >
                              {expandedCandidate === c._id ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>

                        {expandedCandidate === c._id && (
                          <tr>
                            <td colSpan="5">
                              <div className="p-3 bg-light border rounded">
                                <p><strong>Rate:</strong> {c.rate || "N/A"}</p>
                                <p><strong>Current Location:</strong> {c.currentLocation || "N/A"}</p>
                                <p><strong>Relocation:</strong> {c.relocation || "N/A"}</p>
                                <p><strong>Passport Number:</strong> {c.passportnumber || "N/A"}</p>
                                <p><strong>Last 4 SSN:</strong> {c.Last4digitsofSSN || "N/A"}</p>
                                <p><strong>Visa Status:</strong> {c.VisaStatus || "N/A"}</p>
                                <p><strong>LinkedIn:</strong> {c.LinkedinUrl ? <a href={c.LinkedinUrl} target="_blank" rel="noopener noreferrer">{c.LinkedinUrl}</a> : "N/A"}</p>
                                <p><strong>Client Details:</strong> {c.clientdetails || "N/A"}</p>
                                <p><strong>Added By:</strong> {c.addedBy || "N/A"}</p>
                                {c.resumeUrls && c.resumeUrls.length > 0 ? (
                                  c.resumeUrls.map((url, idx) => (
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
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
