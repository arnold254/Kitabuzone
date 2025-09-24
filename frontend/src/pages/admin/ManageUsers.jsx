// src/pages/admin/ManageUsers.jsx
import { useState } from "react";

const ManageUsers = () => {
  // Sample data (replace with real API/backend later)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      borrowedCount: 3,
      status: "Active"
    },
    {
      id: 2,
      name: "Mary Smith",
      email: "mary.smith@example.com",
      borrowedCount: 0,
      status: "Inactive"
    },
    {
      id: 3,
      name: "Alex Johnson",
      email: "alex.j@example.com",
      borrowedCount: 1,
      status: "Active"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleRemoveUser = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with search bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">👥 Manage Users</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />
      </div>

      {/* Users Cards Grid */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-purple-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-2">Borrowed: {user.borrowedCount}</p>
                <p className={`text-xs font-medium mt-1 ${
                    user.status === "Active"
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  } inline-block px-2 py-1 rounded`}
                >
                  {user.status}
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
                {/* Optionally: view details */}
                <button
                  onClick={() => alert(`Viewing details for ${user.name}`)}
                  className="text-purple-600 text-sm hover:underline"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
