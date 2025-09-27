// src/pages/BookDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const mockStoreBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: "$10", genre: "Fiction", cover: "https://via.placeholder.com/150x200.png?text=Alchemist+Cover" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: "$15", genre: "Non-Fiction", cover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Cover" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", price: "$20", genre: "Non-Fiction", cover: "https://via.placeholder.com/150x200.png?text=Sapiens+Cover" },
];

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`http://localhost:5000/books/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        } else {
          throw new Error("Backend not running");
        }
      } catch (err) {
        console.warn("Using mock book:", err.message);
        // Fallback to mock data
        const mockBook = mockStoreBooks.find((b) => b.id === parseInt(id));
        setBook(mockBook || null);
      }
    };
    fetchBook();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      alert("Please log in to purchase a book.");
      return;
    }

    try {
      await fetch("http://localhost:5000/viewOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
        }),
      });
      alert("Book added to orders!");
    } catch (err) {
      console.error("Error posting order:", err);
    }
  };

  if (!book) return <p className="p-6">Loading book details...</p>;

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/"
          className="text-purple-700 hover:underline font-medium"
        >
          ← Back Home
        </Link>

        {user && (
          <Link
            to="/viewOrders"
            className="text-purple-700 hover:underline font-medium"
          >
            View Orders
          </Link>
        )}
      </div>

      {/* Book Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex gap-6">
        <img
          src={book.cover}
          alt={book.title}
          className="w-48 h-64 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
          <p className="text-gray-700 mb-2">Author: {book.author}</p>
          <p className="text-gray-700 mb-4">Price: {book.price}</p>

          <button
            onClick={handlePurchase}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
