// src/pages/ViewOrders.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api";

export default function ViewOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Fetch orders from new backend endpoint
  const fetchOrders = async () => {
    if (!user) return;

    try {
      // ✅ Hit the new endpoint
      const res = await API.get("/orders/vieworders");

      // ✅ Filter to this user’s orders (backend already restricts by user, but safe to double-check)
      const userOrders = res.data.filter(order => order.user_id === user.id);

      // ✅ Sort by created_at desc
      const sortedOrders = userOrders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleApproval = () => fetchOrders();
    window.addEventListener("new-approval", handleApproval);

    return () => window.removeEventListener("new-approval", handleApproval);
  }, [user]);

  const handleClearAll = () => {
    if (!window.confirm("Are you sure you want to clear all order history?")) return;
    setOrders([]);
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">My Orders</h1>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 transition"
            >
              🏠 Back to Home
            </Link>

            <Link
              to="/shoppingCart"
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 transition flex items-center gap-2"
            >
              🛒 Shopping Cart
            </Link>

            {orders.length > 0 && (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleClearAll}
              >
                🗑️ Clear Order History
              </button>
            )}
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="text-purple-700">You have no orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="font-semibold text-purple-800 mb-1">
                    {/* If multiple items, show first item’s title or a count */}
                    {order.items && order.items.length > 0
                      ? `${order.items[0].title} ${order.items.length > 1 ? `+${order.items.length - 1} more` : ""}`
                      : "Unknown Book"}
                  </h2>
                  <p className="text-purple-700 text-sm mb-1">Order #: {order.id}</p>
                  <p className="text-gray-600 text-sm mb-1">
                    Status:
                    <span
                      className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : order.status === "purchased"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status === "purchased" ? "Purchased" : order.status}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Total: KES {order.total_amount}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Created:{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
