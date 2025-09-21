// src/pages/admin/Dashboard.jsx
const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Books</h3>
          <p className="text-2xl font-bold text-purple-700">1,250</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Active Borrowings</h3>
          <p className="text-2xl font-bold text-purple-700">320</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-2xl font-bold text-purple-700">180</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-2xl font-bold text-purple-700">KES 45,000</p>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white p-6 rounded-xl shadow h-64 flex items-center justify-center text-gray-500">
        📊 Charts/Reports will go here
      </div>
    </div>
  );
};

export default Dashboard;
