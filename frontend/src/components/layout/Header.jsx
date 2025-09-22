import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { debounce } from "lodash";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchInput);
    return () => debouncedSearch.cancel();
  }, [searchInput]);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <header className="bg-primary-700/90 backdrop-blur-md border-b border-primary-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl sm:text-2xl font-bold text-cream-50">
          KitabuZone
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-cream-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation, Search, and Auth */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-4 md:gap-6 absolute md:static top-16 left-0 right-0 bg-primary-700/95 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none z-40`}
        >
          {/* Search + Library */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search books..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-sm text-primary-900 bg-cream-100 focus:outline-none focus:ring-2 focus:ring-accent-400"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600" />
            </div>

            {/* Library Nav */}
            <Link
              to="/library"
              className="text-sm font-medium text-cream-50 hover:text-accent-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
          </div>

          {/* Auth Links */}
          <nav className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            {user ? (
              <>
                <Link
                  to="/shoppingCart"
                  className="flex items-center gap-2 text-sm font-medium text-cream-50 hover:text-accent-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="w-4 h-4" /> Cart ({cart.length})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-sm font-medium text-cream-50 hover:text-accent-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-cream-50 hover:text-accent-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="text-sm font-medium bg-accent-500 text-primary-900 px-4 py-2 rounded-full hover:bg-accent-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
