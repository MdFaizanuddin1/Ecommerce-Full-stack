import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";

import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";
import { store } from "./app/store.js";
import Signup from "./components/auth/SignUp.jsx";
import Login from "./components/auth/Login.jsx";
import HomePage from "./components/pages/HomePage.jsx";
import ProductWithId from "./components/productsPages/ProductWithId.jsx";
import Cart from "./components/Cart.jsx";
import Wishlist from "./components/Wishlist.jsx";
import ProductWithField from "./components/productsPages/ProductWithField.jsx";
import ProfilePage from "./components/pages/Profile.jsx";
import SearchPage from "./components/productsPages/SearchPage.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import OrderPage from "./components/pages/OrderPage.jsx";
import OrderDetails from "./components/pages/OrderDetails.jsx";
import AdminOrderDetails from "./components/admin/AdminOrderDetails.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<HomePage />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />

      {/* product pages */}
      <Route path="product/:id" element={<ProductWithId />} />
      <Route path="products/:category" element={<ProductWithField />} />
      <Route path="/search" element={<SearchPage />} />

      {/* cart component */}
      <Route path="cart" element={<Cart />} />

      {/* wishlist component */}
      <Route path="wish" element={<Wishlist />} />
      <Route path="order/:productId" element={<OrderPage />} />
      <Route path="order-details" element={<OrderDetails />} />
      <Route path="admin-order-details" element={<AdminOrderDetails />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
