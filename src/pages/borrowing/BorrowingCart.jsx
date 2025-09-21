import { useBorrow } from "../../context/BorrowContext";
import { useNavigate, Link } from "react-router-dom";

const BorrowingCart = () => {
  const { cart, removeFromCart, confirmBorrow } = useBorrow();
  const navigate = useNavigate();

  const handleConfirm = () => {
    confirmBorrow();
    navigate("/borrowing/view");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-purple-900 mb-6">🛒 Borrowing Cart</h2>
      {cart.length === 0 ? (
        <p className="text-purple-900 text-sm">No books in cart.</p>
      ) : (
        <>
          <ul className="space-y-2 max-w-2xl mx-auto">
            {cart.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center p-3 bg-white shadow-lg rounded-lg"
              >
                <span className="text-purple-900 text-sm">{book.title}</span>
                <button
                  onClick={() => removeFromCart(book.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleConfirm}
            className="mt-4 w-full max-w-2xl mx-auto bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 text-sm font-medium"
          >
            Confirm Borrow
          </button>
        </>
      )}
      <div className="mt-8 text-center">
        <Link to="/library" className="text-purple-700 hover:underline text-sm font-medium">
          ← Back to Library
        </Link>
      </div>
    </div>
  );
};

export default BorrowingCart;