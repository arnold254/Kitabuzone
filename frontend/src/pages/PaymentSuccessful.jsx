import React from 'react';

export default function PaymentSuccessful() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {/* Animated Checkmark */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 text-white rounded-full p-4 animate-checkmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Animated Text */}
        <h2 className="text-xl font-semibold text-gray-800 animate-slide-up">
          Payment Successful!
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Thank you! Your transaction has been completed.
        </p>
      </div>

      {/* Tailwind Custom Animations */}
      <style>
        {`
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }

          @keyframes slideUp {
            0% { transform: translateY(20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          .animate-checkmark {
            animation: checkmark 0.6s ease-out forwards;
          }

          .animate-slide-up {
            animation: slideUp 0.6s ease-out 0.3s forwards;
          }
        `}
      </style>
    </div>
  );
}
