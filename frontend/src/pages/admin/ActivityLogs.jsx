import { useAdmin } from "../../context/AdminContext";
import { useState } from "react";

const ActivityLogs = () => {
  const { activityLogs, orders, books, approveOrder, declineOrder } = useAdmin();
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredLogs = dateFilter
    ? activityLogs.filter((log) => new Date(log.timestamp).toLocaleDateString() === new Date(dateFilter).toLocaleDateString())
    : activityLogs;

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  const pendingOrders = orders.filter((o) => o.status === "Pending");

  console.log("ActivityLogs: Rendering pending orders:", pendingOrders);
  console.log("ActivityLogs: Button styles - Approve: bg-purple-500, Decline: bg-red-500");

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📝 Activity Logs</h2>

      {/* Pending Orders */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Pending Orders</h3>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Book</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2 w-64">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-600">
                  No pending orders.
                </td>
              </tr>
            ) : (
              pendingOrders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.user}</td>
                  <td className="p-2">{books.find((b) => b.id === o.bookId)?.title || "Unknown"}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{new Date(o.date).toLocaleDateString()}</td>
                  <td className="p-2">
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button
                        onClick={() => approveOrder(o.id)}
                        text="Approve"
                        color="purple-500"
                        debugStyles={{ visibility: "visible", opacity: 1, zIndex: 10 }}
                      />
                      <Button
                        onClick={() => declineOrder(o.id)}
                        text="Decline"
                        color="red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Recent Actions</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="p-2 border rounded-lg text-sm"
              placeholder="Filter by date"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border rounded-lg text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
        <ul className="text-sm text-gray-600">
          {sortedLogs.length === 0 ? (
            <li className="py-2 text-center">No logs found for selected date.</li>
          ) : (
            sortedLogs.map((log) => (
              <li key={log.id} className="py-2 border-t">
                {log.action} - {new Date(log.timestamp).toLocaleString()}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const Button = ({ onClick, text, color, debugStyles = {} }) => {
  console.log(`Button: Rendering ${text} with color ${color}, styles:`, debugStyles);
  return (
    <button
      onClick={onClick}
      className={`bg-${color} text-white px-4 py-1.5 rounded-lg hover:bg-${color.replace(/\d+$/, (n) => parseInt(n) + 100)} text-sm font-medium min-w-[80px] relative z-10`}
      style={debugStyles}
    >
      {text}
    </button>
  );
};

export default ActivityLogs;