import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../routes/routes";

// Async thunks
export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/getAll`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getSingleCategory = createAsyncThunk(
  "category/getSingle",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/getSingle/${id}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const response = await axios.post(
        `${BASE_URL}/category/create`,
        categoryData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${auth.currentUser?.token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const response = await axios.delete(`${BASE_URL}/category/delete/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${auth.currentUser?.token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, isActive }, thunkAPI) => {
    try {
      if (!["active", "inactive"].includes(isActive)) {
        throw new Error("Invalid status value");
      }
      const { auth } = thunkAPI.getState();
      const response = await axios.patch(
        `${BASE_URL}/category/update/${id}`,
        { isActive },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${auth.currentUser?.token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload._id
        );
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
      });
  },
});

export default categorySlice.reducer;
