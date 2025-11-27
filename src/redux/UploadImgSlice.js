// src/redux/UploadImgSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

export const uploadImageAsync = createAsyncThunk(
  "upload/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // MUST match Postman

      const response = await fetch(`${BASE_URL}/product/upload-image`, {
        method: "POST",
        body: formData, // browser auto-sets Content-Type + boundary
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to upload image");
      }
      return data.data; // array of URLs
    } catch {
      return rejectWithValue("Network error: unable to reach upload server");
    }
  }
);

const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    imageUrls: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUploadedImages: (state) => {
      state.imageUrls = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImageAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImageAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrls = action.payload;
      })
      .addCase(uploadImageAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearUploadedImages } = uploadSlice.actions;
export default uploadSlice.reducer;
