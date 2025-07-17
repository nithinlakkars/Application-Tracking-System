import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import RequirementForm from "./RequirementForm";
import PostedRequirements from "./PostedRequirements";
import ForwardedCandidates from "./ForwardedCandidates";
import Navbar from "../../componenets/Navbar";

export default function SalesDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    leadEmails: [],
    recruiterEmails: [],
    locations: [],
    employmentType: "",
    workSetting: "",
    rate: "",
    primarySkills: "",
  });

  const [locationSearch, setLocationSearch] = useState("");
  const [activeSection, setActiveSection] = useState("requirementForm");

  const rateRanges = [
    "$50-60/hr",
    "$60-65/hr",
    "$65-70/hr",
    "$70-75/hr",
    "$75-80/hr",
    "$80-85/hr",
    "$85-90/hr",
    "$90-95/hr",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiCheckbox = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row">
        <nav className="sidebar-hover col-md-3 col-lg-2 bg-dark sidebar text-white pt-3">
          <h5 className="text-warning text-center mb-4">📋 Sections</h5>
          <ul className="nav flex-column">
            <li
              className={`nav-link ${activeSection === "requirementForm" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("requirementForm")}
              role="button"
            >
              ➕ New Requirement Form
            </li>
            <li
              className={`nav-link ${activeSection === "postedRequirements" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("postedRequirements")}
              role="button"
            >
              📝 Posted Requirements
            </li>
            <li
              className={`nav-link ${activeSection === "forwardedCandidates" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("forwardedCandidates")}
              role="button"
            >
              🚀 Forwarded Candidates
            </li>
          </ul>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <h2 className="text-center text-primary mb-4">🚀 Sales Dashboard</h2>

          {activeSection === "requirementForm" && (
            <>
              <p className="text-muted text-center">
                Submit job requirements to Leads and track them
              </p>
              <RequirementForm
                form={form}
                setForm={setForm}
                locationSearch={locationSearch}
                setLocationSearch={setLocationSearch}
                handleChange={handleChange}
                handleMultiCheckbox={handleMultiCheckbox}
                rateRanges={rateRanges}
              />
            </>
          )}

          {activeSection === "postedRequirements" && (
            <>
              <h4 className="text-success mb-3">📝 Your Posted Requirements</h4>
              <PostedRequirements />
            </>
          )}

          {activeSection === "forwardedCandidates" && (
            <>
              <h4 className="text-info mb-3">🚀 Forwarded Candidates</h4>
              <ForwardedCandidates />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
