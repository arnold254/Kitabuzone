import { useAdmin } from "../../context/AdminContext";
import { useState } from "react";

const ManageUsers = () => {
  const { users, books, suspendUser, unsuspendUser } = useAdmin();
  const [search, setSearch] = useState("");

  if (!users || !books) {
    console.error("ManageUsers: Missing users or books data", { users, books });
    return <div className="text-red-600 p-6">Error: No user or book data available.</div>;
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  console.log("ManageUsers: Rendering users:", filteredUsers);

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">👥 Manage Users</h2>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <input
          type="text"
          placeholder="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg text-sm w-full"
        />
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Users</h3>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Email</th>
              <th className="p-2">Borrowed Books</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-600">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    {(user.borrowedBooks || []).map((bookId) => 
                      books.find((b) => b.id === bookId)?.title || "Unknown"
                    ).join(", ") || "None"}
                  </td>
                  <td className="p-2">{(user.orders || []).length}</td>
                  <td className="p-2">{user.status}</td>
                  <td className="p-2">
                    <Button
                      onClick={() => (user.status === "Active" ? suspendUser(user.id) : unsuspendUser(user.id))}
                      text={user.status === "Active" ? "Suspend" : "Unsuspend"}
                      color={user.status === "Active" ? "red" : "green"}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Button = ({ onClick, text, color }) => {
  console.log(`Button: Rendering ${text} with color ${color}`);
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-600 text-white px-4 py-1.5 rounded-lg hover:bg-${color}-700 text-sm font-medium min-w-[80px] relative z-10`}
    >
      {text}
    </button>
  );
};

export default ManageUsers;