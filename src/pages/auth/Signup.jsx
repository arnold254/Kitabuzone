import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/signup-form.css";

const Signup = () => {
  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Signup</h1>
          <form className="form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" required />
            </div>
            <button type="submit" className="button button-primary w-full">
              Signup
            </button>
          </form>

          <Link to="/auth/login" className="auth-link">
            Already have an account? Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Signup;
