// src/pages/admin/ActivityLogs.jsx
import { useState, useEffect } from "react";
import API from "../../api";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [actions, setActions] = useState([]);
  const [filterAction, setFilterAction] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  // Fetch logs, pending requests, and possible actions
  useEffect(() => {
    API.get("/logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));

    API.get("/pendingRequests")
      .then(res => setPendingRequests(res.data))
      .catch(err => console.error(err));

    API.get("/logActions")
      .then(res => setActions(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchAction = filterAction === "All" || log.action === filterAction;
    const matchDate = !filterDate || log.date.startsWith(filterDate);
    return matchAction && matchDate;
  });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  // ---------------------------
  // Handle Approve / Decline
  // ---------------------------
  const handleRequestAction = async (reqId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

    try {
      // 1️⃣ PATCH the pending request
      await API.patch(`/pendingRequests/${reqId}`, { status: action });

      // 2️⃣ Remove locally
      setPendingRequests(pendingRequests.filter(req => req.id !== reqId));

      // 3️⃣ Trigger ShoppingCart refresh if approved
      if (action.toLowerCase() === "approve") {
        window.dispatchEvent(new Event("new-approval"));
      }

      console.log(`Request ${action} successfully.`);
    } catch (err) {
      console.error("Failed to update request:", err);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* Header & Filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">📝 Activity Logs</h2>
        <div className="flex items-center gap-3">
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All Actions</option>
            {actions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Pending Requests */}
      <div>
        <h3 className="text-lg font-semibold mb-4">⏳ Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
                <h3 className="font-semibold text-purple-800">{req.user}</h3>
                <p className="text-gray-600 text-sm">
                  📚 Book: <span className="font-medium">{req.book?.title || "Unknown Book"}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Author: <span className="font-medium">{req.book?.author || "Unknown"}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Price: <span className="font-medium">${req.book?.price || 0}</span>
                </p>
                <p className="text-gray-500 text-xs">📅 Requested: {formatDate(req.created_at)}</p>
                <p className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                  req.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                  req.status === "approved" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>{req.status}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRequestAction(req.id, "approve")}
                    className="flex-1 bg-green-600 text-white text-sm px-2 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequestAction(req.id, "decline")}
                    className="flex-1 bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Logs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📖 Logs</h3>
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">No activity logs match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLogs.map(log => (
              <div key={log.id} className="bg-white border rounded-lg p-4 shadow-sm space-y-2">
                <h3 className="font-semibold text-purple-800">{log.user} ({log.role})</h3>
                <p className="text-gray-600 text-sm">
                  📚 Book: <span className="font-medium">{log.item || "Unknown Book"}</span>
                </p>
                <p className="text-gray-600 text-sm">📝 Action: <span className="font-medium">{log.action}</span></p>
                <p className="text-gray-500 text-xs">📅 Date: {formatDate(log.date)}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                  log.action === "Borrowed" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {log.action}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
