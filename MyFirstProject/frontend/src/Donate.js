import { useState } from "react";
import api from "./api";

function Donate() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleDonate = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      await api.post("/donate", {
        user_id: userId,
        item,
        quantity: parseInt(quantity)
      });
      alert("Donation submitted successfully!");
      setItem("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit donation");
    }
  };

  return (
    <div>
      <h2>Donation Dashboard</h2>
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
      <button onClick={handleDonate}>Submit</button>
    </div>
  );
}
export default Donate;
