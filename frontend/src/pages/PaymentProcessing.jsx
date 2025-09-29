import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PaymentProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, orders } = location.state || {};
  const [seconds, setSeconds] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/payment/success', { state: { total, orders } });
    }, 7000);

    return () => {
      clearTimeout(redirect);
      clearInterval(timer);
    };
  }, [navigate, total, orders]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Processing Payment...</h2>
        <div className="flex justify-center mb-4">
          <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-purple-600 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Please wait while we securely process your payment.
        </p>
        <p className="text-sm text-purple-800 font-semibold">
          Redirecting in {seconds} {seconds === 1 ? 'second' : 'seconds'}…
        </p>
        {orders && orders.length > 0 && (
          <div className="mt-4 text-left">
            <h3 className="font-semibold">Your Order:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {orders.map((item) => (
                <li key={item.cart_item_id}>
                  {item.title} x {item.quantity} - ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Total: ${total}</p>
          </div>
        )}
      </div>
    </div>
  );
}
