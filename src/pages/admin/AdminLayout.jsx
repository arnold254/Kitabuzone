// src/pages/admin/AdminLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ import auth
import "../../styles/admin.css";

const AdminLayout = () => {
  const { logout } = useAuth(); // ✅ get logout function

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/books">Manage Books</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/sales">Sales Reports</Link>
          <Link to="/admin/lendings">Lending Reports</Link>
          <Link to="/admin/activities">Activity Logs</Link>
        </nav>
        {/* ✅ Logout button in sidebar */}
        <button onClick={logout} className="logout-btn" style={{ marginTop: '2rem' }}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
        </header>
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
