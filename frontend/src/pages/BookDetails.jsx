import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);

  useEffect(() => {
    API.get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.error("Failed fetching book:", err));
  }, [id]);

  const handlePurchase = async () => {
    if (!user) return alert("Login required to purchase.");

    try {
      await API.post("/pendingRequests", {
        user_id: user.id,
        book_id: book.id,
        action: "purchase",
      });
      alert("Purchase request sent! Waiting for admin approval.");
    } catch (err) {
      console.error(err);
    }
  };

  if (!book) return <p className="p-6">Loading book details...</p>;

  // Determine proper cover URL
  const coverUrl = book.cover
    ? book.cover.startsWith("http")
      ? book.cover
      : `http://localhost:5000${book.cover}`
    : `https://via.placeholder.com/200?text=${book.title.replace(/\s+/g, '+')}`;

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-purple-700 hover:underline font-medium">
          ← Back Home
        </Link>
        {user && (
          <Link to="/viewOrders" className="text-purple-700 hover:underline font-medium">
            View Orders
          </Link>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full md:w-48 h-64 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
          <p className="text-gray-700 mb-2">Author: {book.author}</p>
          <p className="text-gray-700 mb-4">Price: {book.price ? `KES ${book.price}` : "N/A"}</p>
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
