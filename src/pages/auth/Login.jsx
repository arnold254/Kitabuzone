import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = (formData) => {
    if (formData.email === "admin@example.com" && formData.password === "admin123") {
      login({ role: "admin", email: formData.email });
      navigate("/admin");
    } else if (formData.email === "user@example.com" && formData.password === "user123") {
      login({ role: "user", email: formData.email });
      navigate(from, { replace: true });
    } else {
      alert("❌ Invalid credentials (mock check)");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">Login</h1>
        <LoginForm onSubmit={handleLogin} />
        <div className="mt-4 flex flex-col items-center gap-2">
          <Link to="/auth/forgot-password" className="text-purple-700 hover:underline text-sm">
            Forgot Password?
          </Link>
          <Link to="/auth/signup" className="text-purple-700 hover:underline text-sm">
            Don’t have an account? Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;