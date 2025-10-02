import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: generate fallback initials avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="w-full bg-purple-50 text-purple-900 p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center h-12">
          <img
            src={logo}
            alt="Kitabu Zone Logo"
            className="max-h-16 w-auto object-contain"
          />
        </div>

        {/* Centered Search */}
        <div className="flex-1 mx-6 relative max-w-lg">
          <Search className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-purple-900"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link to="/library" className="hover:underline">
            Library
          </Link>

          {user ? (
            <>
              <Link to="/viewOrders" className="hover:underline">
                My Orders
              </Link>
              {location.pathname.startsWith("/purchases/") && (
                <Link to="/viewOrders" className="hover:underline">
                  View Orders
                </Link>
              )}

              {/* Avatar */}
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-purple-300 object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer">
                    {getInitials(user.name)}
                  </div>
                )}

                {/* Dropdown (on hover) */}
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md hidden group-hover:block">
                  <div className="px-4 py-2 border-b">{user.name}</div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-purple-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link to="/auth/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;