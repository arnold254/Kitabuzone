import { useState } from "react";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/users/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);
        setForm({ name: "", email: "", password: "", role: "customer" });
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded w-full"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded w-full"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="supplier">Supplier</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default AddUser;
