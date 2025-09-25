import React, { useState } from 'react';

const initialCart = [
  {
    id: 'FIG-120',
    title: 'The 48 Laws of Power',
    price: 700,
    quantity: 1,
    image: 'https://images-na.ssl-images-amazon.com/images/I/61J3Uu4jOLL.jpg',
  },
  {
    id: 'FIG-121',
    title: 'The Art of War',
    price: 1500,
    quantity: 1,
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630683326i/10534.jpg',
  },
  {
    id: 'FIG-122',
    title: 'Atomic Habits',
    price: 1000,
    quantity: 1,
    image: 'https://cdnattic.atticbooks.co.ke/img/V115044.jpg',
  },
];

export default function ShoppingCart() {
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 150;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
        {/* Left: Cart Items */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
          <div className="max-h-[500px] overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 border-b h-40">
                <img src={item.image} alt={item.title} className="w-20 h-full object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">KES. {item.price}</p>
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
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-80 bg-gray-100 border rounded-md p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items ({totalItems})</span>
            <span>KES. {totalPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>KES. {shipping}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total</span>
            <span>KES. {grandTotal}</span>
          </div>

          <button
            className={`mt-6 w-full py-2 rounded-md font-medium transition-colors duration-200 ${
              cart.length
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!cart.length}
            onClick={() => alert('Proceeding to checkout')}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
