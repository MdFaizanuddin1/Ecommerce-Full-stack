import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { BASE_URL } from "../../routes/routes";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/product/getAll`)
      .then(response => setProducts(response.data.data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <motion.div 
            key={product._id} 
            className="p-4 shadow-md bg-white hover:shadow-xl transition"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={product.image[0]} 
              alt={product.productName} 
              className="w-full h-48 object-cover rounded-md cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            />
            <h2 className="text-xl font-semibold mt-3">{product.productName}</h2>
            <p className="text-lg text-green-600 font-bold">₹{product.price}</p>
            <div className="flex justify-between mt-6">
              <button 
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-500 transition-transform transform hover:scale-105"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>
              <button 
                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105"
              >
                <FaHeart className="text-red-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
