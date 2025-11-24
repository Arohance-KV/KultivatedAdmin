// src/redux/CategorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Helper to handle fetch responses
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Create Category with File Upload - POST /category
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category`, {
        method: 'POST',
        // Don't set Content-Type header - let browser set it with boundary
        body: formData, // FormData object
      });
      return await handleResponse(response);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get All Categories - GET /category
export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category`, {
        method: 'GET',
      });
      return await handleResponse(response);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update Category with File Upload - PUT /category/:categoryId
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}`, {
        method: 'PUT',
        // Don't set Content-Type header for FormData
        body: updateData, // FormData object
      });
      return await handleResponse(response);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete Category - DELETE /category/:categoryId
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add Product to Category - POST /category/:categoryId/product
export const addProductToCategory = createAsyncThunk(
  'category/addProductToCategory',
  async ({ categoryId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      const data = await handleResponse(response);
      return { categoryId, productId, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get Products in a Category - GET /category/:categoryId/products
export const getProductsByCategory = createAsyncThunk(
  'category/getProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}/products`);
      const data = await handleResponse(response);
      return { categoryId, products: data.data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Remove Product from Category - DELETE /category/:categoryId/products/:productId
export const removeProductFromCategory = createAsyncThunk(
  'category/removeProductFromCategory',
  async ({ categoryId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/category/${categoryId}/products/${productId}`,
        { method: 'DELETE' }
      );
      await handleResponse(response);
      return { categoryId, productId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Initial State
const initialState = {
  categories: [],
  categoryProducts: {},
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.categories.push(action.payload.data);
        }
        state.successMessage = action.payload?.message || 'Category created successfully';
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create category';
      });

    // Get Categories
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.data || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        state.categories = [];
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload?.data;
        if (updated?._id) {
          const index = state.categories.findIndex((c) => c._id === updated._id);
          if (index !== -1) {
            state.categories[index] = updated;
          }
        }
        state.successMessage = action.payload?.message || 'Category updated successfully';
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update category';
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Try to get deleted id from response, fallback to arg we sent into thunk
        const deletedId =
          action.payload?.data?.deletedCategory?._id ?? action.meta?.arg;

        if (deletedId) {
          state.categories = state.categories.filter((c) => c._id !== deletedId);
        }
        state.successMessage = action.payload?.message || 'Category deleted successfully';
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete category';
      });

    // Get Products by Category
    builder
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryProducts[action.payload.categoryId] = action.payload.products;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });

    // Remove Product from Category
    builder
      .addCase(removeProductFromCategory.fulfilled, (state, action) => {
        const { categoryId, productId } = action.payload;
        if (state.categoryProducts[categoryId]) {
          state.categoryProducts[categoryId] = state.categoryProducts[categoryId].filter(
            (p) => p._id !== productId
          );
        }
      });
  },
});

export const { clearMessages } = categorySlice.actions;
export default categorySlice.reducer;
