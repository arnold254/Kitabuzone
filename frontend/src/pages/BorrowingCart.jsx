import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function BorrowingCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Fetch approved borrow requests for the current user
  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get("/pendingRequests");

      // Include both 'approve' and 'approved' statuses
      const approvedBorrow = res.data.filter(
        item =>
          item.action.toLowerCase() === "borrow" &&
          ["approve", "approved"].includes(item.status.toLowerCase())
      );

      const sorted = approvedBorrow.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setCart(sorted);
    } catch (err) {
      console.error("Failed to fetch borrowing cart:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();

    const handleNewApproval = () => fetchCart();
    window.addEventListener("new-approval", handleNewApproval);
    return () => window.removeEventListener("new-approval", handleNewApproval);
  }, [fetchCart]);

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert("Borrowed successfully!");
  };

  return (
    <div className="min-h-screen bg-milky-white py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-900">📚 Borrowing Cart</h2>
          <Link
            to="/viewBorrowedBooks"
            className="text-purple-700 hover:underline font-medium"
          >
            ← Back to Borrowed Books
          </Link>
        </div>

        {cart.length === 0 ? (
          <p className="text-gray-600">No approved books in your cart.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cart.map(item => (
              <div
                key={item.id}
                className="bg-purple-50 shadow-lg rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition cursor-pointer"
              >
                <div className="flex-1">
                  {/* Book Cover */}
                  <img
                    src={
                      item.book?.cover
                        ? `http://127.0.0.1:5000${item.book.cover}`
                        : `https://via.placeholder.com/150?text=${(item.book?.title || "Book").replace(/ /g, '+')}`
                    }
                    alt={item.book?.title || "Book cover"}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-bold text-purple-900 text-lg">{item.book?.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{item.book?.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="px-3">{item.quantity || 1}</span>
                    <button
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="mt-3 bg-red-600 text-white py-1 rounded hover:bg-red-700 transition"
                  onClick={() => removeItem(item.id)}
                >
                  🗙 Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              cart.length
                ? 'bg-purple-900 text-white hover:bg-purple-800'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!cart.length}
            onClick={handleCheckout}
          >
            Confirm Borrow
          </button>
        </div>
      </div>
    </div>
  );
}
