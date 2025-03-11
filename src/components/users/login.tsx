import {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../utils/userUtils";

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useLogin()
  const message = localStorage.getItem("message")
  setTimeout(() => {
    localStorage.removeItem("message")
  }, 5000)

  useEffect(() => {
    const forms = document.querySelectorAll(".needs-validation");

    const handleSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    };

    forms.forEach((form) => {
      form.addEventListener("submit", handleSubmit);
    });

    // Cleanup function to remove event listeners
    return () => {
      forms.forEach((form) => {
        form.removeEventListener("submit", handleSubmit);
      });
    };
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await login(email, password);  
    navigate("/profile");   
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center bg-secondary min-vh-100" >
       {message && <p className="alert alert-danger   text-center" role="alert">{message}</p>}

      <div className=" border rounded p-5 py-4 shadow" style={{minWidth: '35%'}}>
        <h2 className="text-center">Login</h2>
        {error && <p className="color-danger">{error}</p>}
        
        <form onSubmit={handleLogin} className="mt-4 needs-validation" noValidate>
          <div className="input-group mb-3">
            <div className="input-group-text"><i className="bi bi-person-fill"></i></div>
            <input 
              type="email" 
              id="email"  // Added id for accessibility
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-control border rounded-end"  // Corrected to form-control for input styling
              required
            />
            <div className="invalid-feedback">
              Please enter valid email.
            </div>
          </div>

          <div className="input-group">
            <div className="input-group-text"><i className="bi bi-key-fill"></i></div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-control  border rounded-end "
              required
            />
            <div className="invalid-feedback">
              Please enter password.
            </div>

          </div>

          <div className="d-flex justify-content-end">
            <a className="text-white" href="/change-password">Click here to change password</a>
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
