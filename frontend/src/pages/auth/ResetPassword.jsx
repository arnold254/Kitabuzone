// src/pages/auth/ResetPassword.jsx
import { useNavigate } from 'react-router-dom';
import ResetPasswordForm from '../../components/forms/ResetPasswordForm';
import Header from '../../components/layout/Header';
import '../../styles/global.css';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log('Reset password:', formData);

    // Replace with real reset logic
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="page">
      <main className="page-overlay">
        {/* Header card */}
        <div className="page-content">
          <Header />
        </div>

        {/* Form card */}
        <div className="page-content">
          <h2 className="page-title">Reset your password</h2>
          <ResetPasswordForm onSubmit={handleSubmit} />
          <p className="terms">
            By continuing, you agree to our{' '}
            <a href="/terms">Terms & Conditions</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
