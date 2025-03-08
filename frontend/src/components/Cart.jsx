import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartData, removeCartItem, clearCart } from "../redux/cartSlice";
import { Trash2 } from "lucide-react";
import BestSellerComponent from "./productsPages/BestSellerComponent";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(getCartData());
  }, [dispatch]);

  const handleRemoveItem = (productId) => {
    dispatch(removeCartItem({ productId }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-[#E3EDE3] text-[#0D2518] flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl border border-green-500 p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-600 border-b border-green-500 pb-3 text-center">
          🛒 Shopping Cart
        </h2>
        {loading ? (
          <p className="text-center text-green-500">Loading cart...</p>
        ) : cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map(({ product, quantity, _id }) => (
              <div
                key={_id}
                className="bg-[#F5FAF5] text-[#0D2518] p-5 rounded-lg flex items-center gap-6 shadow-md border border-green-300"
              >
                <img
                  src={product.image[0]}
                  alt={product.productName}
                  className="w-24 h-24 object-cover rounded-lg border border-green-400 shadow-md"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-700">
                    {product.productName}
                  </h3>
                  <p className="text-green-700">
                    💰 Price:{" "}
                    <span className="text-green-900">₹{product.price}</span>
                  </p>
                  <p className="text-green-700">
                    📦 Quantity:{" "}
                    <span className="text-green-900">{quantity}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 p-4 bg-[#F5FAF5] rounded-lg border border-green-400 shadow-lg">
              <h3 className="text-2xl font-bold text-green-800">
                Total: <span className="text-green-900">₹{totalPrice}</span>
              </h3>
              <button
                onClick={handleClearCart}
                className="border border-green-500 text-green-700 px-5 py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-md"
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-green-700">Your cart is empty. 🛍️</p>
        )}
        {/* BestSellerComponent added below the cart */}
        <div className="mt-12">
          <BestSellerComponent />
        </div>
      </div>
    </div>
  );
};

export default Cart;
