import React, { useMemo } from 'react';

const orders = [
  { id: 'FIG-112', title: 'The Great Gatsby', genre: 'Classic', status: 'Pending Approval', deliveryDate: 'Dec 5', author: 'F. Scott Fitzgerald' },
  { id: 'FIG-113', title: 'Beloved', genre: 'Historical Fiction', status: 'Shipped', deliveryDate: 'Dec 5', author: 'Toni Morrison' },
  { id: 'FIG-114', title: 'Dune', genre: 'Science Fiction', status: 'Cancelled', deliveryDate: 'Dec 5', author: 'Frank Herbert' },
  { id: 'FIG-115', title: 'Atomic Habits', genre: 'Self Improvement', status: 'Delivered', deliveryDate: 'Dec 5', author: 'James Clear' },
  { id: 'FIG-116', title: 'The Da Vinci Code', genre: 'Thriller', status: 'Cancelled', deliveryDate: 'Dec 5', author: 'Dan Brown' },
  { id: 'FIG-117', title: 'The Hobbit', genre: 'Fantasy Adventure', status: 'Shipped', deliveryDate: 'Dec 5', author: 'J.R.R. Tolkien' },
  { id: 'FIG-118', title: 'Pride and Prejudice', genre: 'Romance', status: 'Delivered', deliveryDate: 'Dec 5', author: 'Jane Austen' },
  { id: 'FIG-119', title: 'Dracula', genre: 'Gothic Horror', status: 'Cancelled', deliveryDate: 'Dec 5', author: 'Bram Stoker' },
  { id: 'FIG-120', title: 'The 48 Laws of Power', genre: 'Strategy', status: 'Approved', deliveryDate: 'Dec 5', author: 'Robert Greene' },
  { id: 'FIG-121', title: 'The Art of War', genre: 'Philosophy', status: 'Approved', deliveryDate: 'Dec 5', author: 'Sun Tzu' },
];

export default function ViewOrders() {

  const hasApproved = useMemo(() => orders.some(order => order.status === 'Approved'), []);

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
                <th className="px-4 py-2 text-left border-b">Genre</th>
                <th className="px-4 py-2 text-left border-b">Order Status</th>
                <th className="px-4 py-2 text-left border-b">Delivery Date</th>
                <th className="px-4 py-2 text-left border-b">Author</th>
                <th className="px-4 py-2 text-center border-b">Cancel</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{order.id}</td>
                  <td className="px-4 py-2 border-b">{order.title}</td>
                  <td className="px-4 py-2 border-b">{order.genre}</td>
                  <td className="px-4 py-2 border-b">{order.status}</td>
                  <td className="px-4 py-2 border-b">{order.deliveryDate}</td>
                  <td className="px-4 py-2 border-b">{order.author}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => alert(`Cancel order ${order.id}`)}
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
  )
}
