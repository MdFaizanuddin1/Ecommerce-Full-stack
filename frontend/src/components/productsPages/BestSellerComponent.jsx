import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../routes/routes";

const BestSellerComponent = () => {
  const category = "bestseller";
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const field = category === "bestseller" ? "bestseller" : "gender";
        const value = category === "bestseller" ? true : category;

        const response = await axios.post(`${BASE_URL}/product/getField`, {
          field,
          value,
        });

        setProducts(response.data.data);
      } catch (err) {
        setError("Failed to fetch products", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-700 border-b border-green-400 pb-2 text-center">
        🔥 Bestsellers You May Like
      </h2>

      {loading ? (
        <p className="text-center text-green-500 mt-4">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-4">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image[0]}
                alt={product.productName}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">
                {product.productName}
              </h3>
              <p className="text-gray-600">Price: ₹{product.price}</p>
              {product.bestseller && (
                <span className="text-sm text-white bg-green-500 px-2 py-1 rounded-full mt-2 inline-block">
                  🔥 Bestseller
                </span>
              )}
              <p className="text-gray-700 text-sm mt-2">
                {product.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">
          No bestsellers found. 🛍
        </p>
      )}
    </div>
  );
};

export default BestSellerComponent;
