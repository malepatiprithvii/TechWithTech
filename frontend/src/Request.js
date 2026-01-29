import { useState, useEffect } from "react";
import api from "./api";

function Request() {
  const [requests, setRequests] = useState([]);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    try {
      const res = await api.get(`/requests/${userId}`);
      setRequests(res.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  const handleRequest = async () => {
    setMessage("");
    setIsError(false);
    
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setIsError(true);
      setMessage("Please login first");
      return;
    }

    try {
      await api.post("/request", {
        user_id: userId,
        item,
        quantity: parseInt(quantity)
      });
      setIsError(false);
      setMessage("Request submitted successfully!");
      setItem("");
      setQuantity("");
      fetchRequests(); // Refresh table
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Failed to submit request. Please try again.");
    }
  };

  const pendingRequests = requests.filter(r => r.status === "Pending");
  const processedRequests = requests.filter(r => r.status !== "Pending");

  return (
    <div className="page">
      {/* Brand Header */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => window.location.href = "/donate"} style={{ padding: "5px 10px", fontSize: "12px", background: "#C07A40" }}>
            Switch to Donations
        </button>
        <button onClick={() => {
            localStorage.clear();
            window.location.href = "/";
        }} style={{ padding: "5px 10px", fontSize: "12px", background: "#666" }}>Logout</button>
      </div>

      <h2>Pending Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity Requested</th>
            <th>Pending Since</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.length === 0 ? (
            <tr><td colSpan="4">No pending requests</td></tr>
          ) : (
            pendingRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.item}</td>
                <td>{r.quantity}</td>
                <td>{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2>Processed Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {processedRequests.length === 0 ? (
            <tr><td colSpan="3">No processed requests</td></tr>
          ) : (
            processedRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.item}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 style={{ marginTop: "40px" }}>New Request</h2>
      {message && (
        <p style={{ color: isError ? "red" : "green" }}>{message}</p>
      )}
      <input 
        placeholder="Item" 
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input 
        placeholder="Quantity" 
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
      />
      <button onClick={handleRequest}>Submit</button>
    </div>
  );
}
export default Request;
