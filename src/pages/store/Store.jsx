// src/pages/Store.jsx
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const mockBooks = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    cover: "https://via.placeholder.com/150x200.png?text=Alchemist+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Alchemist+Back",
    description: "A magical story of Santiago, an Andalusian shepherd, on a quest for treasure.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Back",
    description: "A guide to building good habits and breaking bad ones through small changes.",
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://via.placeholder.com/150x200.png?text=Sapiens+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Sapiens+Back",
    description: "An exploration of the history of humankind from the Stone Age to today.",
  },
];

const Store = () => {
  const { addToCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState(mockBooks);

  const handleAddToCart = (book) => {
    if (!user) {
      alert("⚠️ Please log in to add to cart.");
      navigate("/auth/login", { state: { from: { pathname: "/" } } });
      return;
    }
    addToCart(book);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📚 Store</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-full mx-auto">
        {books.map((book) => (
          <Link to={`/bookDetails/${book.id}`} key={book.id} className="block">
            <div className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">{book.author}</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(book);
                }}
                className="mt-2 w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Store;