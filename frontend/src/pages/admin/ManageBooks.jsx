// src/pages/admin/ManageBooks.jsx
import { useState } from "react";

const ManageBooks = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", status: "Available", location: "Library" },
    { id: 2, title: "1984", author: "George Orwell", category: "Dystopian", status: "Borrowed", location: "Store" },
    { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Classic", status: "Available", location: "Library" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "", location: "Library" });

  // Add new book
  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;

    const newEntry = {
      id: Date.now(), // simple unique id
      ...newBook,
      status: "Available",
    };

    setBooks([newEntry, ...books]);
    setNewBook({ title: "", author: "", category: "", location: "Library" });
  };

  // Delete book
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  // Filtered books by search (title or author)
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with small search */}
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

      {/* Add Book Form (compact card-like) */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 max-w-2xl">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">➕ Add New Book</h3>
        <form onSubmit={handleAddBook} className="grid gap-3 grid-cols-1 sm:grid-cols-4 items-end">
          <input
            type="text"
            placeholder="Book Title"
            className="col-span-1 sm:col-span-2 px-3 py-2 border rounded-md"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Author"
            className="col-span-1 sm:col-span-1 px-3 py-2 border rounded-md"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category (e.g. Fiction)"
            className="col-span-1 sm:col-span-1 px-3 py-2 border rounded-md"
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
          />

          {/* Second row: location select + add button */}
          <select
            value={newBook.location}
            onChange={(e) => setNewBook({ ...newBook, location: e.target.value })}
            className="px-3 py-2 border rounded-md w-full sm:w-auto"
          >
            <option value="Library">Library</option>
            <option value="Store">Store</option>
          </select>

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

      {/* Book List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-800">📖 Library & Store Books</h3>

        {filteredBooks.length === 0 ? (
          <p className="text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="relative bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-28 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    {/* placeholder cover */}
                    📘
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                    <p className="text-xs text-gray-500 mt-1">Category: {book.category || "—"}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          book.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {book.status}
                      </span>

                      <span className="inline-block px-2 py-1 text-xs text-purple-700 bg-purple-50 rounded">
                        {book.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">ID: {String(book.id).slice(-6)}</div>
                  <div className="flex items-center gap-3">
                    {/* future: add edit button */}
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
