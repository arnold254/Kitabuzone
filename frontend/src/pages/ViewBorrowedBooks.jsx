import { useBorrowedBooks } from "../context/BorrowedBooksContext";
import { format } from "date-fns";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const ViewBorrowedBooks = () => {
  const { requests, setRequests } = useBorrowedBooks();

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await API.get("/pendingRequests");
        const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRequests(sorted);
      } catch (err) {
        console.error("Failed to fetch borrowed requests:", err);
      }
    };
    fetchRequests();
  }, [setRequests]);

  // Cancel a pending request
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      await API.patch(`/pendingRequests/${id}`, { status: "cancelled" });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
    } catch (err) {
      console.error("Failed to cancel request:", err);
      alert("Could not cancel request.");
    }
  };

  // Request a return
  const handleReturn = async (id) => {
    if (!window.confirm("Do you want to return this book? Wait for admin approval.")) return;
    try {
      await API.patch(`/pendingRequests/${id}`, { status: "return_pending" });
      alert("Return requested. Wait for admin approval.");
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "return_pending" } : r));
    } catch (err) {
      console.error(err);
      alert("Failed to request return.");
    }
  };

  // ------------------
  // Categorize requests
  // ------------------
  const pendingApproved = requests.filter(r => ["pending", "approved"].includes(r.status) && r.action === "borrow");
  const currentlyBorrowed = requests.filter(r => r.status === "borrowed" && r.action === "borrow");
  const returning = requests.filter(r => ["return_pending", "returned"].includes(r.status) && r.action === "borrow");

  const renderCard = (req, type) => (
    <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-purple-900 mb-1">{req.book?.title || "Unknown Book"}</h2>
        <p className="text-gray-600 text-sm mb-1">Author: {req.book?.author || "Unknown"}</p>
        <p className="text-gray-600 text-sm mb-1">Genre: {req.book?.genre || "Unknown"}</p>
        <p className="text-gray-600 text-sm mb-1">Price: ${req.book?.price || 0}</p>
        {req.duration && <p className="text-gray-600 text-sm mb-1">Duration: {req.duration} days</p>}
        <p className="text-gray-500 text-xs mb-1">
          Requested: {req.created_at ? format(new Date(req.created_at), "PPP p") : "-"}
        </p>
        <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${
          req.status === "pending" ? "bg-yellow-100 text-yellow-800" :
          req.status === "approved" ? "bg-green-100 text-green-700" :
          req.status === "borrowed" ? "bg-blue-100 text-blue-700" :
          req.status === "return_pending" ? "bg-orange-100 text-orange-700" :
          req.status === "returned" ? "bg-gray-200 text-gray-700" :
          req.status === "cancelled" ? "bg-red-100 text-red-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {req.status === "return_pending" ? "Return Pending" : req.status === "returned" ? "Return Approved" : req.status}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {type === "pendingApproved" && req.status === "pending" && (
          <button
            onClick={() => handleCancel(req.id)}
            className="flex-1 bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
        {type === "currentlyBorrowed" && req.status === "borrowed" && (
          <button
            onClick={() => handleReturn(req.id)}
            className="flex-1 bg-orange-600 text-white text-sm px-2 py-1 rounded hover:bg-orange-700"
          >
            Return
          </button>
        )}
        {type === "returning" && req.status === "return_pending" && (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs text-center">
            Return Pending
          </span>
        )}
        {type === "returning" && req.status === "returned" && (
          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs text-center">
            Return Approved
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 min-h-screen bg-milky-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-purple-900">📚 Borrowed Books</h1>
          <Link
            to="/library"
            className="text-purple-700 font-medium hover:underline text-sm"
          >
            ← Back to Library
          </Link>
        </div>
        <Link
          to="/borrowingCart"
          className="text-purple-700 font-medium hover:underline text-sm"
        >
          Go to Borrowing Cart →
        </Link>
      </div>

      {pendingApproved.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Pending / Approved</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pendingApproved.map(r => renderCard(r, "pendingApproved"))}
          </div>
        </div>
      )}

      {currentlyBorrowed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Currently Borrowed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentlyBorrowed.map(r => renderCard(r, "currentlyBorrowed"))}
          </div>
        </div>
      )}

      {returning.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Return Pending / Return Approved</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {returning.map(r => renderCard(r, "returning"))}
          </div>
        </div>
      )}

      {pendingApproved.length === 0 && currentlyBorrowed.length === 0 && returning.length === 0 && (
        <p className="text-gray-500">No borrowed books yet.</p>
      )}
    </div>
  );
};

export default ViewBorrowedBooks;
