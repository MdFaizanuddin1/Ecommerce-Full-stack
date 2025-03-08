import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllWishLists,
  removeFromWishList,
  deleteWishList,
} from "../redux/wishListSlice";
import { Heart, Trash2, XCircle } from "lucide-react";
import BestSellerComponent from "./productsPages/BestSellerComponent";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishLists, loading } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    dispatch(getAllWishLists());
  }, [dispatch]);

  const handleRemoveItem = (productId, name) => {
    dispatch(removeFromWishList({ productId, name }));
  };

  const handleDeleteWishlist = (name, hasItems) => {
    if (hasItems) {
      if (
        window.confirm(
          "This wishlist contains items. Deleting it will remove all items inside. Are you sure?"
        )
      ) {
        dispatch(deleteWishList({ name }));
      }
    } else {
      dispatch(deleteWishList({ name }));
    }
  };

  return (
    <div className="min-h-screen bg-[#E3EDE3] text-[#0D2518] flex justify-center items-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl border border-green-500 p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-600 border-b border-green-500 pb-3 text-center">
          💚 Wishlist
        </h2>
        {loading ? (
          <p className="text-center text-green-500">Loading wishlist...</p>
        ) : wishLists.length > 0 ? (
          <div className="space-y-6">
            {wishLists
              .filter(({ products }) => products.length > 0)
              .map(({ name, products }) => (
                <div key={name} className="mb-6">
                  <div className="flex justify-between items-center border-b border-green-400 pb-2">
                    <h3 className="text-2xl font-semibold text-green-700">
                      {name}
                    </h3>
                    <button
                      onClick={() =>
                        handleDeleteWishlist(name, products.length > 0)
                      }
                      className="text-red-600 hover:text-red-800 transition-all"
                    >
                      <XCircle size={22} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {products.map(({ product, _id }) => (
                      <div
                        key={_id}
                        className="bg-[#F5FAF5] p-5 rounded-lg flex flex-col items-center text-center shadow-md border border-green-300"
                      >
                        <img
                          src={product.image[0]}
                          alt={product.productName}
                          className="w-32 h-32 object-cover rounded-lg border border-green-400 shadow-md"
                        />
                        <h3 className="text-xl font-semibold text-green-700 mt-3">
                          {product.productName}
                        </h3>
                        <p className="text-green-700">
                          💰 Price:{" "}
                          <span className="text-green-900">
                            ₹{product.price}
                          </span>
                        </p>
                        <button
                          onClick={() => handleRemoveItem(product._id, name)}
                          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md mt-3 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                Other Empty Wishlists
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishLists
                  .filter(({ products }) => products.length === 0)
                  .map(({ name }) => (
                    <div
                      key={name}
                      className="flex justify-between items-center bg-[#F5FAF5] p-3 rounded-lg border border-green-300 shadow-md"
                    >
                      <span className="text-green-700">{name}</span>
                      <button
                        onClick={() => handleDeleteWishlist(name, false)}
                        className="text-red-600 hover:text-red-800 transition-all"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-green-700">
            Your wishlist is empty. 💚
          </p>
        )}
        <BestSellerComponent />
      </div>
    </div>
  );
};

export default Wishlist;
