import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    type: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await api.post("/signup", form);
      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="page">
      <h2>Signup</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="type" placeholder="School / Company" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />
      <input name="zip" placeholder="Zip" onChange={handleChange} />

      <br />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;
