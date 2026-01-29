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
    <div className="page" style={{textAlign: 'center', marginTop: '100px', border: 'none', background: 'transparent'}}>
      
      <div className="auth-container" style={{background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
        <h2 style={{marginBottom: '30px'}}>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <div style={{textAlign: 'left', margin: '0 auto', maxWidth: '360px'}}>
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Login</label>
            <input 
                placeholder="" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            
            <label style={{fontWeight: 'bold', display: 'block', marginBottom: '5px'}}>Password</label>
            <input 
                type="password" 
                placeholder="" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button onClick={handleLogin} style={{width: '100%', maxWidth: '360px'}}>Login</button>
        
        <div style={{display: 'flex', justifyContent: 'space-between', maxWidth: '360px', margin: '20px auto'}}>
            <a href="/feed" style={{fontWeight: 'bold'}}>View Community Requests</a>
            <a href="/signup">Signup</a>
        </div>
      </div>
    </div>
  );
}
export default Login;
