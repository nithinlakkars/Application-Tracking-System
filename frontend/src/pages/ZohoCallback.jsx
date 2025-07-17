import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ZohoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("Authorization code missing");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/zoho/exchange-token", { code });
        console.log("✅ Tokens exchanged:", response.data);

        const { access_token, userRole, userEmail } = response.data;

        sessionStorage.setItem("token", access_token);
        sessionStorage.setItem("role", userRole);
        sessionStorage.setItem("email", userEmail);

        if (userRole === "admin") navigate("/salesDashboard");
        else if (userRole === "leads") navigate("/LeadDashboard");
        else navigate("/recruitersubmit");

      } catch (err) {
        console.error("❌ Zoho Callback Error:", err.response?.data || err.message);
        alert("Zoho authorization failed.");
      }
    };

    exchangeToken();
  }, [navigate]);

  return <div>Processing Zoho authorization...</div>;
};

export default ZohoCallback;
