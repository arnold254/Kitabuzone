// src/pages/auth/Login.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ use context
import LoginForm from "../../components/forms/LoginForm";
import "../../styles/login.css";
import "../../styles/login-form.css";

const Login = () => {
  const { login } = useAuth();

  const handleLogin = (formData) => {
    // Mocked login logic
    if (formData.email === "admin@example.com" && formData.password === "admin123") {
      login({ role: "admin", email: formData.email });
    } else if (formData.email === "user@example.com" && formData.password === "user123") {
      login({ role: "user", email: formData.email });
    } else {
      alert("❌ Invalid credentials (mock check)");
    }
  };

  return (
    <div className="page">
      <div className="page-overlay">
        <div className="page-content">
          <h1 className="page-title">Login</h1>

          {/* ✅ Reusable form */}
          <LoginForm onSubmit={handleLogin} />

          {/* ✅ Correct paths */}
          <Link to="/auth/forgot-password" className="page-link">
            Forgot Password?
          </Link>
          <Link to="/auth/signup" className="page-link">
            Don’t have an account? Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
