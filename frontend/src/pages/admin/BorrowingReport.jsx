import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "../../components/ui/Card";

const borrowingData = [
  { month: "Jan", borrowings: 20 },
  { month: "Feb", borrowings: 35 },
  { month: "Mar", borrowings: 50 },
  { month: "Apr", borrowings: 30 },
  { month: "May", borrowings: 60 },
  { month: "Jun", borrowings: 45 },
  { month: "Jul", borrowings: 40 },
  { month: "Aug", borrowings: 55 },
  { month: "Sep", borrowings: 35 },
  { month: "Oct", borrowings: 65 },
  { month: "Nov", borrowings: 50 },
  { month: "Dec", borrowings: 70 },
];

const BorrowingReport = () => {
  const [selectedMonth, setSelectedMonth] = useState("All");

  const filteredData =
    selectedMonth === "All"
      ? borrowingData
      : borrowingData.filter((item) => item.month === selectedMonth);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">📊 Borrowing Report</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border rounded-lg text-purple-700 bg-purple-50 border-purple-200 focus:outline-none"
        >
          <option value="All">All Months</option>
          {borrowingData.map((item) => (
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
                <Line type="monotone" dataKey="borrowings" stroke="#7e3af2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">📈 Peak Borrowing</h3>
          <p className="text-gray-600">Most borrowings occurred in October with 65 borrowings.</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">📉 Lowest Borrowing</h3>
          <p className="text-gray-600">April recorded the lowest borrowings with only 30.</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">📊 Overall Trend</h3>
          <p className="text-gray-600">Borrowing activity shows steady growth towards the year end.</p>
        </Card>
      </div>
    </div>
  );
};

export default BorrowingReport;
