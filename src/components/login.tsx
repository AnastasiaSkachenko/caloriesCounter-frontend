import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../utils/userUtils";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useLogin()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await login(email, password);  
    navigate("/profile");   
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-secondary" style={{minHeight: '100vh'}}>
      <div className=" border rounded p-5 py-4 shadow">
        <h2 className="text-center">Login</h2>
        {error && <p className="color-danger">{error}</p>}
        
        <form onSubmit={handleLogin} className="mt-4">
          <div className="input-group mb-3">
            <div className="input-group-text"><i className="bi bi-person-fill"></i></div>
            <input 
              type="email" 
              id="email"  // Added id for accessibility
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"  // Corrected to form-control for input styling
              required
            />
          </div>

          <div className="input-group">
            <div className="input-group-text"><i className="bi bi-key-fill"></i></div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="d-flex justify-content-center mt-3">
            <button 
              type="submit" 
              className=" btn btn-dark"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p>Don't have an account? <a href="/register">Create one here</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
