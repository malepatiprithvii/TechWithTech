import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("user_type", res.data.type);
      
      // Navigate based on user type if needed, or just to a dashboard
      if (res.data.type === "school") {
        navigate("/request");
      } else {
        navigate("/donate");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="page">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <br />
      <a href="#">Forgot Password</a>
      <br />
      <a href="/signup">Sign Up</a>
    </div>
  );
}
export default Login;
