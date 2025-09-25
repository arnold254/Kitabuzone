import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodCard() {
  const [method, setMethod] = useState('credit');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/paymentProcessing');
  };

  const methods = [
    {
      key: 'mpesa',
      label: 'M-Pesa',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M7 4h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
          <path d="M11 18h2" />
        </svg>
      ),
    },
    {
      key: 'credit',
      label: 'Credit Card',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
    {
      key: 'ewallet',
      label: 'E-Wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 7h18v10H3z" />
          <path d="M16 11h4v2h-4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>

        {/* Method Selection Buttons */}
        <div className="flex gap-4 mb-6">
          {methods.map(({ key, label, icon }) => {
            const isSelected = method === key;
            return (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium capitalize transition-colors duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        {/* Conditional Form Rendering */}
        {method === 'credit' && (
          <form className="space-y-4">
            <input type="text" placeholder="Card Number" className="w-full p-2 border rounded" />
            <input type="text" placeholder="Name on Card" className="w-full p-2 border rounded" />
            <div className="flex gap-4">
              <input type="text" placeholder="CVV" className="w-1/2 p-2 border rounded" />
              <input type="text" placeholder="Expiry Date (MM/YY)" className="w-1/2 p-2 border rounded" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-blue-600" />
              I have read & agree to the terms and conditions
            </label>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-48 mx-auto block py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Submit Order
            </button>
          </form>
        )}

        {method === 'mpesa' && (
          <form className="space-y-4">
            {/* Paybill Info */}
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
              <p><strong>Paybill Number:</strong> 123456</p>
              <p><strong>Account Name:</strong> Kitabuzone Ltd</p>
            </div>

            {/* Phone Number */}
            <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded" />

            {/* OR separator */}
            <div className="text-center text-sm text-gray-500">or <span className="italic">(For Paybill option)</span></div>

            {/* Transaction Code */}
            <input type="text" placeholder="Transaction Code (if applicable)" className="w-full p-2 border rounded" />

            {/* Terms */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-blue-600" />
              I have read & agree to the terms and conditions
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-48 mx-auto block py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Submit Order
            </button>
          </form>
        )}

        {method === 'ewallet' && (
          <form className="space-y-4">
            {/* Wallet Options */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-gray-700 mb-2">Choose a Wallet</legend>

              <label className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50">
                <div>
                  <input type="radio" name="wallet" value="wallet1" className="accent-blue-600 mr-2" />
                  <span className="font-medium">Wallet A</span>
                  <span className="text-xs text-gray-500 ml-2">ID: WLT-001</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">KES 36,250.00</span>
              </label>

              <label className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50">
                <div>
                  <input type="radio" name="wallet" value="wallet2" className="accent-blue-600 mr-2" />
                  <span className="font-medium">Wallet B</span>
                  <span className="text-xs text-gray-500 ml-2">ID: WLT-002</span>
                </div>
                <span className="text-sm text-green-600 font-semibold">KES 19,800.00</span>
              </label>
            </fieldset>

            {/* Terms */}
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-blue-600" />
              I have read & agree to the terms and conditions
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-48 mx-auto block py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Submit Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
