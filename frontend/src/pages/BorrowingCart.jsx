import React, { useState } from 'react';

const initialCart = [
  {
    id: 'FIG-120',
    title: 'The 48 Laws of Power',
    quantity: 1,
    image: 'https://images-na.ssl-images-amazon.com/images/I/61J3Uu4jOLL.jpg',
  },
  {
    id: 'FIG-121',
    title: 'The Art of War',
    quantity: 1,
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630683326i/10534.jpg',
  },
  {
    id: 'FIG-122',
    title: 'Atomic Habits',
    quantity: 1,
    image: 'https://cdnattic.atticbooks.co.ke/img/V115044.jpg',
  },
];

export default function BorrowingCart() {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = id => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Borrowing Cart</h2>
          <span className="text-sm text-gray-600">Items to Borrow: {cart.length}</span>
        </div>
        <hr className="mb-4 border-gray-200" />

        {/* Cart Items */}
        <div className="max-h-[500px] overflow-y-auto pr-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 border-b h-40">
              <img src={item.image} alt={item.title} className="w-20 h-full object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.title}</h3>
                <div className="flex items-center mt-2 gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    −
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="flex items-center justify-center gap-1 min-w-[150px] px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                onClick={() => removeItem(item.id)}
              >
                🗙 Remove
              </button>
            </div>
          ))}
        </div>

        {/* Checkout Button */}
        <div className="mt-6 flex justify-center">
          <button
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              cart.length
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!cart.length}
            onClick={() => alert('Proceeding to borrow')}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
