import { useBorrow } from "../../context/BorrowContext";
import { Link } from "react-router-dom";

const ViewBorrowedBooks = () => {
  const { borrowed } = useBorrow();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📖 Borrowed Books</h2>
      {borrowed.length === 0 ? (
        <p className="text-purple-900 text-sm">You haven’t borrowed any books yet.</p>
      ) : (
        <ul className="space-y-2 max-w-2xl mx-auto">
          {borrowed.map((book, i) => (
            <li
              key={i}
              className="p-3 bg-white shadow-lg rounded-lg text-purple-900 text-sm"
            >
              {book.title} — {book.author}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-center">
        <Link to="/library" className="text-purple-700 hover:underline text-sm font-medium">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
};

export default ViewBorrowedBooks;