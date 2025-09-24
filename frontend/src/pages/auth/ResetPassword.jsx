// src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(`Password reset link sent to ${email}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-purple-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Reset Password</h2>
        {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg font-medium"
          >
            Send Reset Link
          </button>
        </form>
        <div className="mt-4 flex justify-between text-sm">
          <Link to="/auth/login" className="text-purple-700 hover:underline">
            Back to Login
          </Link>
          <Link to="/" className="text-purple-700 hover:underline">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
