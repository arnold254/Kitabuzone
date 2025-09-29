// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import API from "../../api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    borrowedBooks: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    API.get("/dashboardStats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "bg-purple-600" },
    { label: "Total Books", value: stats.totalBooks, color: "bg-indigo-600" },
    { label: "Borrowed Books", value: stats.borrowedBooks, color: "bg-blue-600" },
    { label: "Pending Requests", value: stats.pendingRequests, color: "bg-red-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-purple-900">📊 Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-lg shadow-md text-white ${card.color}`}
          >
            <p className="text-sm">{card.label}</p>
            <p className="text-2xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
