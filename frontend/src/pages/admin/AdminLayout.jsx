import { Outlet, NavLink, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-purple-100 text-purple-900 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex-1 space-y-3 mt-6">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/managebooks"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Manage Books
          </NavLink>
          <NavLink
            to="/admin/manageusers"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/activitylogs"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Activity Logs
          </NavLink>
          <NavLink
            to="/admin/borrowingreport"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Borrowing Report
          </NavLink>
          <NavLink
            to="/admin/salesreport"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-purple-200 font-semibold" : "hover:bg-purple-50"
              }`
            }
          >
            Sales Report
          </NavLink>
        </nav>

        <div className="mt-auto space-y-3">
          <NavLink
            to="/library"
            className="block px-3 py-2 rounded hover:bg-purple-50"
          >
            Library Express
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 rounded hover:bg-purple-50"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
