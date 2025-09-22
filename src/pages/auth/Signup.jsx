import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("Signup:", { name, email, password }); // Mock submission
    alert("✅ Signup successful (mock)");
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
        <h1 className="text-2xl font-bold text-purple-900 mb-6 text-center">Signup</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-purple-900 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-purple-900 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-purple-900 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
          >
            Signup
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/auth/login" className="text-purple-700 hover:underline text-sm">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;