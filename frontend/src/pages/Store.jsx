import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import Footer from "../components/Footer";

const Store = () => {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Failed fetching books:", err));
  }, []);

  // Filter only store books
  const storeBooks = books.filter((book) => book.location === "Store");

  // Unique genres for the filter
  const genreOptions = Array.from(
    new Set(storeBooks.map((book) => book.category).filter(Boolean))
  );

  // Combined genre & price filter
  const filteredBooks = storeBooks.filter((book) => {
    const matchesGenre = !genreFilter || book.category === genreFilter;

    const matchesPrice =
      !priceFilter ||
      (priceFilter === "low" && book.price <= 500) ||
      (priceFilter === "mid" && book.price > 500 && book.price <= 1000) ||
      (priceFilter === "high" && book.price > 1000);

    return matchesGenre && matchesPrice;
  });

  const handlePurchase = async (book) => {
    if (!isLoggedIn) {
      alert("Please login to purchase books!");
      navigate("/auth/login", { state: { from: "/" } });
      return;
    }

    try {
      await API.post("/pendingRequests", {
        user_id: user.id,
        book_id: book.id,
        action: "purchase",
      });
      alert("Purchase request submitted! Waiting admin approval.");
    } catch (err) {
      console.error("Failed to submit request:", err);
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-milky-white">
        {/* Sidebar */}
        <aside className="w-48 bg-purple-50 p-4 text-purple-900 flex flex-col justify-between">
          <div>
            <h2 className="font-bold mb-4">Filters</h2>

            {/* Genre Filter */}
            <select
              className="p-2 rounded border border-purple-300 w-full mb-4"
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              className="p-2 rounded border border-purple-300 w-full"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Below KES 500</option>
              <option value="mid">KES 500–1000</option>
              <option value="high">Above KES 1000</option>
            </select>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="mt-4 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              Logout
            </button>
          )}
        </aside>

        {/* Books Grid */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-purple-900 mb-6">🛒 Store</h1>

          {filteredBooks.length === 0 ? (
            <p className="text-gray-600">No books found in the Store.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
                  onClick={() => navigate(`/purchases/${book.id}`)}
                >
                  {/* Book Cover */}
                  <div className="w-full h-48 mb-2 overflow-hidden rounded">
                    <img
                      src={
                        book.cover && book.cover.trim() !== ""
                          ? book.cover
                          : `https://via.placeholder.com/150?text=${encodeURIComponent(
                              book.title
                            )}`
                      }
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title, Author & Price */}
                  <div>
                    <h3 className="font-bold text-purple-900 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{book.author}</p>
                    <p className="text-purple-900 font-semibold text-sm">
                      {book.price ? `KES ${book.price}` : "Price N/A"}
                    </p>
                  </div>

                  {/* Purchase Button */}
                  <button
                    className="mt-2 w-full bg-purple-500 text-white py-1 rounded hover:bg-purple-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(book);
                    }}
                  >
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Store;
