import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../routes/routes";

// Fetch all products
export const getAllProducts = createAsyncThunk(
  "products/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/product/getAll`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch a single product
export const getSingleProduct = createAsyncThunk(
  "products/getSingle",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/product/getSingleProduct`,
        { params:productId }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a product
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/product/addProduct`,
        productData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ productId, updateData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/product/edit/${productId}`,
        updateData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/product/delete/${productId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.data;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.product = action.payload.data;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((prod) =>
          prod._id === action.payload.data._id ? action.payload.data : prod
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (prod) => prod._id !== action.payload.data._id
        );
      });
  },
});

export default productSlice.reducer;
