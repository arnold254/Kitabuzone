// src/pages/admin/SalesReport.jsx
import { useState, useEffect } from "react";
import API from "../../api";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filterBook, setFilterBook] = useState("");

  useEffect(() => {
    API.get("/salesReports")
      .then(res => setSales(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredSales = sales.filter(sale =>
    sale.book.toLowerCase().includes(filterBook.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">💰 Sales Report</h2>
        <input
          type="text"
          placeholder="Filter by book..."
          value={filterBook}
          onChange={e => setFilterBook(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />
      </div>

      {filteredSales.length === 0 ? (
        <p className="text-gray-500">No sales records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Book</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Quantity</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Price</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-purple-900">Sold At</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{sale.book}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{sale.quantity}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{sale.price}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{sale.soldAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
