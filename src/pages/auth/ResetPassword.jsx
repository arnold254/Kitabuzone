import { Link } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/reset-password-form.css";

const ResetPassword = () => {
  return (
    <div className="auth-page">
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <form className="form">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" required />
            </div>
            <button type="submit" className="button button-primary w-full">
              Update Password
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

export default ResetPassword;
