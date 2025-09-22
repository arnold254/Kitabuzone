import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  console.log("AdminLayout: Rendering admin sidebar");

  return (
    <div className="flex min-h-screen">
      <aside className="bg-purple-700 text-white w-48 p-3 fixed top-0 left-0 h-full z-20 border-r border-purple-800 rounded-r-lg shadow-lg">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white mb-4 pointer-events-none">Admin Panel</h2>
          <nav className="flex flex-col gap-2">
            <Link
              to="/admin"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/books"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Manage Books
            </Link>
            <Link
              to="/admin/users"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/sales"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Sales Reports
            </Link>
            <Link
              to="/admin/lendings"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Lending Reports
            </Link>
            <Link
              to="/admin/activities"
              className="text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              Activity Logs
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-white text-xs py-2 px-2 rounded-md hover:bg-purple-800 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 ml-48 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;