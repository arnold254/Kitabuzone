// src/components/layout/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.jpg";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); // only need user
  const location = useLocation();

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

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link to="/library" className="hover:underline">
            Library
          </Link>

          {/* Only show when logged in */}
          {user && (
            <>
              <Link to="/viewOrders" className="hover:underline">
                My Orders
              </Link>
              {/* If we are inside purchases/:id, also show quick link */}
              {location.pathname.startsWith("/purchases/") && (
                <Link to="/viewOrders" className="hover:underline">
                  View Orders
                </Link>
              )}
            </>
          )}

          {/* Show login/signup when logged out */}
          {!user && (
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
