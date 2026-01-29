import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function RequestsFeed() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/available-requests");
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  return (
    <div className="page">
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={() => navigate("/")} style={{ padding: "5px 10px", fontSize: "12px", background: "#666" }}>Back to Login</button>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Community Requests</h2>
      
      <div style={{ display: "grid", gap: "20px", maxWidth: "600px", margin: "0 auto" }}>
        {requests.length === 0 ? (
          <p style={{ textAlign: "center" }}>No active requests at the moment.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} style={{ 
              background: "white", 
              padding: "20px", 
              borderRadius: "8px", 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderLeft: "5px solid #C07A40"
            }}>
              <p style={{ fontSize: "18px", margin: "0 0 10px 0" }}>
                <strong>{r.school_name}</strong> has requested <strong>{r.quantity} {r.item}</strong>
              </p>
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                Date: {r.date ? new Date(r.date).toLocaleDateString() : "Recent"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RequestsFeed;
