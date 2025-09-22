import { useAdmin } from "../../context/AdminContext";
import PropTypes from "prop-types";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const { books, orders } = useAdmin();
  const isLoading = !books || !orders;

  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];
  const authors = [...new Set(books.map((b) => b.author).filter(Boolean))];

  const borrowingData = books.reduce((acc, b) => {
    if (b.availability === "Checked Out") {
      try {
        const date = new Date(b.date);
        if (!isNaN(date) && date.getFullYear().toString() === yearFilter) {
          const m = date.toLocaleString("default", { month: "short" });
          acc[m] = (acc[m] || 0) + 1;
        }
      } catch (e) {
        console.warn(`Invalid date for book ${b.title}: ${b.date}`);
      }
    }
    return acc;
  }, {});

  const salesData = orders.reduce((acc, o) => {
    if (o.status === "Approved") {
      try {
        const date = new Date(o.date);
        if (!isNaN(date) && date.getFullYear().toString() === yearFilter) {
          const m = date.toLocaleString("default", { month: "short" });
          const price = parseFloat(books.find((b) => b.id === o.bookId)?.price?.replace("$", "") || 0);
          acc[m] = (acc[m] || 0) + price;
        }
      } catch (e) {
        console.warn(`Invalid date for order ${o.id}: ${o.date}`);
      }
    }
    return acc;
  }, {});

  const genreData = genres.reduce((acc, genre) => {
    acc[genre] = books.filter((b) => b.genre === genre).length;
    return acc;
  }, {});

  const authorData = authors.reduce((acc, author) => {
    acc[author] = books.filter((b) => b.author === author).length;
    return acc;
  }, {});

  const borrowingChart = {
    labels: months,
    datasets: [
      {
        label: "Borrowings",
        data: months.map((m) => borrowingData[m] || 0),
        borderColor: "#6b21a8",
        backgroundColor: "rgba(107,33,168,0.2)",
        fill: true,
      },
    ],
  };

  const salesChart = {
    labels: months,
    datasets: [
      {
        label: "Revenue (KES)",
        data: months.map((m) => salesData[m] || 0),
        backgroundColor: "#6b21a8",
      },
    ],
  };

  const genreChart = {
    labels: genres,
    datasets: [
      {
        label: "Books by Genre",
        data: genres.map((g) => genreData[g] || 0),
        backgroundColor: ["#6b21a8", "#a855f7", "#d8b4fe", "#f3e8ff"],
      },
    ],
  };

  const authorChart = {
    labels: authors,
    datasets: [
      {
        label: "Books by Author",
        data: authors.map((a) => authorData[a] || 0),
        backgroundColor: ["#6b21a8", "#a855f7", "#d8b4fe"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  const news = [
    { id: 1, title: "New Book: 'The Power of Now' by Eckhart Tolle", date: "2025-10-15", description: "A spiritual guide to living in the present moment, coming soon!" },
    { id: 2, title: "Author Spotlight: James Clear", date: "2025-09-25", description: "James Clear’s new book on productivity is generating buzz!" },
  ];

  if (isLoading) return <div className="bg-gray-50 p-6 text-purple-900 text-center">Loading...</div>;

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">Dashboard</h2>

      {/* Year Filter */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mr-2">Filter by Year:</label>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="p-2 border rounded-lg text-sm"
        >
          {[...new Set(books.map((b) => new Date(b.date).getFullYear()))].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total Books" value={books.length} />
        <Card title="Active Borrowings" value={books.filter((b) => b.availability === "Checked Out").length} />
        <Card title="Total Genres" value={genres.length} />
        <Card title="Total Authors" value={authors.length} />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Borrowing Trends">
          <Line data={borrowingChart} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Sales Trends">
          <Bar data={salesChart} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Books by Genre">
          <Bar data={genreChart} options={chartOptions} />
        </ChartCard>
        <ChartCard title="Books by Author">
          <Bar data={authorChart} options={chartOptions} />
        </ChartCard>
      </div>

      {/* News */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Market News</h3>
        <ul className="text-sm text-gray-600">
          {news.map((item) => (
            <li key={item.id} className="py-2 border-t">
              <strong>{item.title}</strong> - {item.description} (Expected: {new Date(item.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-purple-700">{value}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-purple-900 mb-4">{title}</h3>
    {children}
  </div>
);

Dashboard.propTypes = {
  books: PropTypes.array,
  orders: PropTypes.array,
};

export default Dashboard;