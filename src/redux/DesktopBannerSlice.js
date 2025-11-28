import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

// ========== AUTH HELPER ==========
const getAuthHeaders = () => {
  // Try multiple possible token keys
  let token = localStorage.getItem("accessToken") 
    || localStorage.getItem("authToken")
    || localStorage.getItem("accessToken");
  
  // If token is stored as user object, parse it
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      token = user?.token || user?.accessToken || user?.authToken;
    } catch (e) {
      console.log("Could not parse user object", e);
    }
  }

  if (!token) {
    console.warn("No authentication token found");
  }

  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
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
      
      if (!res.ok) {
        console.error("Create banner error:", data);
        return rejectWithValue(data?.message || "Failed to create banner");
      }

      return data.data;
    } catch (err) {
      console.error("Create banner exception:", err);
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
      
      if (!res.ok) {
        console.error("Get banners error:", data);
        return rejectWithValue(data?.message || "Failed to fetch banners");
      }

      return data.data;
    } catch (err) {
      console.error("Get banners exception:", err);
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
      
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to fetch banner");
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   UPDATE BANNER (PATCH /banner)
================================= */
export const updateDesktopBanner = createAsyncThunk(
  "desktopBanner/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/banner`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Update banner error:", data);
        return rejectWithValue(data?.message || "Failed to update banner");
      }

      return data.data;
    } catch (err) {
      console.error("Update banner exception:", err);
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
      
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to delete banner");
      }

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
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createDesktopBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDesktopBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
        state.success = true;
      })
      .addCase(createDesktopBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

    // GET ALL
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

    // UPDATE
      .addCase(updateDesktopBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDesktopBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.success = true;
      })
      .addCase(updateDesktopBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

    // DELETE
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

export const { clearError } = desktopBannerSlice.actions;
export default desktopBannerSlice.reducer;