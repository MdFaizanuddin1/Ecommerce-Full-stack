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
    <div className="mt-8 p-4 bg-[#F5FAF5] rounded-lg shadow-md border border-green-300">
      <h2 className="text-xl font-bold text-green-700 border-b border-green-400 pb-2 text-center">
        🔥 Bestsellers You May Like
      </h2>

      {loading ? (
        <p className="text-center text-green-500">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-3 rounded-lg flex flex-col items-center text-center shadow-sm border border-green-200 cursor-pointer 
                           hover:scale-105 hover:shadow-lg hover:border-green-400 transition-all duration-300"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={product.image[0]}
                alt={product.productName}
                className="w-24 h-24 object-cover rounded-lg border border-green-300 shadow-sm"
              />
              <h3 className="text-sm font-semibold text-green-700 mt-2">
                {product.productName}
              </h3>
              <p className="text-xs text-green-700">
                💰 Price:{" "}
                <span className="text-green-900 font-bold">
                  ₹{product.price}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-green-700 mt-2">
          No bestsellers found. 🛍
        </p>
      )}
    </div>
  );
};

export default BestSellerComponent;
