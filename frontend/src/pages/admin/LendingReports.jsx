import { useAdmin } from "../../context/AdminContext";
import PropTypes from "prop-types";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const LendingReports = () => {
  const { books } = useAdmin();
  const isLoading = !books;
  const [view, setView] = useState("all"); // "all", "active", "available"

  const activeBorrowings = books.filter((b) => b.availability === "Checked Out").length;
  const availableBooks = books.filter((b) => b.availability === "Available").length;

  const borrowingData = books.reduce((acc, book) => {
    if (book.availability === "Checked Out") {
      try {
        const date = new Date(book.date);
        if (!isNaN(date)) {
          const month = date.toLocaleString("default", { month: "short" });
          acc[month] = (acc[month] || 0) + 1;
        }
      } catch (e) {
        console.warn(`Invalid date for book ${book.title}: ${book.date}`);
      }
    }
    return acc;
  }, {});

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Borrowings",
        data: months.map((month) => borrowingData[month] || 0),
        borderColor: "#6b21a8",
        backgroundColor: "rgba(107, 33, 168, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const filteredBooks = view === "all" ? books : books.filter((b) => b.availability === (view === "active" ? "Checked Out" : "Available"));

  if (isLoading) {
    return <div className="bg-gray-50 p-6 text-purple-900 text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📖 Lending Reports</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card
          title="Active Borrowings"
          value={activeBorrowings}
          onClick={() => setView(view === "active" ? "all" : "active")}
          active={view === "active"}
        />
        <Card
          title="Available Books"
          value={availableBooks}
          onClick={() => setView(view === "available" ? "all" : "available")}
          active={view === "available"}
        />
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          {view === "active" ? "Active Borrowings" : view === "available" ? "Available Books" : "Borrowing Details"}
        </h3>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Book ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Availability</th>
              <th className="p-2">Publication Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-2 text-center text-gray-600">
                  No books found.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.id}</td>
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.availability}</td>
                  <td className="p-2">{new Date(book.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Borrowing Trends</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const Card = ({ title, value, onClick, active }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-lg cursor-pointer ${active ? "border-2 border-purple-700" : ""}`}
    onClick={onClick}
  >
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-purple-700">{value}</p>
  </div>
);

LendingReports.propTypes = {
  books: PropTypes.array,
};

export default LendingReports;