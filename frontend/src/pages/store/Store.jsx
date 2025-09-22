import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Button } from "../../components/ui/Button.jsx";
import bookPlaceholder from "../../assets/book.jpg";

const Store = () => {
  const { addToCart, searchQuery, genreFilter, priceFilter, dateSort, setSearchQuery, setGenreFilter, setPriceFilter, setDateSort } = useStore();
  const { user } = useAuth();
  const { books, loading: booksLoading, error: booksError } = useAdmin();
  const navigate = useNavigate();
  const [storeBooks, setStoreBooks] = useState([]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    let result = books.filter((book) => book.type === "store");

    if (searchQuery) {
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (genreFilter) result = result.filter((book) => book.genre === genreFilter);
    if (priceFilter) {
      result = result.filter((book) => {
        const price = parseFloat(book.price?.replace("$", "") || 0) * 100;
        if (priceFilter === "low") return price <= 1000;
        if (priceFilter === "medium") return price > 1000 && price <= 2000;
        if (priceFilter === "high") return price > 2000;
        return true;
      });
    }

    if (dateSort) {
      result = result.sort((a, b) => {
        const dateA = new Date(a.publicationDate);
        const dateB = new Date(b.publicationDate);
        return dateSort === "newest" ? dateB - dateA : dateA - dateB;
      });
    }

    return result;
  }, [books, searchQuery, genreFilter, priceFilter, dateSort]);

  useEffect(() => setStoreBooks(filteredBooks), [filteredBooks]);

  const handleAddToCart = (book) => {
    if (!user) {
      alert("⚠️ Please log in to add to cart.");
      navigate("/auth/login", { state: { from: { pathname: "/" } } });
      return;
    }
    addToCart(book);
  };

  if (booksError) return <div className="min-h-screen bg-cream-50 flex items-center justify-center text-primary-900 text-xl">{booksError}</div>;
  if (booksLoading) return <div className="min-h-screen bg-cream-50 flex items-center justify-center text-primary-900 text-xl animate-pulse">Loading books...</div>;

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar with filters */}
      <aside className="w-48 bg-cream-100 p-4 border-r hidden md:block">
        <h3 className="text-lg font-bold text-primary-900 mb-4">Filters</h3>
        <div className="space-y-4">
          <select className="w-full border rounded-lg px-3 py-2" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">Genre</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
          </select>
          <select className="w-full border rounded-lg px-3 py-2" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="">Price</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="w-full border rounded-lg px-3 py-2" value={dateSort} onChange={(e) => setDateSort(e.target.value)}>
            <option value="">Sort by Date</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </aside>

      {/* Main Books Section */}
      <main className="flex-1 max-w-screen-2xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-10 text-center">📚 Our Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storeBooks.length === 0 ? (
            <p className="text-primary-900 text-lg col-span-full text-center font-medium">No books available in the store.</p>
          ) : (
            storeBooks.map((book, index) => (
              <div key={book.id} className="book-card bg-cream-100 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-5 transform hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Link to={`/bookDetails/${book.id}`} className="block">
                  <img src={book.cover || bookPlaceholder} alt={book.title || "Untitled"} className="w-full h-64 object-cover rounded-lg mb-4 transition-transform duration-300 hover:scale-110" onError={(e) => (e.target.src = bookPlaceholder)} />
                  <p className="text-lg font-semibold text-primary-900 truncate">{book.title || "Untitled"}</p>
                  <p className="text-sm text-neutral-600 truncate">{book.author || "Unknown Author"}</p>
                  <p className="text-base font-bold text-primary-700 mt-2">{convertPrice(book.price)}</p>
                </Link>
                <Button onClick={() => handleAddToCart(book)} className="bg-primary-600 hover:bg-primary-700 text-cream-50 px-6 py-3 rounded-lg w-full mt-4 font-semibold transition shadow-md">Add to Cart</Button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

const convertPrice = (price) => {
  if (!price) return "Price not available";
  return price.startsWith("$") ? `KES ${(parseFloat(price.replace("$", "")) * 100).toFixed(0)}` : price;
};

export default Store;
