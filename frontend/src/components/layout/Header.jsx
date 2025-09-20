import { Link } from 'react-router-dom'
import '../../styles/header.css'

const Header = () => (
  <header className="header">
    <div className="header-container">
      <Link to="/" className="header-logo">KITABU ZONE</Link>
      <nav className="header-nav">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    </div>
  </header>
)

export default Header
