import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";
import cartReducer from "../redux/cartSlice";
import wishlistReducer from "../redux/wishListSlice";
export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
