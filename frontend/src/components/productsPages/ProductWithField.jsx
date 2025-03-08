import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../routes/routes";

const ProductList = () => {
  const { category } = useParams();
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
    <div className="min-h-screen bg-[#E3EDE3] text-[#0D2518] flex justify-center items-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl border border-green-500 p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-600 border-b border-green-500 pb-3 text-center">
          {category === "bestseller"
            ? "🔥 Bestsellers"
            : `🛍 ${category} Collection`}
        </h2>
        {loading ? (
          <p className="text-center text-green-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#F5FAF5] p-5 rounded-lg flex flex-col items-center text-center shadow-md border border-green-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:border-green-400 transition-all duration-300"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.image[0]}
                  alt={product.productName}
                  className="w-40 h-40 object-cover rounded-lg border border-green-400 shadow-md"
                />
                <h3 className="text-xl font-semibold text-green-700 mt-3">
                  {product.productName}
                </h3>
                <p className="text-green-700">
                  💰 Price:{" "}
                  <span className="text-green-900">₹{product.price}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-green-700">No products found. 🛍</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
