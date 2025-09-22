import { useAdmin } from "../../context/AdminContext";
import { useState } from "react";

const ManageBooks = () => {
  const { books, addBook, editBook, deleteBook } = useAdmin();
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    genre: "",
    availability: "Available",
    language: "",
    date: "",
    cover: "",
    backCover: "",
    description: "",
    type: "store",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ genre: "", availability: "", language: "", type: "" });

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.author) newErrors.author = "Author is required";
    if (form.price && !/^\$\d+(\.\d{2})?$/.test(form.price)) newErrors.price = "Price must be in format $X.XX";
    if (!form.type) newErrors.type = "Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (editingId) {
          editBook(editingId, form);
          setEditingId(null);
        } else {
          addBook(form);
        }
        setForm({
          title: "",
          author: "",
          price: "",
          genre: "",
          availability: "Available",
          language: "",
          date: "",
          cover: "",
          backCover: "",
          description: "",
          type: "store",
        });
      } catch (e) {
        setErrors({ form: e.message });
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: "",
      author: "",
      price: "",
      genre: "",
      availability: "Available",
      language: "",
      date: "",
      cover: "",
      backCover: "",
      description: "",
      type: "store",
    });
    setErrors({});
  };

  const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];
  const languages = [...new Set(books.map((b) => b.language).filter(Boolean))];
  const types = ["store", "library"];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = filters.genre ? book.genre === filters.genre : true;
    const matchesAvailability = filters.availability ? book.availability === filters.availability : true;
    const matchesLanguage = filters.language ? book.language === filters.language : true;
    const matchesType = filters.type ? book.type === filters.type : true;
    return matchesSearch && matchesGenre && matchesAvailability && matchesLanguage && matchesType;
  });

  console.log("ManageBooks: Rendering books:", filteredBooks);

  return (
    <div className="bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">📚 Manage Books</h2>

      {/* Book Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Total Books" value={books.length} />
        <Card title="Fiction Books" value={books.filter((b) => b.genre === "Fiction").length} />
        <Card title="Non-Fiction Books" value={books.filter((b) => b.genre === "Non-Fiction").length} />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-lg text-sm flex-1"
          />
          <select
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="">All Availability</option>
            <option value="Available">Available</option>
            <option value="Checked Out">Checked Out</option>
          </select>
          <select
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">{editingId ? "Edit Book" : "Add Book"}</h3>
        {errors.form && <p className="text-red-600 mb-4">{errors.form}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="p-2 border rounded-lg text-sm w-full"
              required
            />
            {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Author"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="p-2 border rounded-lg text-sm w-full"
              required
            />
            {errors.author && <p className="text-red-600 text-xs">{errors.author}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Price (e.g., $10.99)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="p-2 border rounded-lg text-sm w-full"
            />
            {errors.price && <p className="text-red-600 text-xs">{errors.price}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Genre"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="p-2 border rounded-lg text-sm w-full"
            />
          </div>
          <select
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full"
          >
            <option value="Available">Available</option>
            <option value="Checked Out">Checked Out</option>
          </select>
          <div>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="p-2 border rounded-lg text-sm w-full"
              required
            >
              <option value="store">Store</option>
              <option value="library">Library</option>
            </select>
            {errors.type && <p className="text-red-600 text-xs">{errors.type}</p>}
          </div>
          <input
            type="text"
            placeholder="Language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full"
          />
          <input
            type="date"
            placeholder="Publication Date (YYYY-MM-DD)"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full"
          />
          <input
            type="url"
            placeholder="Cover URL"
            value={form.cover}
            onChange={(e) => setForm({ ...form, cover: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full"
          />
          <input
            type="url"
            placeholder="Back Cover URL"
            value={form.backCover}
            onChange={(e) => setForm({ ...form, backCover: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded-lg text-sm w-full col-span-2"
          />
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-purple-700 text-white p-2 rounded-lg hover:bg-purple-800 text-sm flex-1"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 text-sm flex-1"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {(form.cover || form.backCover) && (
          <div className="mt-4 flex gap-4">
            {form.cover && <img src={form.cover} alt="Cover Preview" className="w-24 h-32 object-cover rounded" />}
            {form.backCover && (
              <img src={form.backCover} alt="Back Cover Preview" className="w-24 h-32 object-cover rounded" />
            )}
          </div>
        )}
      </div>

      {/* Book List */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">Books</h3>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Price</th>
              <th className="p-2">Availability</th>
              <th className="p-2">Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-600">
                  No books found.
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.price || "N/A"}</td>
                  <td className="p-2">{book.availability}</td>
                  <td className="p-2">{book.type.charAt(0).toUpperCase() + book.type.slice(1)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setEditingId(book.id);
                        setForm(book);
                      }}
                      className="bg-purple-700 text-white px-3 py-1 rounded-lg hover:bg-purple-800 text-sm mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-2xl font-bold text-purple-700">{value}</p>
  </div>
);

export default ManageBooks;