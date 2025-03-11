import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../../redux/productSlice";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../redux/categorySlice";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.category);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!currentUser || currentUser?.data?.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    bestseller: "false",
    description: "",
    age: "",
    gender: "",
    stock: "",
    category: "",
    barcodeNumber: "",
    image: null,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    parentCategory: "",
    isActive: "active",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product, image: null });
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ isActive: category.isActive });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (key === "image" && value) {
        for (let i = 0; i < value.length; i++) {
          formData.append("image", value[i]);
        }
      } else if (value) {
        formData.append(key, value);
      }
    });
    dispatch(createProduct(formData));
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      const { image, ...updateData } = newProduct;
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== "")
      );
      dispatch(
        updateProduct({
          productId: editingProduct._id,
          updateData: filteredData,
        })
      );
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    dispatch(createCategory(newCategory));
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (editingCategory) {
      dispatch(
        updateCategory({
          id: editingCategory._id,
          isActive: newCategory.isActive,
        })
      );
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-400">
        Admin Dashboard
      </h1>
      <button
        className="p-4 bg-white rounded-full shadow-lg hover:scale-110 transition-transform relative group m-2"
        onClick={() => navigate("/admin-order-details")} // Replace with your function
      >
        <Package size={28} className="text-blue-500" />
        <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Get Orders Details
        </span>
      </button>

      {/* Create Product Form */}
      <form
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.productName}
          onChange={(e) =>
            setNewProduct({ ...newProduct, productName: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />

        <input
          type="text"
          placeholder="description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="gender"
          value={newProduct.gender}
          onChange={(e) =>
            setNewProduct({ ...newProduct, gender: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="number"
          placeholder="age"
          value={newProduct.age}
          onChange={(e) =>
            setNewProduct({ ...newProduct, age: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="number"
          placeholder="barcodeNumber"
          value={newProduct.barcodeNumber}
          onChange={(e) =>
            setNewProduct({ ...newProduct, barcodeNumber: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="number"
          placeholder="stock"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />

        {/* <select value={newProduct.bestseller} onChange={(e) => setNewProduct({...newProduct, bestseller: e.target.value})} className="border p-2 rounded mb-2 w-full"> */}
        <select
          defaultValue=""
          onChange={(e) =>
            setNewProduct({ ...newProduct, bestseller: e.target.value })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        >
          <option value="" disabled>
            BestSeller
          </option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setNewProduct({ ...newProduct, image: e.target.files })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition duration-300"
        >
          {editingProduct ? "Update Product" : "Create Product"}
        </button>
      </form>

      {/* Create Category Form */}
      <form
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        className="mb-6 bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Slug"
          value={newCategory.slug}
          onChange={(e) =>
            setNewCategory({ ...newCategory, slug: e.target.value })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          required
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Parent Category"
          value={newCategory.parentCategory}
          onChange={(e) =>
            setNewCategory({ ...newCategory, parentCategory: e.target.value })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        />
        {/* <input type="text" placeholder="Is active" value={newCategory.isActive} onChange={(e) => setNewCategory({...newCategory, isActive: e.target.value})} className="border p-2 rounded mb-2 w-full" /> */}
        <select
          defaultValue=""
          onChange={(e) =>
            setNewCategory({ ...newCategory, isActive: e.target.value })
          }
          className="border border-gray-600 p-3 rounded mb-3 w-full bg-gray-700 text-white focus:border-green-400 focus:ring focus:ring-green-500"
        >
          <option value="" disabled>
            Is Active
          </option>{" "}
          {/* Placeholder */}
          <option value="active">Active</option>
          <option value="inactive">In-active</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition duration-300"
        >
          {editingCategory ? "Update Category" : "Create Category"}
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-2xl font-semibold mt-6 text-green-300">Products</h2>
      <ul className=" space-y-3">
        {products.map((product) => (
          <li
            key={product._id}
            className="border border-gray-700 p-4 mb-3 flex flex-col sm:flex-row justify-between bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            {product.productName} - ${product.price}
            <div>
              <button
                onClick={() => handleEditProduct(product)}
                className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(deleteProduct(product._id))}
                className="bg-red-500 text-white px-3 py-1 ml-2 rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Category List */}
      <h2 className="text-2xl font-semibold mt-6 text-green-300">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category._id}
            className="border border-gray-700 p-4 mb-3 flex justify-between bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            {category.name}
            <div>
              <button
                onClick={() => handleEditCategory(category)}
                className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(deleteCategory(category._id))}
                className="bg-red-500 text-white px-3 py-1 ml-2 rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
