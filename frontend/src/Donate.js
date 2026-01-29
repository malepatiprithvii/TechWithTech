import { useState, useEffect } from "react";
import api from "./api";

function Donate() {
  const [donations, setDonations] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    try {
        const [donRes, reqRes] = await Promise.all([
            api.get(`/donations/${userId}`),
            api.get(`/available-requests`)
        ]);
        setDonations(donRes.data);
        setAvailableRequests(reqRes.data);
    } catch (error) {
        console.error(error);
    }
  };

  const handleDonate = async () => {
    setMessage("");
    setIsError(false);

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setIsError(true);
      setMessage("Please login first");
      return;
    }

    try {
      await api.post("/donate", {
        user_id: userId,
        item,
        quantity: parseInt(quantity)
      });
      setIsError(false);
      setMessage("Donation submitted successfully!");
      setItem("");
      setQuantity("");
      fetchData(); // Refresh tables
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Failed to submit donation. Please try again.");
    }
  };

  return (
    <div className="page">
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={() => {
            localStorage.clear();
            window.location.href = "/";
        }} style={{ padding: "5px 10px", fontSize: "12px", background: "#666" }}>Logout</button>
      </div>

      <h2>Donations Contributed</h2>
      <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity Donated</th>
                <th>Date</th>
                <th>Shipping #</th>
            </tr>
        </thead>
        <tbody>
            {donations.length === 0 ? (
                <tr><td colSpan="4">No donations yet</td></tr> 
            ) : (
                donations.map(d => (
                    <tr key={d.id}>
                        <td>{d.item}</td>
                        <td>{d.quantity}</td>
                        <td>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</td>
                        <td>{d.shipping_number || "PENDING-123"}</td>
                    </tr>
                ))
            )}
        </tbody>
      </table>

      <h2 style={{marginTop: '40px'}}>New Donation</h2>
      {message && (
        <p style={{ color: isError ? "red" : "green" }}>{message}</p>
      )}
      
      <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Item</label>
      <input 
        placeholder="Item (e.g. Books, Pencils)" 
        value={item}
        onChange={(e) => setItem(e.target.value)}
        style={{marginBottom: '10px'}}
      />
      
      <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Quantity</label>
      <input 
        placeholder="Quantity" 
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
      />
      
      <h3>Pick from Available Schools</h3>
      <p style={{fontSize: '12px', color: '#666'}}>Click a row to autofill</p>
      <table>
        <thead>
            <tr>
                <th>Company (School)</th>
                <th>Item Needed</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            {availableRequests.length === 0 ? (
                <tr><td colSpan="3">No requests available</td></tr> 
            ) : (
                availableRequests.map(r => (
                    <tr key={r.id} onClick={() => {
                        setItem(r.item);
                        setQuantity(r.quantity); 
                    }} style={{cursor: 'pointer'}} title="Click to fill form">
                        <td>{r.school_name}</td>
                        <td>{r.item}</td>
                        <td>{r.quantity}</td>
                    </tr>
                ))
            )}
        </tbody>
      </table>

      <button onClick={handleDonate}>Submit Donation</button>
    </div>
  );
}
export default Donate;
