// src/pages/admin/ActivityLogs.jsx
import { useState } from "react";

const ActivityLogs = () => {
  // Sample activity data
  const [logs] = useState([
    { id: 1, user: "John Doe", action: "Borrowed", item: "Book A", date: "2025-09-20" },
    { id: 2, user: "Mary Smith", action: "Purchased", item: "Book D", date: "2025-09-21" },
    { id: 3, user: "Alex Johnson", action: "Borrowed", item: "Book B", date: "2025-09-21" },
    { id: 4, user: "Sarah Connor", action: "Purchased", item: "Book C", date: "2025-09-22" },
    { id: 5, user: "Jane Doe", action: "Borrowed", item: "Book E", date: "2025-09-22" },
  ]);

  // Sample pending requests
  const [pendingRequests, setPendingRequests] = useState([
    { id: 101, user: "Tom Hardy", request: "Borrow Book F", date: "2025-09-23" },
    { id: 102, user: "Emily Clark", request: "Purchase Book G", date: "2025-09-23" },
  ]);

  const [filterAction, setFilterAction] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  // Filtering logic
  const filteredLogs = logs.filter((log) => {
    const matchAction = filterAction === "All" || log.action === filterAction;
    const matchDate = !filterDate || log.date === filterDate;
    return matchAction && matchDate;
  });

  // Approve/Decline requests
  const handleRequestAction = (id, action) => {
    if (window.confirm(`Are you sure you want to ${action} this request?`)) {
      setPendingRequests(pendingRequests.filter((req) => req.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">📝 Activity Logs</h2>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Filter by Action */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="All">All Actions</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Purchased">Purchased</option>
          </select>

          {/* Filter by Date */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Pending Requests Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">⏳ Pending Requests</h3>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No pending requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border rounded-lg p-4 shadow-sm space-y-2"
              >
                <h3 className="font-semibold text-purple-800">{req.user}</h3>
                <p className="text-sm text-gray-600">{req.request}</p>
                <p className="text-xs text-gray-500">📅 {req.date}</p>

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

      {/* Logs Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📖 Logs</h3>
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">No activity logs match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white border rounded-lg p-4 shadow-sm space-y-2"
              >
                <h3 className="font-semibold text-purple-800">{log.user}</h3>
                <p className="text-sm text-gray-600">
                  {log.action} <span className="font-medium">{log.item}</span>
                </p>
                <p className="text-xs text-gray-500">📅 {log.date}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    log.action === "Borrowed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
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
