// src/pages/ShoppingCart.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api";

export default function ShoppingCart() {
  const { user } = useAuth();
  const [cartOrders, setCartOrders] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false); // trigger refresh

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await API.get("/shoppingCart");
      const cartItems = res.data.cart
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setCartOrders(cartItems);
    } catch (err) {
      console.error("Failed to fetch cart orders:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, refreshFlag]); // refresh when user changes or refreshFlag toggles

  // Listen for new approvals from admin actions
  useEffect(() => {
    const handleNewApproval = () => setRefreshFlag(prev => !prev);
    window.addEventListener("new-approval", handleNewApproval);
    return () => window.removeEventListener("new-approval", handleNewApproval);
  }, []);

  // Polling fallback: fetch cart every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCart();
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const totalAmount = cartOrders.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">🛒 Shopping Cart</h1>
          <Link
            to="/viewOrders"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            ⬅️ Back to Orders
          </Link>
        </div>

        {cartOrders.length === 0 ? (
          <p className="text-purple-700">No approved orders yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cartOrders.map(item => (
                <div
                  key={item.cart_item_id}
                  className="bg-white border border-purple-200 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col"
                >
                  <h2 className="font-semibold text-purple-800 mb-1">
                    {item.title || "Unknown Book"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">
                    Price: KES {item.price || 0}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Quantity: {item.quantity || 1}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    Status: Approved
                  </p>

                  <Link
                    to="/payment/card"
                    state={{ total: totalAmount, orders: [item] }}
                    className="mt-auto px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm text-center"
                  >
                    💳 Checkout
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center border-t pt-4">
              <p className="text-lg font-bold text-purple-900">
                Total: KES {totalAmount}
              </p>
              <Link
                to="/payment/card"
                state={{ total: totalAmount, orders: cartOrders }}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-medium"
              >
                💳 Proceed to Payment
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
