// src/pages/payment/PaymentMethodCard.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from "../api/index";

export default function PaymentMethodCard() {
  const [method, setMethod] = useState('credit');
  const navigate = useNavigate();
  const location = useLocation();
  const { total, orders } = location.state || { total: 0, orders: [] };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orders.length) return;

    try {
      // Use the first pending_request_id to mark all approved requests as purchased
      const firstRequestId = orders[0].pending_request_id;
      await API.patch(`/pendingRequests/${firstRequestId}`, { status: "purchased" });

      // Navigate to payment processing page
      navigate('/payment/processing', { state: { total, orders } });
    } catch (err) {
      console.error("Failed to update orders:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const methods = [
    { key: 'mpesa', label: 'M-Pesa' },
    { key: 'credit', label: 'Credit Card' },
    { key: 'ewallet', label: 'E-Wallet' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

        {/* Method Selection */}
        <div className="flex gap-4 mb-6">
          {methods.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                method === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Payment Forms */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {method === 'credit' && (
            <>
              <input type="text" placeholder="Card Number" className="w-full p-2 border rounded" required />
              <input type="text" placeholder="Name on Card" className="w-full p-2 border rounded" required />
              <div className="flex gap-4">
                <input type="text" placeholder="CVV" className="w-1/2 p-2 border rounded" required />
                <input type="text" placeholder="Expiry Date (MM/YY)" className="w-1/2 p-2 border rounded" required />
              </div>
            </>
          )}

          {method === 'mpesa' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
                <p><strong>Paybill Number:</strong> 123456</p>
                <p><strong>Account Name:</strong> Kitabuzone Ltd</p>
              </div>
              <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded" required />
              <input type="text" placeholder="Transaction Code (if applicable)" className="w-full p-2 border rounded" />
            </>
          )}

          {method === 'ewallet' && (
            <>
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-gray-700 mb-2">Choose a Wallet</legend>
                <label className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <div>
                    <input type="radio" name="wallet" value="wallet1" className="accent-blue-600 mr-2" required />
                    Wallet A
                  </div>
                  <span className="text-sm text-green-600 font-semibold">KES {total}</span>
                </label>
              </fieldset>
            </>
          )}

          {/* Terms & Submit */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-blue-600" required />
            I have read & agree to the terms and conditions
          </label>

          <button
            type="submit"
            className="w-48 mx-auto block py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Submit Order (Total: KES {total})
          </button>
        </form>
      </div>
    </div>
  );
}
