// src/pages/auth/Login.jsx
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import Header from '../../components/layout/Header';
import '../../styles/global.css';
import '../../styles/auth.css'; // <- new auth styling

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log('Login attempt:', formData);
    setTimeout(() => navigate('/admin'), 1000);
  };

  return (
    <div className="auth-page">
      {/* Full-width header */}
      <Header />

      {/* Centered card */}
      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Sign in to KITABU ZONE</h2>

          <LoginForm onSubmit={handleSubmit} />

          <Link to="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>

          <p className="auth-terms">
            By signing in, you agree to our{' '}
            <a href="/terms">Terms & Conditions</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
