import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

// ========== AUTH HELPER ==========
const getAuthHeaders = () => {
  let token = localStorage.getItem("accessToken") 
    || localStorage.getItem("authToken")
    || localStorage.getItem("accessToken");
  
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      token = user?.token || user?.accessToken || user?.authToken;
    } catch (e) {
      console.log("Could not parse user object");
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
   CREATE MOBILE BANNER (POST /mobile-banner)
=============================== */
export const createMobileBanner = createAsyncThunk(
  "mobileBanner/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/mobile-banner`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Create mobile banner error:", data);
        return rejectWithValue(data?.message || "Failed to create mobile banner");
      }

      // Return the single banner from data.data
      return data.data;
    } catch (err) {
      console.error("Create mobile banner exception:", err);
      return rejectWithValue(err.message);
    }
  }
);

/* ===============================
   GET ALL MOBILE BANNERS (GET /mobile-banner)
=============================== */
export const getAllMobileBanners = createAsyncThunk(
  "mobileBanner/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/mobile-banner`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Get mobile banners error:", data);
        return rejectWithValue(data?.message || "Failed to fetch mobile banners");
      }

      // API returns { data: [...], statusCode: 200, success: true }
      // So extract the array from data.data
      console.log("API Response:", data);
      return Array.isArray(data.data) ? data.data : [];
    } catch (err) {
      console.error("Get mobile banners exception:", err);
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   GET SINGLE MOBILE BANNER (GET /mobile-banner/:id)
================================= */
export const getMobileBannerById = createAsyncThunk(
  "mobileBanner/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/mobile-banner/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to fetch mobile banner");
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   UPDATE MOBILE BANNER (PATCH /mobile-banner/:id)
================================= */
export const updateMobileBanner = createAsyncThunk(
  "mobileBanner/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/mobile-banner/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Update mobile banner error:", data);
        return rejectWithValue(data?.message || "Failed to update mobile banner");
      }

      return data.data;
    } catch (err) {
      console.error("Update mobile banner exception:", err);
      return rejectWithValue(err.message);
    }
  }
);

/* =================================
   DELETE MOBILE BANNER (DELETE /mobile-banner/:id)
================================= */
export const deleteMobileBanner = createAsyncThunk(
  "mobileBanner/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/mobile-banner/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(data?.message || "Failed to delete mobile banner");
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

const mobileBannerSlice = createSlice({
  name: "mobileBanner",
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
    clearSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createMobileBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMobileBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
        state.success = true;
      })
      .addCase(createMobileBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

    // GET ALL
      .addCase(getAllMobileBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMobileBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(getAllMobileBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.banners = [];
      })

    // GET BY ID
      .addCase(getMobileBannerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMobileBannerById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBanner = action.payload;
      })
      .addCase(getMobileBannerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // UPDATE
      .addCase(updateMobileBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMobileBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
        state.singleBanner = action.payload;
        state.success = true;
      })
      .addCase(updateMobileBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

    // DELETE
      .addCase(deleteMobileBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMobileBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((b) => b._id !== action.payload._id);
        state.success = true;
      })
      .addCase(deleteMobileBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = mobileBannerSlice.actions;
export default mobileBannerSlice.reducer;