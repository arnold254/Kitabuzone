import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBorrowedBooks } from "../context/BorrowedBooksContext";
import { useState, useEffect } from "react";
import API from "../api";

const BookDetail = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const { requests, setRequests } = useBorrowedBooks();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="p-6">Loading book...</p>;

  if (!book) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Book Not Found</h2>
        <Link to="/library" className="text-purple-700 hover:underline">
          Back to Library
        </Link>
      </div>
    );
  }

  const handleBorrow = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to borrow books!");
      return;
    }

    try {
      const res = await API.post("/pendingRequests", {
        book_id: book.id,
        action: "borrow",
      });

      setRequests(prev => [
        {
          id: res.data.id,
          book,
          action: "borrow",
          status: "pending",
          created_at: new Date().toISOString(),
        },
        ...prev
      ]);

      alert("Borrow request submitted! Waiting for admin approval.");
    } catch (err) {
      console.error("Failed to submit borrow request:", err);
      alert("Failed to submit borrow request.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-milky-white flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <Link to="/library" className="text-purple-700 hover:underline mb-4 inline-block">
          &lt;-- Back to Library
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          <img src={book.cover} alt={book.title} className="w-full md:w-1/3 h-auto object-cover rounded" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-purple-900">{book.title}</h2>
            <p className="text-gray-600 mb-2">Author: {book.author}</p>
            <p className="text-gray-600 mb-2">Genre: {book.genre}</p>
            <p className="text-gray-600 mb-2">Language: {book.language}</p>
            <p className="text-gray-700 mt-4">{book.description}</p>

            <button
              onClick={handleBorrow}
              className="mt-6 w-full md:w-auto bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Borrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
