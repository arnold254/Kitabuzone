import { useBorrow } from "../../context/BorrowContext";
import { useNavigate } from "react-router-dom";

const BorrowingCart = () => {
  const { cart, removeFromCart, confirmBorrow } = useBorrow();
  const navigate = useNavigate();

  const handleConfirm = () => {
    confirmBorrow();
    navigate("/borrowing/view");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Borrowing Cart</h2>
      {cart.length === 0 ? (
        <p>No books in cart.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {cart.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>{book.title}</span>
                <button
                  onClick={() => removeFromCart(book.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleConfirm}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Confirm Borrow
          </button>
        </>
      )}
    </div>
  );
};

export default BorrowingCart;
