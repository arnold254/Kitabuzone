import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const mockLibraryBooks = [
  { id: 101, title: "Clean Code", author: "Robert C. Martin", genre: "Programming", language: "English", cover: "https://via.placeholder.com/150x200.png?text=Clean+Code" },
  { id: 102, title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "Programming", language: "English", cover: "https://via.placeholder.com/150x200.png?text=Pragmatic+Programmer" },
  { id: 103, title: "Introduction to Algorithms", author: "Thomas H. Cormen", genre: "Computer Science", language: "English", cover: "https://via.placeholder.com/150x200.png?text=Algorithms" },
];

const Library = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/library/books")
      .then(res => {
        if (!res.ok) throw new Error("Backend not running, using mock data");
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(() => setBooks(mockLibraryBooks));
  }, []);

  const filteredBooks = books.filter(book =>
    (!searchTerm || book.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!genreFilter || book.genre === genreFilter) &&
    (!languageFilter || book.language === languageFilter)
  );

  const handleBorrow = (book) => {
    if (!isLoggedIn) {
      alert("Please sign in to borrow books!");
      navigate("/auth/login", { state: { from: "/library" } });
      return;
    }
    // ✅ Redirect to borrowing cart
    navigate("/borrowingCart");
  };

  return (
    <div className="min-h-screen flex bg-milky-white">
      {/* Sidebar */}
      <aside className="w-48 bg-purple-50 p-4 text-purple-900">
        <h2 className="font-bold mb-4">Filters</h2>
        <div className="flex flex-col gap-3">
          <select
            className="p-2 rounded border border-purple-300"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <select
            className="p-2 rounded border border-purple-300"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Programming">Programming</option>
            <option value="Computer Science">Computer Science</option>
          </select>
          <select
            className="p-2 rounded border border-purple-300"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/" className="text-purple-900 font-bold hover:underline">&lt;-- Home</Link>
          <div className="flex-1 mx-6 relative">
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {!isLoggedIn && (
            <div className="flex-shrink-0 flex gap-4">
              <Link to="/auth/login" className="hover:underline text-purple-900">Login</Link>
              <Link to="/auth/signup" className="hover:underline text-purple-900">Signup</Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="flex-shrink-0 flex gap-4">
              <Link to="/borrowingCart" className="text-purple-900 hover:underline">Borrowing Cart</Link>
              <Link to="/viewBorrowedBooks" className="text-purple-900 hover:underline">View Borrowed</Link>
            </div>
          )}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <p className="text-purple-900">No books found.</p>
          ) : (
            filteredBooks.map(book => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/bookDetails/${book.id}`)}
              >
                <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded mb-2" />
                <h3 className="font-bold text-purple-900">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <button
                  className="mt-2 w-full bg-purple-500 text-white py-1 rounded hover:bg-purple-600"
                  onClick={(e) => { e.stopPropagation(); handleBorrow(book); }}
                >
                  Borrow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
