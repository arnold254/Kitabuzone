import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/paymentSuccessful');
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Processing...</h2>
        <div className="flex justify-center mb-4">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600">
          Please wait while we securely process your payment...
        </p>
      </div>
    </div>
  );
}
