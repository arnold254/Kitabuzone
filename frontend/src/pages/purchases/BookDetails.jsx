// src/pages/purchases/BookDetails.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const storeBooks = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: "$10", genre: "Fiction", description: "A philosophical story about following your dreams.", cover: "https://via.placeholder.com/300x400.png?text=Alchemist+Cover" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: "$15", genre: "Non-Fiction", description: "A guide to building good habits and breaking bad ones.", cover: "https://via.placeholder.com/300x400.png?text=Atomic+Habits+Cover" },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", price: "$20", genre: "Non-Fiction", description: "A brief history of humankind.", cover: "https://via.placeholder.com/300x400.png?text=Sapiens+Cover" },
];

const BookDetails = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const book = storeBooks.find(b => b.id === parseInt(id));

  if (!book) return <p className="p-6 text-purple-900">Book not found.</p>;

  const handlePurchase = () => {
    if (!isLoggedIn) {
      alert("Please login to purchase books!");
      navigate("/auth/login", { state: { from: `/purchases/${id}` } });
      return;
    }
    alert(`You purchased: ${book.title}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-milky-white p-6">
      <Link to="/" className="self-start text-purple-900 hover:underline mb-4">
        &lt;-- Back Home
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl flex flex-col md:flex-row gap-6">
        <img src={book.cover} alt={book.title} className="w-full md:w-1/3 h-auto object-cover rounded"/>
        <div className="flex-1 flex flex-col">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-2"><strong>Author:</strong> {book.author}</p>
          <p className="text-gray-600 mb-2"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-purple-900 font-semibold mb-4">{book.price}</p>
          <p className="text-gray-700 mb-4">{book.description}</p>
          <button
            className="mt-auto bg-purple-500 text-white py-2 rounded hover:bg-purple-600 w-full md:w-1/2"
            onClick={handlePurchase}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
