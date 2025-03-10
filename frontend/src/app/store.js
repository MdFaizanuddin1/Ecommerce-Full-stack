import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import cartReducer from "../redux/cartSlice";
import wishlistReducer from "../redux/wishListSlice";
import category from "../redux/categorySlice";
import products from '../redux/productSlice'
export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    category,
    products,
  },
});
