import React, { useEffect, useState } from "react";
import citiesByState from "../../data/usCitiesByState.json";
import {
  fetchSalesLeads,
  fetchRecruiters,
  submitSalesRequirement,
} from "../../services";

const requiredFields = [
  "title",
  "description",
  "leadEmails",
  
  "locations",
  "employmentType",
  "workSetting",
  "rate",
  "primarySkills",
];
export default function RequirementForm({
  form,
  setForm,
  locationSearch,
  setLocationSearch,
  handleChange,
  handleMultiCheckbox,
  rateRanges,
}) {
  const [leads, setLeads] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  useEffect(() => {
    const loadData = async () => {
      try {
        const leadsData = await fetchSalesLeads();
        setLeads(leadsData);
        const recruitersData = await fetchRecruiters();
        setRecruiters(recruitersData);
      } catch (err) {
        console.error("Error loading leads or recruiters", err);
        setErrorMsg("❌ Failed to load leads or recruiters");
      }
    };
    loadData();
  }, []);

  const handleSubmitRequirement = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.leadEmails.length || !form.title || !form.description) {
      setErrorMsg("❌ Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await submitSalesRequirement(form);
      console.log("Submitted requirement:", form);

      setForm({
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
      setLocationSearch("");
      setSuccessMsg("✅ Requirement submitted successfully!");
    } catch {
      setErrorMsg("❌ Failed to submit requirement");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
    }
  };

  const searchResults = [];
  if (locationSearch.trim()) {
    Object.entries(citiesByState).forEach(([state, cities]) => {
      cities.forEach((city) => {
        const label = `${city}, ${state}`;
        if (
          label.toLowerCase().includes(locationSearch.toLowerCase()) &&
          !form.locations.includes(label)
        ) {
          searchResults.push(label);
        }
      });
    });
  }

  return (
    <div className="card p-4 mb-5 shadow">
      <h4 className="mb-3 text-success">📋 Post New Requirement</h4>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmitRequirement}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="form-control mb-2"
          value={form.title}
          onChange={handleChange}
          required = {requiredFields.includes("title")}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          rows="3"
          className="form-control mb-2"
          value={form.description}
          onChange={handleChange}
          required = {requiredFields.includes("description")} 
        />

        <label className="fw-bold">Assign to Leads:</label>
        <div className="mb-2 d-flex flex-wrap">
          {leads.length === 0 ? (
            <p className="text-muted">No leads available</p>
          ) : (
            leads.map((lead) => (
              <div key={lead.email} className="form-check me-3 mb-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`lead-${lead.email}`}
                  checked={form.leadEmails.includes(lead.email)}
                  onChange={() => handleMultiCheckbox("leadEmails", lead.email)}
                  // required = {requiredFields.includes("leadEmails")}
                />
                <label className="form-check-label" htmlFor={`lead-${lead.email}`}>
                  {lead.username || lead.email}
                </label>
              </div>
            ))
          )}
        </div>

        <label className="fw-bold mt-3">Assign to Recruiters:</label>
        <div className="mb-2 d-flex flex-wrap">
          {recruiters.length === 0 ? (
            <p className="text-muted">No recruiters available</p>
          ) : (
            recruiters.map((rec) => (
              <div key={rec.email} className="form-check me-3 mb-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`rec-${rec.email}`}
                  checked={form.recruiterEmails?.includes(rec.email)}
                  onChange={() => handleMultiCheckbox("recruiterEmails", rec.email)}
                />
                <label className="form-check-label" htmlFor={`rec-${rec.email}`}>
                  {rec.username || rec.email}
                </label>
              </div>
            ))
          )}
        </div>

        <label className="fw-bold mt-3">Locations:</label>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search US City or State"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          // required = {requiredFields.includes("locations")}
        />
        {searchResults.length > 0 && (
          <div
            className="border rounded p-2 mb-2"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          >
            {searchResults.slice(0, 10).map((loc) => (
              <button
                key={loc}
                type="button"
                className="btn btn-sm btn-outline-primary me-2 mb-1"
                onClick={() => {
                  handleMultiCheckbox("locations", loc);
                  setLocationSearch("");
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
        {form.locations.length > 0 && (
          <div className="mb-2">
            {form.locations.map((loc) => (
              <span key={loc} className="badge bg-success me-2 mb-1">
                {loc}
              </span>
            ))}
          </div>
        )}

        <div className="row">
          <div className="col-md-6 mb-2">
            <select
              name="employmentType"
              className="form-select"
              value={form.employmentType}
              onChange={handleChange}
              required = {requiredFields.includes("employmentType")}
            >
              <option value="">Select Employment Type</option>
              <option value="W2">W2</option>
              <option value="C2C">C2C</option>
            </select>
          </div>
          <div className="col-md-6 mb-2">
            <select
              name="workSetting"
              className="form-select"
              value={form.workSetting}
              onChange={handleChange}
              required = {requiredFields.includes("workSetting")}
            >
              <option value="">Select Work Setting</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        <select
          name="rate"
          className="form-select mb-2"
          value={form.rate}
          onChange={handleChange}
          required = {requiredFields.includes("rate")}
        >
          <option value="">Select Rate Range</option>
          {rateRanges.map((rate) => (
            <option key={rate} value={rate}>
              {rate}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="primarySkills"
          placeholder="Primary Skills (comma separated)"
          className="form-control mb-3"
          value={form.primarySkills}
          onChange={handleChange}
          required = {requiredFields.includes("primarySkills")}
        />

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Requirement"}
        </button>
      </form>
    </div>
  );
}
