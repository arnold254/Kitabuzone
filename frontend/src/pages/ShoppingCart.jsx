// src/pages/ShoppingCart.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function ShoppingCart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartOrders, setCartOrders] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Fetch cart including approved orders
  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await API.get("/shoppingCart");
      const cartItems = res.data.cart.sort(
        (a, b) => b.cart_item_id - a.cart_item_id // most recent on top
      );
      setCartOrders(cartItems);
    } catch (err) {
      console.error("Failed to fetch cart orders:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, refreshFlag]);

  useEffect(() => {
    const handleNewApproval = () => setRefreshFlag(prev => !prev);
    window.addEventListener("new-approval", handleNewApproval);
    return () => window.removeEventListener("new-approval", handleNewApproval);
  }, []);

  // Total amount
  const totalAmount = cartOrders.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Handle checkout
  const handleCheckout = async () => {
    if (!cartOrders.length) return;

    try {
      // Mark all items as checked out
      await API.post("/shoppingCart/checkout");

      // Redirect to payment page
      navigate("/payment/card", { state: { total: totalAmount, orders: cartOrders } });

      // Clear cart locally
      setCartOrders([]);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to proceed to payment. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
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
          <div className="bg-white border border-purple-200 rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="font-semibold text-purple-800 mb-4 text-lg">Approved Orders</h2>

            <div className="space-y-4">
              {cartOrders.map(item => (
                <div
                  key={item.cart_item_id}
                  className="p-4 border rounded flex justify-between items-center bg-purple-50"
                >
                  <div>
                    <p className="font-medium text-purple-800">{item.title || "Unknown Book"}</p>
                    <p className="text-gray-600 text-sm">
                      Price: KES {item.price || 0} | Quantity: {item.quantity || 1}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Approved
                  </span>
                </div>
              ))}
            </div>

            {/* Total & Payment */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <p className="text-lg font-bold text-purple-900">
                Total: KES {totalAmount}
              </p>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-medium"
              >
                💳 Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
