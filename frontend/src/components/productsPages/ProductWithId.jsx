import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../routes/routes";
import { addToCart, getCartData, removeCartItem } from "../../redux/cartSlice";
import {
  addToWishList,
  getAllWishLists,
  removeFromWishList,
} from "../../redux/wishListSlice";
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaHeart,
  FaTrash,
} from "react-icons/fa";
import AIAssistant from "../AiAssitant";

const ProductWithId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get cart and wishlist from Redux
  const { cartItems } = useSelector((state) => state.cart);
  const { wishLists } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.auth);
  const { wishListNames } = useSelector((state) => state.wishlist);

  // State for product details
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // UI State
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCartData());
    dispatch(getAllWishLists());
  }, [dispatch]);

  // Fetch product details from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/product/getSingleProduct?productId=${id}`
        );
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Check if product is in cart or wishlist
  const isInCart = cartItems.some((item) => item.product._id === id);
  const isInWishlist = wishLists.some((list) =>
    list.products.some((p) => p.product._id === id)
  );

  //   console.log(isInCart, isInWishlist);

  const handleAddToCart = () => {
    if (!currentUser) navigate("/login");
    dispatch(addToCart({ productId: id, quantity: 1 })).then(() => {
      dispatch(getCartData());
    });
  };

  const handleRemoveFromCart = () => {
    dispatch(removeCartItem({ productId: id }));
  };

  const handleWishlistToggle = () => {
    // Find the wishlist that contains this product
    const wishlistItem = wishLists.find((list) =>
      list.products.some((p) => p.product._id === id)
    );

    const wishlistName = wishlistItem ? wishlistItem.name : "favorites"; // Use default if not found

    if (isInWishlist) {
      dispatch(removeFromWishList({ productId: id, name: wishlistName }));
    } else {
      setShowWishlistModal(true); // Show wishlist selection modal
    }
  };

  // Handle adding to a selected wishlist
  const handleSelectWishlist = (wishlistName) => {
    dispatch(addToWishList({ productId: id, name: wishlistName }));
    setShowWishlistModal(false);
  };

  // Handle creating a new wishlist
  const handleCreateWishlist = () => {
    if (newWishlistName.trim() === "") return;
    dispatch(addToWishList({ productId: id, name: newWishlistName }));
    setShowWishlistModal(false);
    setNewWishlistName("");
  };

  // Auto-slide images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (product?.image.length > 1) {
        setActiveImage((prev) => (prev + 1) % product.image.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [product]);

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % product.image.length);
  };

  const handlePrevImage = () => {
    setActiveImage(
      (prev) => (prev - 1 + product.image.length) % product.image.length
    );
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (!product)
    return <p className="text-center text-red-500 mt-10">Product not found</p>;

  return (
    <div className="container mx-auto p-5 flex flex-col md:flex-row items-start gap-8">
      {/* Product Images Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        {/* Large Image Display */}
        <div className="relative w-full md:w-96 h-96 bg-gray-100 rounded-lg shadow-lg">
          <img
            src={product.image[activeImage]}
            alt={product.productName}
            className="w-full h-full object-cover rounded-lg"
          />
          {/* Navigation Buttons */}
          {product.image.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Small Image Previews */}
        <div className="flex mt-4 gap-2 overflow-x-auto">
          {product.image.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
                activeImage === index ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setActiveImage(index)}
            />
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 space-y-4">
        {product.bestseller && (
          <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full">
            Bestseller
          </span>
        )}

        <h2 className="text-2xl font-semibold">{product.productName}</h2>
        <p className="text-xl text-green-600 font-medium">₹{product.price}</p>
        <p className="text-gray-700">{product.description}</p>

        {isInCart && (
          <p className="text-gray-700">
            Quantity in Cart:{" "}
            <strong>
              {cartItems.find((item) => item.product._id === id)?.quantity}
            </strong>
          </p>
        )}

        <div className="flex gap-4 mt-5">
          {!isInCart ? (
            <button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 transition"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          ) : (
            <button
              onClick={handleRemoveFromCart}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 transition"
            >
              <FaTrash /> Remove from Cart
            </button>
          )}

          <button
            onClick={handleWishlistToggle}
            className={`px-4 py-2 rounded-md shadow-md transition ${
              isInWishlist
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            <FaHeart />{" "}
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* Wishlist Selection Modal */}
          {showWishlistModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded-lg w-96">
                <h3 className="text-lg font-semibold mb-3">
                  Select a Wishlist
                </h3>

                {wishListNames.length > 0 ? (
                  <div>
                    {wishListNames.map((list, i) => (
                      <button
                        key={i}
                        className="block w-full text-left p-2 hover:bg-gray-200 rounded-md"
                        onClick={() => handleSelectWishlist(list)}
                      >
                        {list}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">You don’t have any wishlists.</p>
                )}

                {/* Create New Wishlist */}
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Enter new wishlist name"
                    className="border p-2 rounded-md w-full"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                  />
                  <button
                    onClick={handleCreateWishlist}
                    className="bg-green-500 text-white px-3 py-1 rounded-md mt-2 w-full"
                  >
                    Create Wishlist
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowWishlistModal(false)}
                  className="mt-4 bg-gray-400 text-white px-3 py-1 rounded-md w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AIAssistant product={product} />
    </div>
  );
};

export default ProductWithId;
