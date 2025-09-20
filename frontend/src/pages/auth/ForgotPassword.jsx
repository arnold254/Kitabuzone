// src/pages/auth/ForgotPassword.jsx
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import Header from '../../components/layout/Header';
import '../../styles/global.css';
import '../../styles/auth.css'; // new shared styles

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log('Forgot password:', formData);
    setTimeout(() => navigate('/reset-password'), 1000);
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Forgot your password?</h2>
          <ForgotPasswordForm onSubmit={handleSubmit} />
          <p className="auth-terms">
            Check your email for instructions. By continuing, you agree to our{' '}
            <a href="/terms">Terms & Conditions</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
