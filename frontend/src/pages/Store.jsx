// src/pages/Store.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mockStoreBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: "$10", genre: "Fiction", cover: "https://via.placeholder.com/150x200.png?text=Alchemist+Cover" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: "$15", genre: "Non-Fiction", cover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Cover" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", price: "$20", genre: "Non-Fiction", cover: "https://via.placeholder.com/150x200.png?text=Sapiens+Cover" },
];

const Store = () => {
  const [books, setBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/store/books")
      .then(res => {
        if (!res.ok) throw new Error("Backend not running, using mock data");
        return res.json();
      })
      .then(data => setBooks(data))
      .catch(() => setBooks(mockStoreBooks)); // fallback
  }, []);

  const filteredBooks = books.filter(book =>
    !genreFilter || book.genre === genreFilter
  );

  const handlePurchase = async (book) => {
    if (!isLoggedIn) {
      alert("Please login to purchase books!");
      navigate("/auth/login", { state: { from: "/" } });
      return;
    }

    try {
      await fetch("http://localhost:5000/viewOrders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
    } catch (err) {
      console.error("Purchase failed, mock fallback:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-milky-white">
      {/* Sidebar */}
      <aside className="w-48 bg-purple-50 p-4 text-purple-900 flex flex-col justify-between">
        <div>
          <h2 className="font-bold mb-4">Filters</h2>
          <select
            className="p-2 rounded border border-purple-300"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
          </select>
        </div>

        {isLoggedIn && (
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="mt-4 w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
          >
            Logout
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <p className="text-purple-900">No books found.</p>
          ) : (
            filteredBooks.map(book => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/purchases/${book.id}`)} // ✅ Goes to /purchases/:id
              >
                <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded mb-2"/>
                <h3 className="font-bold text-purple-900">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <p className="text-purple-900 font-semibold">{book.price}</p>
                <button
                  className="mt-2 w-full bg-purple-500 text-white py-1 rounded hover:bg-purple-600"
                  onClick={(e) => { e.stopPropagation(); handlePurchase(book); }}
                >
                  Purchase
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;
