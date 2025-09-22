import { useBorrow } from "../../context/BorrowContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FilterDropdown from "../../components/FilterDropdown";

const mockBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", availability: "Available", language: "English", date: "1988" },
  { id: 2, title: "Atomic Habits", author: "James Clear", genre: "Non-Fiction", availability: "Checked Out", language: "English", date: "2018" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", availability: "Available", language: "Spanish", date: "2011" },
];

const Library = () => {
  const { addToCart } = useBorrow();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [books, setBooks] = useState(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [availability, setAvailability] = useState("");
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    let filtered = mockBooks;
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (genre) filtered = filtered.filter((book) => book.genre === genre);
    if (availability) filtered = filtered.filter((book) => book.availability === availability);
    if (language) filtered = filtered.filter((book) => book.language === language);
    if (date) filtered = filtered.sort((a, b) => (date === "Newest" ? b.date - a.date : a.date - b.date));
    setBooks(filtered);
  }, [searchTerm, genre, availability, language, date]);

  const handleBorrow = (book) => {
    if (!user) {
      alert("⚠️ Please log in to borrow a book.");
      navigate("/auth/login", { state: { from: location } });
      return;
    }
    addToCart(book);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Custom Header */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 pl-10"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
          </div>
          <div className="flex gap-2">
            <FilterDropdown
              label="Genre"
              value={genre}
              options={["Fiction", "Non-Fiction"]}
              onChange={setGenre}
            />
            <FilterDropdown
              label="Availability"
              value={availability}
              options={["Available", "Checked Out"]}
              onChange={setAvailability}
            />
            <FilterDropdown
              label="Language"
              value={language}
              options={["English", "Spanish"]}
              onChange={setLanguage}
            />
            <FilterDropdown
              label="Date"
              value={date}
              options={["Newest", "Oldest"]}
              onChange={setDate}
            />
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                <Link to="/borrowing/cart" className="text-purple-700 hover:underline text-sm">
                  Cart
                </Link>
                <Link to="/borrowing/view" className="text-purple-700 hover:underline text-sm">
                  View Borrowed
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-purple-700 hover:underline text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-purple-700 hover:underline text-sm">
                  Login
                </Link>
                <Link to="/auth/signup" className="text-purple-700 hover:underline text-sm">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Book List */}
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📚 Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-full mx-auto">
        {books.length === 0 ? (
          <p className="text-purple-900 text-sm col-span-full text-center">No books found.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-base font-semibold text-purple-900">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <button
                onClick={() => handleBorrow(book)}
                className="mt-2 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
              >
                Borrow
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-8 text-center">
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Library;