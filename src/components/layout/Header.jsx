import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBorrow } from "../../context/BorrowContext";
import { Search } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useBorrow();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log("Search query:", e.target.value); // Replace with search logic
  };

  return (
    <header className="bg-purple-700 text-white shadow-sm w-full fixed top-0 left-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left side: Logo, Library, Search */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <h1 className="text-lg font-bold">
            <Link to="/" className="hover:underline">KITABU ZONE</Link>
          </h1>

          {/* Library Link */}
          <Link to="/library" className="hover:underline text-sm">
            Library
          </Link>

          {/* Search Bar */}
          <div className="relative">
            <label htmlFor="search" className="sr-only">Search books</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search books..."
              className="px-3 py-1 rounded-lg text-black w-40 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Search className="absolute right-2 top-1.5 text-gray-500 w-4 h-4" />
          </div>
        </div>

        {/* Right side: Auth Links */}
        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/auth/login" className="hover:underline text-sm">Login</Link>
              <Link to="/auth/signup" className="hover:underline text-sm">Signup</Link>
            </>
          ) : (
            <>
              
              <button onClick={logout} className="hover:underline text-sm">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;