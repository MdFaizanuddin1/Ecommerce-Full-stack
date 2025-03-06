import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../routes/routes";

// Async Thunks for Wishlist Operations
export const addToWishList = createAsyncThunk(
  "wishlist/addToWishList",
  async ({ productId, name = "favorites" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/wishList/add/${productId}`,
        { name },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getWishList = createAsyncThunk(
  "wishlist/getWishList",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/wishList/get?name=${name}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllWishLists = createAsyncThunk(
  "wishlist/getAllWishLists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/wishList/getAll`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFromWishList = createAsyncThunk(
  "wishlist/removeFromWishList",
  async ({ productId, name = "favorites" }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/wishList/remove/${productId}`,
        { name },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWishList = createAsyncThunk(
  "wishlist/deleteWishList",
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/wishList/delete`, {
        data: { name },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Wishlist Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishLists: [],
    wishListNames: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllWishLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllWishLists.fulfilled, (state, action) => {
        state.loading = false;
        state.wishLists = action.payload.data;
        state.wishListNames = action.payload.data.map((item) => item.name);
      })
      .addCase(getAllWishLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.wishLists = [...state.wishLists, action.payload.data];
      })
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        state.wishLists = state.wishLists.map((wishlist) =>
          wishlist.name === action.payload.data.name
            ? action.payload.data
            : wishlist
        );
      })
      .addCase(deleteWishList.fulfilled, (state, action) => {
        state.wishLists = state.wishLists.filter(
          (wishlist) => wishlist.name !== action.payload.data.name
        );
      });
  },
});

export default wishlistSlice.reducer;
