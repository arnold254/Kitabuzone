import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { useAdmin } from "../../context/AdminContext";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import backCover from "../../assets/back.jpg"; // Make sure this path is correct

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useStore();
  const { books } = useAdmin();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (books) {
      const foundBook = books.find((b) => b.id === id);
      setBook(foundBook);
      setIsLoading(false);
    }
  }, [books, id]);

  const handleAddToCart = () => {
    if (!user) {
      alert("⚠️ Please log in to add to cart.");
      navigate("/auth/login", { state: { from: { pathname: `/bookDetails/${id}` } } });
      return;
    }
    addToCart(book);
  };

  if (isLoading) {
    return <div className="bg-cream-50 p-6 text-primary-900 text-center text-sm">Loading book details...</div>;
  }

  if (!book) {
    return <div className="bg-cream-50 p-6 text-primary-900 text-center text-sm">Book not found.</div>;
  }

  return (
    <div className="min-h-screen bg-cream-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Small Header */}
        <h1 className="text-2xl font-bold text-primary-700 mb-6 text-center">
          Book Details
        </h1>

        {/* Back Link */}
        <Link to="/" className="text-primary-700 hover:underline text-sm mb-4 inline-block">
          ← Back to Home
        </Link>

        {/* Book Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
          {/* Front Cover */}
          <img
            src={book.cover}
            alt={`${book.title} front cover`}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg"
          />
          {/* Back Cover */}
          <img
            src={backCover}
            alt={`${book.title} back cover`}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg"
          />

          {/* Book Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-primary-900 mt-4 md:mt-0">{book.title}</h3>
              <p className="text-sm text-neutral-600">by {book.author}</p>
              <p className="text-sm text-primary-700 mt-2">
                {book.price.startsWith("$")
                  ? `KES ${(parseFloat(book.price.replace("$", "")) * 100).toFixed(0)}`
                  : book.price}
              </p>
              <p className="text-sm text-neutral-600 mt-2">{book.description || "No description available."}</p>
            </div>

            <Button
             onClick={handleAddToCart}
             className="bg-purple-700 hover:bg-purple-800 text-cream-50 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg w-full md:w-auto transition-transform transform hover:scale-105"
             >
             Add to Cart
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;




