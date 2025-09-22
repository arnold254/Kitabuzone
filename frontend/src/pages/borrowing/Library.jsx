import { useBorrow } from "../../context/BorrowContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const Library = () => {
  const { addToCart } = useBorrow();
  const { user, logout } = useAuth();
  const { books } = useAdmin();
  const navigate = useNavigate();

  const [libraryBooks, setLibraryBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [format, setFormat] = useState("");
  const [language, setLanguage] = useState("");
  const [date, setDate] = useState("");
  const [toast, setToast] = useState(""); // New: toast notification

  useEffect(() => {
    if (books) {
      let filtered = books.filter((book) => book.type === "library");

      if (searchTerm) {
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (genre) filtered = filtered.filter((book) => book.genre === genre);
      if (format) filtered = filtered.filter((book) => book.format === format);
      if (language) filtered = filtered.filter((book) => book.language === language);
      if (date)
        filtered = filtered.sort((a, b) =>
          date === "Newest" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
        );

      setLibraryBooks(filtered);
      setIsLoading(false);
    }
  }, [books, searchTerm, genre, format, language, date]);

  const handleBorrow = (book) => {
    if (!user) {
      alert("⚠️ Please log in to borrow a book.");
      navigate("/auth/login");
      return;
    }
    addToCart(book);

    // Show toast notification
    setToast(`✅ "${book.title}" added to cart!`);
    setTimeout(() => setToast(""), 3000); // hide after 3 seconds
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  if (isLoading) {
    return <div className="bg-gray-50 p-6 text-purple-900 text-center text-sm">Loading books...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-purple-900">📚 Library</h2>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/borrowing/cart" className="text-purple-700 hover:underline text-sm">Cart</Link>
              <Link to="/borrowing/view" className="text-purple-700 hover:underline text-sm">View Borrowed</Link>
              <button onClick={handleLogout} className="text-purple-700 hover:underline text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="text-purple-700 hover:underline text-sm">Login</Link>
              <Link to="/auth/signup" className="text-purple-700 hover:underline text-sm">Signup</Link>
            </>
          )}
        </div>
      </div>

      {/* Filters + Search */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        </div>

        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="">All Dates</option>
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="">Format</option>
          <option value="Hardcover">Hardcover</option>
          <option value="Paperback">Paperback</option>
          <option value="eBook">eBook</option>
          <option value="Audio">Audio</option>
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {libraryBooks.length === 0 ? (
          <p className="text-purple-900 text-sm col-span-full text-center">No books found.</p>
        ) : (
          libraryBooks.map((book) => (
            <div key={book.id} className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow">
              <Link to={`/borrowing/bookDetails/${book.id}`}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="text-sm text-gray-600">{book.author}</p>
              </Link>
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
        <Link to="/" className="text-purple-700 hover:underline text-sm font-medium">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Library;
