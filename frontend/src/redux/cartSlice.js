import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../routes/routes";

// Async Thunks for Cart Operations
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/addToCart`,
        {
          productId,
          quantity,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCartData = createAsyncThunk(
  "cart/getCartData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart/getCartData`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/cart/updateCart`,
        {
          productId,
          quantity,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/removeCartItem`, {
        data: { productId },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/cart/clearCart`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.data.items;
        state.totalPrice = action.payload.data.totalPrice;
      })
      .addCase(getCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
        state.totalPrice = action.payload.data.totalPrice;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cartItems = action.payload.data.items;
        state.totalPrice = action.payload.data.totalPrice;
      })
      // .addCase(removeCartItem.fulfilled, (state, action) => {
      //   // ✅ Ensure the removed item is gone immediately
      //   state.cartItems = action.payload.data.items;
      //   state.totalPrice = action.payload.data.totalPrice;
      // })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload.data === null) {
          // If cart is deleted (last item removed), reset state
          state.cartItems = [];
          state.totalPrice = 0;
        } else {
          state.cartItems = action.payload.data.items;
          state.totalPrice = action.payload.data.totalPrice;
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
        state.totalPrice = 0;
      });
  },
});

export default cartSlice.reducer;
