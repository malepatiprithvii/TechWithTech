import { useState } from "react";
import api from "./api";

function Request() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleRequest = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      await api.post("/request", {
        user_id: userId,
        item,
        quantity: parseInt(quantity)
      });
      alert("Request submitted successfully!");
      setItem("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="page">
      <h2>School Request Dashboard</h2>
      <input 
        placeholder="Item" 
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <input 
        placeholder="Quantity" 
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleRequest}>Submit</button>
    </div>
  );
}
export default Request;
