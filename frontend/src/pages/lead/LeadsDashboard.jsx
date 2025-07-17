import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import NewRequirementsSection from "./NewRequirementsSection";
import SubmittedCandidates from "./SubmittedCandidates";
import RequirementHistory from "./RequirementHistory";
import Newrequirmentform from "./newrequirmentform";

import {
  fetchCandidates,
  fetchUnassignedRequirements,
  fetchAllRequirements,
  fetchRecruiters,
  forwardCandidateToSales,
} from "../../services";
import Navbar from "../../componenets/Navbar";

export default function LeadsDashboard() {
  const [requirements, setRequirements] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState("newRequirements");
  const [candidates, setCandidates] = useState([]);
  const [leadEmail, setLeadEmail] = useState("");

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

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setLeadEmail(user);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [candidatesRes, unassignedReqsRes, recruitersRes] = await Promise.all([
        fetchCandidates(),
        fetchUnassignedRequirements(),
        fetchRecruiters(),
      ]);

      setCandidates(candidatesRes?.candidates || []);
      setRequirements(unassignedReqsRes?.data || []);
      setRecruiters(recruitersRes?.data || []);
    } catch (error) {
      console.error("❌ Initial data load error:", error.response?.data || error);
      setMessage("❌ Failed to load initial data");
    }
  };

  // ✅ Add this function to reload candidates
  const loadCandidates = async () => {
    try {
      const response = await fetchCandidates();
      if (response && Array.isArray(response.candidates)) {
        setCandidates(response.candidates);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error("❌ Error loading candidates:", err);
      setCandidates([]);
    }
  };

  const refreshRequirements = async () => {
    try {
      const res = await fetchUnassignedRequirements();
      setRequirements(res?.data || []);
    } catch (error) {
      console.error("❌ Failed to refresh requirements:", error.response?.data || error);
      setMessage("❌ Failed to refresh requirements");
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
              className={`nav-link ${activeSection === "newRequirements" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("newRequirements")}
              role="button"
            >
              🆕 New Requirements
            </li>
            <li
              className={`nav-link ${activeSection === "newRequirementForm" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("newRequirementForm")}
              role="button"
            >
              📝 New Requirement Form
            </li>
            <li
              className={`nav-link ${activeSection === "submittedCandidates" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("submittedCandidates")}
              role="button"
            >
              📦 Submitted Candidates
            </li>
            <li
              className={`nav-link ${activeSection === "requirementHistory" ? "text-light bg-success" : "text-white"}`}
              onClick={() => setActiveSection("requirementHistory")}
              role="button"
            >
              📚 History
            </li>
          </ul>
        </nav>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          <h2 className="text-center text-success mb-4">📤 Leads Dashboard</h2>
          {message && (
            <div className={`alert ${message.startsWith("❌") ? "alert-danger" : "alert-success"} text-center`}>
              {message}
            </div>
          )}

          {activeSection === "newRequirementForm" && (
            <Newrequirmentform
              form={form}
              setForm={setForm}
              locationSearch={locationSearch}
              setLocationSearch={setLocationSearch}
              recruiters={recruiters}
              setMessage={setMessage}
              handleChange={handleChange}
              handleMultiCheckbox={handleMultiCheckbox}
              rateRanges={rateRanges}
            />
          )}

          {activeSection === "newRequirements" && (
            <NewRequirementsSection
              requirements={requirements}
              recruiters={recruiters}
              leadEmail={leadEmail}
              setMessage={setMessage}
              refreshRequirements={refreshRequirements}
            />
          )}

          {activeSection === "submittedCandidates" && (
            <SubmittedCandidates
              candidates={candidates}
              forwardCandidateToSales={forwardCandidateToSales}
              setCandidates={setCandidates}
              leadEmail={leadEmail}
              setMessage={setMessage}
              loadCandidates={loadCandidates} // ✅ Passed here
            />
          )}

          {activeSection === "requirementHistory" && <RequirementHistory />}
        </main>
      </div>
    </div>
  );
}
