import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import Footer from "../components/Footer";
import bannerImage from "../assets/banner.jpeg";

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

  const storeBooks = books.filter((book) => book.location === "Store");

  const genreOptions = Array.from(
    new Set(storeBooks.map((book) => book.category).filter(Boolean))
  );

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
      <div className="min-h-screen flex bg-white">
        {/* Sidebar */}
        <aside className="w-48 bg-white p-4 text-black border-r border-gray-200 flex flex-col justify-between">
          <div>
            <h2 className="font-bold mb-4">Filters</h2>
            <select
              className="p-2 rounded border border-gray-300 w-full mb-4"
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
            <select
              className="p-2 rounded border border-gray-300 w-full"
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
              className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/*Banner inside main content */}
          <div className="w-full mb-6">
            <img
              src={bannerImage}
              alt="KICD Approved 2024 Edition Banner"
              className="w-full h-auto object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold text-black mb-6">🛒 Store</h1>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <p className="text-gray-600">No books found in the Store.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between border border-gray-200"
                  onClick={() => navigate(`/purchases/${book.id}`)}
                >
                  <img
                    src={
                      book.cover?.startsWith("http")
                        ? book.cover
                        : `https://via.placeholder.com/150?text=${book.title.replace(
                            " ",
                            "+"
                          )}`
                    }
                    alt={book.title}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <div>
                    <h3 className="font-bold text-black mb-1">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">{book.author}</p>
                    <p className="text-black font-semibold text-sm">
                      {book.price ? `KES ${book.price}` : "Price N/A"}
                    </p>
                  </div>
                  <button
                    className="mt-2 w-full bg-black text-white py-1 rounded hover:bg-gray-800"
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
