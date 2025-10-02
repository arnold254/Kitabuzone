// src/pages/admin/ActivityLogs.jsx
import { useState, useEffect } from "react";
import API from "../../api";

const ActivityLogs = () => {
  const [allRequests, setAllRequests] = useState([]);
  const [latestUserPending, setLatestUserPending] = useState([]);
  const [latestUserReturnPending, setLatestUserReturnPending] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/pendingRequests");
      const data = res.data;
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setAllRequests(data);

      // Pending borrow/purchase
      const pendingReqs = data.filter((r) => r.status === "pending");
      if (pendingReqs.length) {
        const latestUser = pendingReqs[0].user;
        setLatestUserPending(pendingReqs.filter((r) => r.user === latestUser));
      }

      // Pending returns
      const returnPending = data.filter((r) => r.status === "return_pending");
      if (returnPending.length) {
        const latestReturnUser = returnPending[0].user;
        setLatestUserReturnPending(returnPending.filter((r) => r.user === latestReturnUser));
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const handleRequestActionAll = async (action, requestsArray) => {
  if (!requestsArray.length) return;

  const pendingReqs = requestsArray.filter((r) => r.status === "pending" || r.status === "return_pending");
  if (!pendingReqs.length) return;

  if (!window.confirm(`Are you sure you want to ${action} all requests from ${pendingReqs[0].user}?`)) return;

  try {
    await Promise.all(
      pendingReqs.map((r) => {
        // If the request is a return_pending, send "return_approved"
        const statusToSend = r.status === "return_pending" && action === "approved" 
          ? "return_approved" 
          : action;
        return API.patch(`/pendingRequests/${r.id}`, { status: statusToSend });
      })
    );

    setAllRequests((prev) =>
      prev.map((r) =>
        pendingReqs.find((p) => p.id === r.id)
          ? { ...r, status: r.status === "return_pending" && action === "approved" ? "returned" : action }
          : r
      )
    );

    if (requestsArray === latestUserPending) {
      setLatestUserPending([]);
    } else {
      setLatestUserReturnPending([]);
    }
  } catch (err) {
    console.error(err);
  }
};


  const handleReturn = async (reqId) => {
    if (!window.confirm("Do you want to return this book? It will wait for admin approval.")) return;
    try {
      await API.patch(`/pendingRequests/${reqId}`, { status: "return_pending" });
      alert("Return requested. Wait for admin approval.");
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const combineCopies = (requests) => {
    const combined = {};
    requests.forEach((r) => {
      const key = `${r.book?.title || "Unknown Book"}|${r.book?.author || "Unknown"}`;
      if (!combined[key]) combined[key] = { ...r, copies: 1 };
      else combined[key].copies += 1;
    });
    return Object.values(combined);
  };

  const renderPendingCard = (requests, title, showPrice = false, showReturnButton = false) => {
    if (!requests.length) return null;
    const combinedRequests = combineCopies(requests);
    const user = requests[0].user;
    const hasPending = requests.some((r) => r.status === "pending" || r.status === "return_pending");

    return (
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-900">{title} - {user}</h2>
          {hasPending && (
            <div className="flex gap-2">
              <button
                onClick={() => handleRequestActionAll("approved", requests)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                Approve All
              </button>
              <button
                onClick={() => handleRequestActionAll("declined", requests)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Decline All
              </button>
            </div>
          )}
        </div>

        <table className="w-full table-auto text-left">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Author</th>
              {showPrice && <th className="px-4 py-2">Price</th>}
              <th className="px-4 py-2">Copies</th>
              <th className="px-4 py-2">Status</th>
              {showReturnButton && <th className="px-4 py-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {combinedRequests.map((req, idx) => (
              <tr key={`${req.book?.title}-${req.book?.author}`} className={`${idx % 2 === 0 ? "bg-purple-50" : "bg-white"} border-t`}>
                <td className="px-4 py-2">{req.book?.title || "Unknown Book"}</td>
                <td className="px-4 py-2">{req.book?.author || "Unknown"}</td>
                {showPrice && <td className="px-4 py-2">KES {req.book?.price || 0}</td>}
                <td className="px-4 py-2">{req.copies}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    req.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    req.status === "approved" ? "bg-green-100 text-green-700" :
                    req.status === "return_pending" ? "bg-orange-100 text-orange-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {req.status}
                  </span>
                </td>
                {showReturnButton && (
                  <td className="px-4 py-2">
                    {req.status === "approved" && req.action === "borrow" && (
                      <button
                        onClick={() => handleReturn(req.id)}
                        className="bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 text-xs"
                      >
                        Return
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderApprovedLogs = () => {
    const approvedRequests = allRequests.filter((r) => r.status === "approved" || r.status === "returned");

    if (!approvedRequests.length) return null;

    const groupedByUser = approvedRequests.reduce((acc, req) => {
      if (!acc[req.user]) acc[req.user] = [];
      acc[req.user].push(req);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-purple-900">📄 Approved / Returned Requests Log</h2>
        {Object.entries(groupedByUser).map(([user, requests]) => {
          const combinedRequests = combineCopies(requests);
          return (
            <div key={user} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold text-purple-800 mb-2">{user}</h3>
              <table className="w-full table-auto text-left">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="px-4 py-2">Book</th>
                    <th className="px-4 py-2">Author</th>
                    <th className="px-4 py-2">Copies</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedRequests.map((req, idx) => (
                    <tr key={`${req.book?.title}-${req.book?.author}`} className={`${idx % 2 === 0 ? "bg-purple-50" : "bg-white"} border-t`}>
                      <td className="px-4 py-2">{req.book?.title || "Unknown Book"}</td>
                      <td className="px-4 py-2">{req.book?.author || "Unknown"}</td>
                      <td className="px-4 py-2">{req.copies}</td>
                      <td className="px-4 py-2">{req.status === "returned" ? "Returned" : "Approved"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  };

  const purchasePending = latestUserPending.filter((r) => r.action === "purchase");
  const borrowPending = latestUserPending.filter((r) => r.action === "borrow");
  const returnPending = latestUserReturnPending;

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {renderPendingCard(purchasePending, "🛒 Purchase Requests", true)}
      {renderPendingCard(borrowPending, "📚 Borrow Requests", false, true)}
      {renderPendingCard(returnPending, "↩️ Return Requests")}
      {renderApprovedLogs()}
    </div>
  );
};

export default ActivityLogs;
