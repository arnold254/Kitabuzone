import { useAdmin } from "../../context/AdminContext";
import PropTypes from "prop-types";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SalesReports = () => {
  const { orders, books } = useAdmin();
  const isLoading = !orders || !books;
  const [view, setView] = useState("all"); // "all", "revenue", "pending", "approved"

  const totalRevenue = orders
    .reduce((sum, o) => (o.status === "Approved" ? sum + parseFloat(books.find((b) => b.id === o.bookId)?.price?.replace("$", "") || 0) : sum), 0)
    .toFixed(2);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const approvedOrders = orders.filter((o) => o.status === "Approved").length;

  const salesData = orders.reduce((acc, o) => {
    if (o.status === "Approved") {
      try {
        const date = new Date(o.date);
        if (!isNaN(date)) {
          const month = date.toLocaleString("default", { month: "short" });
          const price = parseFloat(books.find((b) => b.id === o.bookId)?.price?.replace("$", "") || 0);
          acc[month] = (acc[month] || 0) + price;
        }
      } catch (e) {
        console.warn(`Invalid date for order ${o.id}: ${o.date}`);
      }
    }
    return acc;
  }, {});

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Revenue (KES)",
        data: months.map((month) => salesData[month] || 0),
        backgroundColor: "#6b21a8",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const filteredOrders = view === "all" ? orders : orders.filter((o) => view === "pending" ? o.status === "Pending" : view === "approved" ? o.status === "Approved" : true);

  if (isLoading) {
    return <div className="bg-gray-50 p-6 text-purple-900 text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">💰 Sales Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Total Revenue" value={`KES ${totalRevenue}`} onClick={() => setView(view === "revenue" ? "all" : "revenue")} active={view === "revenue"} />
        <Card title="Pending Orders" value={pendingOrders} onClick={() => setView(view === "pending" ? "all" : "pending")} active={view === "pending"} />
        <Card title="Approved Orders" value={approvedOrders} onClick={() => setView(view === "approved" ? "all" : "approved")} active={view === "approved"} />
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          {view === "revenue" ? "Revenue Details" : view === "pending" ? "Pending Orders" : view === "approved" ? "Approved Orders" : "Order Details"}
        </h3>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Book</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-600">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.user}</td>
                  <td className="p-2">{books.find((b) => b.id === o.bookId)?.title || "Unknown"}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{new Date(o.date).toLocaleDateString()}</td>
                  <td className="p-2">{books.find((b) => b.id === o.bookId)?.price || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Sales Trends</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const Card = ({ title, value, onClick, active }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer ${active ? "border-2 border-purple-700" : ""}`}
    onClick={onClick}
  >
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-purple-700">{value}</p>
  </div>
);

SalesReports.propTypes = {
  orders: PropTypes.array,
  books: PropTypes.array,
};

export default SalesReports;