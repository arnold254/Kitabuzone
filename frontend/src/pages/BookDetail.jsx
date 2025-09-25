import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const libraryBooks = [
  {
    id: 101,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    language: "English",
    cover: "https://via.placeholder.com/150x200.png?text=Clean+Code",
    description: "A Handbook of Agile Software Craftsmanship."
  },
  {
    id: 102,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Programming",
    language: "English",
    cover: "https://via.placeholder.com/150x200.png?text=Pragmatic+Programmer",
    description: "From Journeyman to Master."
  },
  {
    id: 103,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    genre: "Computer Science",
    language: "English",
    cover: "https://via.placeholder.com/150x200.png?text=Algorithms",
    description: "Comprehensive guide to modern algorithms."
  },
];

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const book = libraryBooks.find(b => b.id === parseInt(id));

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

  const handleBorrow = () => {
    if (!isLoggedIn) {
      alert("Please sign in to borrow books!");
      navigate("/auth/login", { state: { from: `/bookDetails/${book.id}` } });
      return;
    }
    // ✅ Redirect to borrowing cart
    navigate("/borrowingCart");
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
