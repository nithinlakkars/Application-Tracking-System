// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error);
    return error.response.data;
  }
};

export const fetchSalesLeads = async () => {
  try {
    const leadsRes = await axios.get(`${API_URL}/api/leads`);
    return leadsRes.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};
export const submitSalesRequirement = async (requirement) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/requirements/sales/submit`,
      requirement,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error submitting requirement:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchSalesRequirements = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/requirements/sales/view`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return error;
  }
};

// 1️⃣ Fetch unassigned requirements (for Lead)
export const fetchUnassignedRequirements = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/requirements/leads/unassigned`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// 2️⃣ Fetch all recruiters
export const fetchRecruiters = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/recruiters`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

// 3️⃣ Bulk assign requirements to recruiters
export const bulkAssignRequirements = async (payload) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/requirements/leads/assign-multiple`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// 4️⃣ Fetch all requirements assigned to this lead (history)
export const fetchAllRequirements = async () => {
  return await axios.get(`${API_URL}/api/requirements/leads/my`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
};

// 5️⃣ Fetch candidates submitted by recruiters to Lead
export const fetchCandidates = async () => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) throw new Error("No token found in session storage");

    const res = await axios.get(`${API_URL}/api/candidates/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // Assuming your backend returns { data: [...] }
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    return { error: true, message: error.message };
  }
};

// 6️⃣ Forward candidate to Sales
export const forwardCandidateToSales = async (candidateId, payload) => {
  return await axios.post(
    `${API_URL}/api/candidates/leads/forward/${candidateId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};

export const getAssignedRequirements = async (email) => {
  try {
    const token = sessionStorage.getItem("token"); // Include auth if needed

    const res = await axios.get(
      `${API_URL}/api/requirements/recruiter/view?email=${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch assigned requirements:", error);
    return { error: true, message: error.message };
  }
};

export const getAllCandidates = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.get(`${API_URL}/api/candidates/leads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    return { error: true, message: error.message };
  }
};
export const getRecruiterCandidates = async (userEmail) => {
  try {
    const token = sessionStorage.getItem("token");
    const res = await axios.get(
      `${API_URL}/api/candidates/recruiter/my-candidates/${userEmail}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(res.data.candidates);
    return res.data.candidates;
  } catch (error) {
    console.error("❌ Error fetching recruiter candidates:", error);
    return [];
  }
};

export const submitCandidate = async (data) => {
  try {
    const token = sessionStorage.getItem("token");

    const res = await axios.post(
      `${API_URL}/api/candidates/recruiter/upload`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("❌ Error submitting candidate:", error);
    return { error: true, message: error.message };
  }
};

export const getForwardedCandidates = async () => {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const res = await axios.get(`${API_URL}/api/candidates/sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch forwarded candidates:", err);
    return { error: true, message: err.message };
  }
};

