import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "../../components/ui/Card";

const salesData = [
  { month: "Jan", sales: 15 },
  { month: "Feb", sales: 25 },
  { month: "Mar", sales: 40 },
  { month: "Apr", sales: 20 },
  { month: "May", sales: 55 },
  { month: "Jun", sales: 35 },
  { month: "Jul", sales: 45 },
  { month: "Aug", sales: 50 },
  { month: "Sep", sales: 30 },
  { month: "Oct", sales: 60 },
  { month: "Nov", sales: 40 },
  { month: "Dec", sales: 75 },
];

const SalesReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filteredData =
    selectedMonth === "All"
      ? salesData
      : salesData.filter((item) => item.month === selectedMonth);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">💰 Sales Report</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-lg text-purple-700 bg-purple-50 border-purple-200 focus:outline-none"
        >
          <option value="All">All Months</option>
          {salesData.map((item) => (
            <option key={item.month} value={item.month}>
              {item.month}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <Card>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#9333ea" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">🔥 Peak Sales</h3>
          <p className="text-gray-600">Highest sales were in December with 75 sales.</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">📉 Lowest Sales</h3>
          <p className="text-gray-600">April had the lowest sales, only 20.</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">📊 Overall Trend</h3>
          <p className="text-gray-600">Sales steadily grew throughout the year, peaking in December.</p>
        </Card>
      </div>
    </div>
  );
};

export default SalesReport;
