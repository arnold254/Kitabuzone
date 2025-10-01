import { useState, useEffect } from "react";
import API from "../../api";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    location: "Library",
    price: "",
    cover: "", // ✅ Added cover field
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    API.get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    if (newBook.location === "Store" && !newBook.price) {
      setErrorMsg("⚠️ Price is required for Store books.");
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    API.post("/books", newBook)
      .then((res) => {
        setBooks([res.data, ...books]);
        setSuccessMsg(`✅ Book "${res.data.title}" added successfully!`);
        setTimeout(() => setSuccessMsg(""), 3000);
        setNewBook({
          title: "",
          author: "",
          category: "",
          location: "Library",
          price: "",
          cover: "", // ✅ Reset cover field
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setErrorMsg("⚠️ You must be logged in as an admin to add books.");
        } else {
          setErrorMsg("❌ Failed to add book. Try again.");
        }
        setTimeout(() => setErrorMsg(""), 4000);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      API.delete(`/books/${id}`)
        .then(() => setBooks(books.filter((book) => book.id !== id)))
        .catch((err) => {
          console.error(err);
          setErrorMsg("❌ Failed to delete book.");
          setTimeout(() => setErrorMsg(""), 4000);
        });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {successMsg && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-900">📚 Manage Books</h2>
        <input
          type="text"
          placeholder="Search by title or author..."
          className="px-3 py-2 border rounded-md text-sm w-56"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Book Form */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">
          ➕ Add New Book
        </h3>
        <form
          onSubmit={handleAddBook}
          className="grid gap-3 grid-cols-1 sm:grid-cols-4 items-end"
        >
          <input
            type="text"
            placeholder="Book Title"
            className="col-span-1 sm:col-span-2 px-3 py-2 border rounded-md"
            value={newBook.title}
            onChange={(e) =>
              setNewBook({ ...newBook, title: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Author"
            className="col-span-1 sm:col-span-1 px-3 py-2 border rounded-md"
            value={newBook.author}
            onChange={(e) =>
              setNewBook({ ...newBook, author: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Category (e.g., Fiction)"
            className="col-span-1 sm:col-span-1 px-3 py-2 border rounded-md"
            value={newBook.category}
            onChange={(e) =>
              setNewBook({ ...newBook, category: e.target.value })
            }
          />
          <select
            value={newBook.location}
            onChange={(e) =>
              setNewBook({ ...newBook, location: e.target.value })
            }
            className="px-3 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="Library">Library</option>
            <option value="Store">Store</option>
          </select>

          {newBook.location === "Store" && (
            <input
              type="number"
              placeholder="Price"
              className="col-span-1 px-3 py-2 border rounded-md"
              value={newBook.price}
              onChange={(e) =>
                setNewBook({ ...newBook, price: e.target.value })
              }
              required
            />
          )}

          <input
            type="text"
            placeholder="Cover Image URL"
            className="col-span-1 sm:col-span-2 px-3 py-2 border rounded-md"
            value={newBook.cover}
            onChange={(e) =>
              setNewBook({ ...newBook, cover: e.target.value })
            }
          />

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
            >
              Add Book to {newBook.location}
            </button>
          </div>
        </form>
      </div>

      {/* Books List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-800">
          📖 Library & Store Books
        </h3>
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="relative bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-28 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">📘</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900">
                      {book.title}
                    </h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {book.category || "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Location: {book.location}
                    </p>
                    {book.location === "Store" && (
                      <p className="text-sm text-purple-700 font-semibold mt-1">
                        ${book.price ?? "N/A"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    ID: {String(book.id).slice(-6)}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
