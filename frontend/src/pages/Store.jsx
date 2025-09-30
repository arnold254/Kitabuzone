import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const Store = () => {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Failed fetching books:", err));
  }, []);

  // Only show books in the Store
  const storeBooks = books.filter((book) => book.location === "Store");

  const filteredBooks = storeBooks.filter(
    (book) => !genreFilter || book.category === genreFilter
  );

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
    <div className="min-h-screen flex bg-milky-white">
      {/* Sidebar */}
      <aside className="w-48 bg-purple-50 p-4 text-purple-900 flex flex-col justify-between">
        <div>
          <h2 className="font-bold mb-4">Filters</h2>
          <select
            className="p-2 rounded border border-purple-300 w-full"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Self Help">Self Help</option>
            <option value="Classic">Classic</option>
            <option value="Fancy">Fancy</option>
            <option value="High Fantasy">High Fantasy</option>
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
        <h1 className="text-2xl font-bold text-purple-900 mb-6">🛒 Store </h1>

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
                <img
                  src={book.cover ? `http://127.0.0.1:5000${book.cover}` : `https://via.placeholder.com/150?text=${book.title.replace(' ', '+')}`}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded mb-2"
                />

                {/* Title and Author */}
                <div>
                  <h3 className="font-bold text-purple-900 mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">{book.author}</p>
                  <p className="text-purple-900 font-semibold text-sm">{book.price ? `KES ${book.price}` : "Price N/A"}</p>
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
  );
};

export default Store;
