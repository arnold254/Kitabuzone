// src/pages/auth/Signup.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = await signup({ name, email, password });
    if (userData) {
      navigate("/"); // redirect home on successful signup
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-purple-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md relative">
        {/* Nav link to login on top right */}
        <div className="absolute top-4 right-4 text-sm">
          <span className="text-gray-700">Already have an account? </span>
          <Link to="/auth/login" className="text-purple-700 hover:underline">
            Login
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Signup</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-medium"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
