import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const ShoppingCart = () => {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", { state: { from: { pathname: "/shoppingCart" } } });
    }
  }, [user, navigate]);

  console.log("ShoppingCart: Rendering cart:", cart);

  if (!user) {
    return null; // Redirecting, so nothing renders
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white p-2 shadow-lg fixed top-0 left-0 w-full z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">🛒 Shopping Cart</h2>
          <Link to="/" className="text-white hover:underline text-sm">
            Back to Home
          </Link>
        </div>
      </header>
      <div className="p-6 mt-12">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {cart.length === 0 ? (
            <p className="text-purple-900 text-sm text-center">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.author}</p>
                    <p className="text-sm text-purple-900">{convertPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    text="Remove"
                    color="red"
                  />
                </div>
              ))}
              <div className="mt-6">
                <p className="text-lg font-semibold text-purple-900">
                  Total: KES{" "}
                  {cart
                    .reduce(
                      (total, item) =>
                        total +
                        parseFloat(convertPrice(item.price).replace("KES ", "")) * item.quantity,
                      0
                    )
                    .toFixed(0)}
                </p>
                <Button
                  onClick={() => alert("Order submission to be implemented")}
                  text="Place Order"
                  color="purple"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const convertPrice = (price) =>
  price.startsWith("$")
    ? `KES ${(parseFloat(price.replace("$", "")) * 100).toFixed(0)}`
    : price;

const Button = ({ onClick, text, color }) => {
  console.log(`Button: Rendering ${text} with color ${color}`);
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-600 text-white px-4 py-1.5 rounded-lg hover:bg-${color}-700 text-sm font-medium min-w-[80px] relative z-10`}
    >
      {text}
    </button>
  );
};

export default ShoppingCart;