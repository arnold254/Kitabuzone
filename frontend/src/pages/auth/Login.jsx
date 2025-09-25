// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after login
  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = login({ email, password }); // get role directly from login
    if (role) {
      // Redirect based on role
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-milky-white">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/" className="text-purple-700 hover:underline">
            &lt;-- Back Home
          </Link>
          <div className="flex gap-4">
            <Link to="/auth/signup" className="text-purple-700 hover:underline">
              Signup
            </Link>
            <Link to="/auth/reset" className="text-purple-700 hover:underline">
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
