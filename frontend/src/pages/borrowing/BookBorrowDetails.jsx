import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBorrow } from "../../context/BorrowContext";

const mockBooks = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    availability: "Available",
    language: "English",
    date: "1988",
    cover: "https://via.placeholder.com/150x200.png?text=Alchemist+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Alchemist+Back",
    description: "A magical story of Santiago, an Andalusian shepherd, on a quest for treasure.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Non-Fiction",
    availability: "Checked Out",
    language: "English",
    date: "2018",
    cover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Atomic+Habits+Back",
    description: "A guide to building good habits and breaking bad ones through small changes.",
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    availability: "Available",
    language: "Spanish",
    date: "2011",
    cover: "https://via.placeholder.com/150x200.png?text=Sapiens+Cover",
    backCover: "https://via.placeholder.com/150x200.png?text=Sapiens+Back",
    description: "An exploration of the history of humankind from the Stone Age to today.",
  },
];

const BookBorrowDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useBorrow();
  const navigate = useNavigate();

  const book = mockBooks.find((b) => b.id === parseInt(id));

  if (!book) {
    return <div className="min-h-screen bg-gray-50 p-6 text-purple-900 text-center">Book not found.</div>;
  }

  const handleBorrow = () => {
    if (!user) {
      alert("⚠️ Please log in to borrow a book.");
      navigate("/auth/login", { state: { from: { pathname: `/borrowing/bookDetails/${id}` } } });
      return;
    }
    addToCart(book);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">{book.title}</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="w-full sm:w-1/2 h-64 object-cover rounded-lg"
          />
          <img
            src={book.backCover}
            alt={`${book.title} back cover`}
            className="w-full sm:w-1/2 h-64 object-cover rounded-lg"
          />
        </div>
        <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
        <p className="text-sm text-purple-900 mb-4">{book.description}</p>
        <button
          onClick={handleBorrow}
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
        >
          Borrow
        </button>
        <div className="mt-4 text-center">
          <Link to="/library" className="text-purple-700 hover:underline text-sm font-medium">
            ← Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookBorrowDetails;