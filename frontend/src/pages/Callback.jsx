import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      alert("❌ No code found in URL");
      return;
    }

    // Step 2: Send code to your backend
    fetch("/api/zoho/exchange-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Access Token Response:", data);
        // You can save access token in localStorage if needed
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("❌ Token exchange failed", err);
        alert("Failed to complete Zoho authorization.");
      });
  }, []);

  return <h3>🔁 Processing Zoho authorization...</h3>;
}
