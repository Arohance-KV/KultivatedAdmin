import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Base URL
const BASE_URL = 'https://kk-server-lqp8.onrender.com';

export const fetchCollections = createAsyncThunk(
  'collections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        return rejectWithValue(result || { message: 'Failed to fetch collections' });
      }
      return result.data; // Array of collections
    } catch (error) {
      return rejectWithValue({ message: error?.message || 'Network error: Failed to fetch collections' });
    }
  }
);

export const createCollection = createAsyncThunk(
  'collections/create',
  async (collectionData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return rejectWithValue(result || { message: 'Failed to create collection' });
      }
      return result.data; // Single collection object
    } catch (error) {
      return rejectWithValue({ message: error?.message || 'Network error: Failed to create collection' });
    }
  }
);

export const updateCollection = createAsyncThunk(
  'collections/update',
  async ({ id, collectionData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return rejectWithValue(result || { message: 'Failed to update collection' });
      }
      return result.data; // Updated collection object
    } catch (error) {
      return rejectWithValue({ message: error?.message || 'Network error: Failed to update collection' });
    }
  }
);

export const addImagesToCollection = createAsyncThunk(
  'collections/addImages',
  async ({ id, imageUrls }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrls // Note: API expects "imageUrl" key for array
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return rejectWithValue(result || { message: 'Failed to add images' });
      }
      return result.data; // Updated collection object
    } catch (error) {
      return rejectWithValue({ message: error?.message || 'Network error: Failed to add images' });
    }
  }
);

export const removeImageFromCollection = createAsyncThunk(
  'collections/removeImage',
  async ({ id, imageUrl }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        return rejectWithValue(result || { message: 'Failed to remove image' });
      }
      return result.data; // Updated collection object
    } catch (error) {
      return rejectWithValue({ message: error?.message || 'Network error: Failed to remove image' });
    }
  }
);

const initialState = {
  collections: [],
  loading: false,
  error: null,
};

const collectionSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Create
      .addCase(createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload);
        state.loading = false;
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Update
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex((col) => col._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Add images
      .addCase(addImagesToCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImagesToCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex((col) => col._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(addImagesToCollection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Remove image
      .addCase(removeImageFromCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeImageFromCollection.fulfilled, (state, action) => {
        const index = state.collections.findIndex((col) => col._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(removeImageFromCollection.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearError } = collectionSlice.actions;
export default collectionSlice.reducer;