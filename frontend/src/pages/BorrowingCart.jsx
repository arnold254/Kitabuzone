// src/pages/BorrowingCart.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function BorrowingCart() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  // Fetch approved borrow requests for the current user
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/pendingRequests");
        const userRequests = res.data.filter(
          (r) => r.user_id === user.id && r.status === "approved" && r.action === "borrow"
        );
        setRequests(userRequests);
      } catch (err) {
        console.error("Failed to fetch approved borrow requests:", err);
      }
    };
    fetchRequests();
  }, [user.id]);

  const handleConfirmBorrow = async (id) => {
    try {
      const res = await API.patch(`/pendingRequests/confirm/${id}`);
      alert(res.data.message);
      // Update state locally
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "borrowed" } : r))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to confirm borrow");
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-milky-white">
      <h1 className="text-2xl font-bold text-purple-900 mb-4">📚 Borrowing Cart</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No borrow requests to confirm.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-purple-900 mb-1">{req.book?.title || "Unknown Book"}</h2>
                <p className="text-gray-600 text-sm mb-1">Author: {req.book?.author || "Unknown"}</p>
                <p className="text-gray-600 text-sm mb-1">Genre: {req.book?.genre || "Unknown"}</p>
                <p className="text-gray-600 text-sm mb-1">Price: ${req.book?.price || 0}</p>
                <span className="inline-block px-2 py-1 text-xs rounded font-medium bg-green-100 text-green-700">
                  {req.status}
                </span>
              </div>

              <div className="mt-3">
                {req.status === "approved" && (
                  <button
                    onClick={() => handleConfirmBorrow(req.id)}
                    className="w-full bg-blue-600 text-white text-sm px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Confirm Borrow
                  </button>
                )}
                {req.status === "borrowed" && (
                  <span className="w-full inline-block text-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    Borrowed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
