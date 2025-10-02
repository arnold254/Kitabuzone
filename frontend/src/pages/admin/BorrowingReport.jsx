// src/pages/admin/BorrowingReport.jsx
import { useState, useEffect } from "react";
import API from "../../api";

const BorrowingReport = () => {
  const [reports, setReports] = useState([]);
  const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    API.get("/borrowingReports")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredReports = reports.filter(report =>
    report.user.toLowerCase().includes(filterUser.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">📚 Borrowing Report</h2>
        <input
          type="text"
          placeholder="Filter by user..."
          value={filterUser}
          onChange={e => setFilterUser(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />
      </div>

      {filteredReports.length === 0 ? (
        <p className="text-gray-500">No borrowing records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Book</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Borrowed At</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{report.user}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{report.book}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{report.status}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{report.borrowedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowingReport;
