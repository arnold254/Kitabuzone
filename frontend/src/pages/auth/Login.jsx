import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/forms/LoginForm";

const Login = () => {
  const { login, user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!isAuthLoading && user && location.pathname !== "/admin") {
      console.log("Login: User state updated:", user);
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, isAuthLoading, navigate, from, location.pathname]);

  const handleLogin = (formData) => {
    setError("");
    console.log("Login: Attempt with:", formData);

    if (formData.email === "admin@example.com" && formData.password === "admin123") {
      const userData = { role: "admin", email: formData.email };
      console.log("Login: Logging in as admin:", userData);
      login(userData);
    } else if (formData.email === "user@example.com" && formData.password === "user123") {
      const userData = { role: "user", email: formData.email };
      console.log("Login: Logging in as user:", userData);
      login(userData);
    } else {
      setError("Invalid credentials");
    }
  };

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">Back to Home</Link>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">Login</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <LoginForm onSubmit={handleLogin} />
        <div className="mt-4 flex flex-col items-center gap-2">
          <Link to="/auth/forgot-password" className="text-purple-700 hover:underline text-sm">Forgot Password?</Link>
          <Link to="/auth/signup" className="text-purple-700 hover:underline text-sm">Don’t have an account? Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;