import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react"; // nice icon

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");

  // Fetch users with token
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://kitabuzone-api.onrender.com/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Unable to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://kitabuzone-api.onrender.com/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);
        setUsers([...users, data.user]);
        setForm({ name: "", email: "", password: "", role: "customer" });
      } else {
        setMessage("❌ " + (data.error || "Failed to add user"));
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://kitabuzone-api.onrender.com/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🗑️ " + data.msg);
        setUsers(users.filter((u) => u.id !== id));
      } else {
        setMessage("❌ " + (data.error || "Failed to delete user"));
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-800">Manage Users</h2>

      {/* Add User Card */}
      <div className="max-w-sm bg-purple-50 shadow-lg rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-700 mb-4">➕ Add New User</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border border-purple-200 focus:ring-purple-400 focus:border-purple-400 p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-purple-200 focus:ring-purple-400 focus:border-purple-400 p-2 rounded"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-purple-200 focus:ring-purple-400 focus:border-purple-400 p-2 rounded"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-purple-200 focus:ring-purple-400 focus:border-purple-400 p-2 rounded"
          >
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
          >
            Save User
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-purple-700">{message}</p>}
      </div>

      {/* Users Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-purple-50 border border-purple-200 shadow-md rounded-xl p-4 relative"
          >
            {/* Delete icon */}
            <button
              onClick={() => handleDelete(u.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>

            <h4 className="font-bold text-purple-800">{u.name}</h4>
            <p className="text-sm text-purple-600">{u.email}</p>

            {/* Role badge */}
            <p className="text-sm mt-1">
              <span className="font-semibold">Role:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  u.role === "admin"
                    ? "bg-red-500"
                    : u.role === "supplier"
                    ? "bg-yellow-500"
                    : "bg-purple-500"
                }`}
              >
                {u.role}
              </span>
            </p>

            {/* Status */}
            <p
              className={`text-sm mt-1 font-semibold ${
                u.status === "Active" ? "text-green-600" : "text-red-600"
              }`}
            >
              Status: {u.status || "Inactive"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
