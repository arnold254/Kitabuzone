import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    console.log("Forgot Password:", { email }); // Mock submission
    alert("✅ Password reset email sent (mock)");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">
          Back to Home
        </Link>
      </div>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-purple-900 mb-1">Enter your email</label>
            <input
              type="email"
              name="email"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-purple-700 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;