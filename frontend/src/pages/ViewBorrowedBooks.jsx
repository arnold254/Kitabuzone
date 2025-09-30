// src/pages/ViewBorrowedBooks.jsx
import { useBorrowedBooks } from "../context/BorrowedBooksContext";
import { format } from "date-fns";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const ViewBorrowedBooks = () => {
  const { requests, setRequests } = useBorrowedBooks();

  // Fetch latest requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/pendingRequests"); // fetch user requests
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch borrowed requests:", err);
      }
    };
    fetchRequests();
  }, [setRequests]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
      try {
        await API.patch(`/pendingRequests/${id}`, { status: "cancelled" });
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
      } catch (err) {
        console.error("Failed to cancel request:", err);
        alert("Could not cancel request.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-milky-white">
      {/* Header with Nav Links */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-purple-900">📚 Borrowed Books</h1>
          <Link
            to="/library"
            className="text-purple-700 hover:underline text-sm"
          >
            ← Back to Library
          </Link>
        </div>
        <Link
          to="/borrowingCart"
          className="text-purple-700 hover:underline font-medium"
        >
          Go to Borrowing Cart →
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="text-gray-500">No borrowed books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-purple-900 mb-1">{req.book?.title || "Unknown Book"}</h2>
                <p className="text-gray-600 text-sm mb-1">Author: {req.book?.author || "Unknown"}</p>
                <p className="text-gray-600 text-sm mb-1">Genre: {req.book?.genre || "Unknown"}</p>
                <p className="text-gray-600 text-sm mb-1">Price: ${req.book?.price || 0}</p>
                <p className="text-gray-500 text-xs mb-1">
                  Requested: {req.created_at ? format(new Date(req.created_at), "PPP p") : "-"}
                </p>
                <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                  req.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  req.status === "approved" ? "bg-green-100 text-green-700" :
                  req.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {req.status}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                {req.status === "pending" && (
                  <button
                    onClick={() => handleCancel(req.id)}
                    className="flex-1 bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBorrowedBooks;
