// src/pages/auth/Signup.jsx
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/forms/SignupForm';
import Header from '../../components/layout/Header';
import '../../styles/global.css';
import '../../styles/auth.css'; // new shared styles

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    console.log('Signup attempt:', formData);
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Create a new account</h2>
          <SignupForm onSubmit={handleSubmit} />
          <p className="auth-terms">
            By signing up, you agree to our{' '}
            <a href="/terms">Terms & Conditions</a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
