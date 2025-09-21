import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBorrow } from "../../context/BorrowContext"; // ✅ import BorrowContext
import "../../styles/header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useBorrow(); // ✅ get cart state

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          KITABU ZONE
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          {!user ? (
            <>
              <Link to="/auth/login">Login</Link>
              <Link to="/auth/signup">Signup</Link>
            </>
          ) : user.role === "admin" ? (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/borrowing/library">Library</Link>

              {/* Cart link with badge */}
              <Link to="/borrowing/cart" className="cart-link">
                Cart
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </Link>

              <Link to="/borrowing/view">Borrowed</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
