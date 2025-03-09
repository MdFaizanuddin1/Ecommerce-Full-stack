import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BestSellerComponent from "./BestSellerComponent";
import { BASE_URL } from "../../routes/routes";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/product/get?name=${name}`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [name]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Search Results for "{name}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200"
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
                <span className="text-green-500 font-bold">Bestseller</span>
              )}
              <p className="text-gray-500 mt-1">{product.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-gray-600">No items matched your search.</p>
          <h3 className="text-xl font-semibold mt-4">
            Check out these top-rated picks!
          </h3>
          <BestSellerComponent />
        </div>
      )}
    </div>
  );
}
