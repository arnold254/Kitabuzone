import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/forgot-password-form.css";

const ForgotPassword = () => {
  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Forgot Password</h1>
          <form className="form">
            <div className="form-group">
              <label className="form-label">Enter your email</label>
              <input type="email" className="form-input" required />
            </div>
            <button type="submit" className="button button-primary w-full">
              Reset Password
            </button>
          </form>

          <Link to="/auth/login" className="auth-link">
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
