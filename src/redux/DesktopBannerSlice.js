import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

// Function to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

/* ===============================
   CREATE BANNER (POST /banner)
=============================== */
export const createDesktopBanner = createAsyncThunk(
  "desktopBanner/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===============================
   GET ALL BANNERS (GET /banner)
=============================== */
export const getAllDesktopBanners = createAsyncThunk(
  "desktopBanner/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   GET SINGLE BANNER (GET /banner/:id)
================================= */
export const getDesktopBannerById = createAsyncThunk(
  "desktopBanner/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   UPDATE BANNER (PATCH /banner/:id)
================================= */
export const updateDesktopBanner = createAsyncThunk(
  "desktopBanner/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   DELETE BANNER (DELETE /banner/:id)
================================= */
export const deleteDesktopBanner = createAsyncThunk(
  "desktopBanner/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===========================
    SLICE
=========================== */

const desktopBannerSlice = createSlice({
  name: "desktopBanner",
  initialState: {
    banners: [],
    singleBanner: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createDesktopBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDesktopBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createDesktopBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllDesktopBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDesktopBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(getAllDesktopBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateDesktopBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesktopBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateDesktopBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteDesktopBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDesktopBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((b) => b._id !== action.payload._id);
      })
      .addCase(deleteDesktopBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default desktopBannerSlice.reducer;
