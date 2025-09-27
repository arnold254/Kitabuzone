// src/pages/ViewOrders.jsx
import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/api';

export default function ViewOrders() {
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => {
        const flattened = res.data.flatMap(order =>
          order.items.map(item => ({
            id: `ORD-${order.id}-${item.book_id}`,
            title: item.title,
            quantity: item.quantity,
            status: order.status,
            deliveryDate: new Date(order.created_at).toLocaleDateString(),
          }))
        );
        setOrderItems(flattened);
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  const hasApproved = useMemo(
    () => orderItems.some(item => item.status === 'approved'),
    [orderItems]
  );

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-lg font-semibold mb-4 text-left">My Orders</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-b">Order #</th>
                <th className="px-4 py-2 text-left border-b">Title</th>
                <th className="px-4 py-2 text-left border-b">Quantity</th>
                <th className="px-4 py-2 text-left border-b">Order Status</th>
                <th className="px-4 py-2 text-left border-b">Delivery Date</th>
                <th className="px-4 py-2 text-center border-b">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{item.id}</td>
                  <td className="px-4 py-2 border-b">{item.title}</td>
                  <td className="px-4 py-2 border-b">{item.quantity}</td>
                  <td className="px-4 py-2 border-b capitalize">{item.status}</td>
                  <td className="px-4 py-2 border-b">{item.deliveryDate}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => alert(`Cancel order item ${item.id}`)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
              hasApproved
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!hasApproved}
            onClick={() => alert('Proceed to shopping cart')}
          >
            Go to Shopping Cart
          </button>
        </div>
      </div>
    </div>
  );
}
