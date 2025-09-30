// src/pages/ViewOrders.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api";

export default function ViewOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    API.get("/pendingRequests")
      .then(res => {
        // Sort so most recent approved orders appear first
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      })
      .catch(err => console.error("Failed to fetch orders:", err));
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setOrders(prev => prev.filter(o => o.id !== orderId));

    try {
      await API.patch(`/pendingRequests/${orderId}`, { status: "cancelled" });
    } catch (err) {
      console.error("Failed to cancel order:", err);
      API.get("/pendingRequests").then(res => setOrders(res.data));
    }
  };

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
                    {order.book ? order.book.title : "Unknown Book"}
                  </h2>
                  <p className="text-purple-700 text-sm mb-1">Order #: {order.id}</p>
                  <p className="text-gray-600 text-sm mb-1">
                    Status:
                    <span
                      className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "approved" ? "bg-green-100 text-green-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Total: KES {order.book ? order.book.price : 0}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Created: {order.created_at ? new Date(order.created_at).toLocaleDateString() : "Unknown"}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleCancel(order.id)}
                  >
                    🗑️ Cancel
                  </button>

                  {order.status === "approved" && (
                    <Link
                      to="/shoppingCart"
                      className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                    >
                      💳 Checkout
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
