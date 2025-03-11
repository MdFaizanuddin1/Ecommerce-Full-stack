// import { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const OrderPage = () => {
//   const user = useSelector((state) => state.auth.currentUser);
//   const userId = user?.data?._id;
//   const BASE_URL = "//api/v1/";

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleBuyNow = async (productId, quantity = 1) => {
//     if (!userId) return alert("Please log in first");
//     setLoading(true);
//     setMessage(null);

//     try {
//       const { data } = await axios.post(`${BASE_URL}buyNowOrder`, { productId, quantity }, { withCredentials: true });
//       const { order } = data.data;
//       processPayment(order);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Order creation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCartOrder = async () => {
//     if (!userId) return alert("Please log in first");
//     setLoading(true);
//     setMessage(null);

//     try {
//       const { data } = await axios.post(`${BASE_URL}cartOrder`, {}, { withCredentials: true });
//       const { order } = data.data;
//       processPayment(order);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Cart order failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processPayment = (order) => {
//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY,
//       amount: order.amount,
//       currency: "INR",
//       name: "Ecommerce Store",
//       description: "Purchase Order",
//       order_id: order.id,
//       handler: async (response) => {
//         try {
//           const verifyRes = await axios.post(`${BASE_URL}verify`, response, { withCredentials: true });
//           setMessage(verifyRes.data.message);
//         } catch (error) {
//           setMessage("Payment verification failed");
//         }
//       },
//       prefill: {
//         name: user?.data?.name || "",
//         email: user?.data?.email || "",
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Order Page</h2>
//       {message && <p className="text-red-500">{message}</p>}
//       <button
//         onClick={() => handleBuyNow("PRODUCT_ID_HERE")}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full mb-2"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Buy Now"}
//       </button>
//       <button
//         onClick={handleCartOrder}
//         className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Order from Cart"}
//       </button>
//     </div>
//   );
// };

// export default OrderPage;

import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom"; // If using React Router
import { BASE_URL } from "../../routes/routes";
import { useSelector } from "react-redux";
import loadRazorpayScript from "../../razor/razorPayScript";

const ProductPage = () => {
  const { productId } = useParams(); // Get productId from URL
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.currentUser);
  const userId = user?.data?._id;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/product/getSingleProduct?productId=${productId}`)
      .then((res) => {
        // console.log("res is", res.data.data),
        setProduct(res.data.data);
      })
      .catch((err) =>
        setMessage(err.response?.data?.message || "Failed to load product")
      );
  }, [productId]);

  const handleBuyNow = async () => {
    if (!userId) {
      alert("Please log in first");
      navigate("/login");
      return;
    }
    setLoading(true);
    setMessage(null);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/order/buyNowOrder`,
        { productId, quantity },
        { withCredentials: true }
      );

      const data = res.data.data;
      // console.log("data is ", data);
      // console.log("id is", data.order.id);

      const paymentObj = new window.Razorpay({
        key: import.meta.VITE_RAZORPAY_KEY,
        order_id: data.order.id,
        ...data,
        handler: function (response) {
          // console.log("response is ", response);

          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: user?.data?._id, // Include user ID
            products: [{ productId: productId, quantity }], // Array of products
            amount: data.order.amount / 100, // Include total amount
            currency: data.order.currency, // Include currency
          };
          // console.log("paymentData is ", paymentData);

          axios
            .post(`${BASE_URL}/order/verify`, paymentData, {
              withCredentials: true,
            })
            .then((res) => {
              // console.log("res data", res.data);
              if (res.data.success) {
                alert("payment successfully");
                setMessage(res.data.message);
                // console.log("message is", message);
                navigate("/");
              } else {
                setMessage("payment verification failed");
                alert("payment failed");
              }
            })
            .catch((err) => console.log("Verification is ", err));
        },
        prefill: {
          name: user?.data?.userName || "",
          email: user?.data?.email || "",
        },
      });
      paymentObj.open();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center">Loading product...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {message && <p className="text-red-500">{message}</p>}
      <img
        src={product.image[0]}
        alt={product.productName}
        className="w-full h-64 object-cover rounded-md"
      />
      <h2 className="text-3xl font-bold mt-4">{product.productName}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-xl font-bold text-blue-600">₹ {product.price}</p>
      {product.bestseller && (
        <span className="text-sm text-white bg-yellow-500 px-2 py-1 rounded-md">
          Bestseller
        </span>
      )}
      <div className="mt-4 flex items-center">
        <label className="mr-2 font-medium">Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-16 px-2 py-1 border rounded"
        />
      </div>
      <button
        onClick={handleBuyNow}
        className="bg-green-600 text-white px-4 py-2 rounded-lg w-full mt-4 flex items-center justify-center hover:bg-green-500 transition-transform transform hover:scale-105"
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
        <ShoppingCart className="ml-2" size={18} />
      </button>
    </div>
  );
};

export default ProductPage;
