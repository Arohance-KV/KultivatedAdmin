import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "https://kk-server-lqp8.onrender.com";

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

// GET ALL MOBILE BANNERS
export const getAllMobileBanners = createAsyncThunk(
  "mobileBanner/getAllMobileBanners",
  async (_, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/mobile-banner`;
      console.log("Fetching from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const jsonData = await response.json();
      console.log("Fetched data:", jsonData);
      return jsonData.data || [];
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue(error.message || "Failed to fetch banners");
    }
  }
);

// CREATE MOBILE BANNER
export const createMobileBanner = createAsyncThunk(
  "mobileBanner/createMobileBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/mobile-banner`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create banner");
      }
      
      const jsonData = await response.json();
      return jsonData.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create banner");
    }
  }
);

// UPDATE MOBILE BANNER
export const updateMobileBanner = createAsyncThunk(
  "mobileBanner/updateMobileBanner",
  async (bannerData, { rejectWithValue }) => {
    try {
      const { _id } = bannerData;
      const url = `${API_BASE_URL}/mobile-banner/`;
      console.log("Updating banner at:", url, "with data:", bannerData);
      
      const response = await fetch(url, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData),
      });
      
      console.log("Update response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const jsonData = await response.json();
      console.log("Updated banner:", jsonData);
      return jsonData.data;
    } catch (error) {
      console.error("Update mobile banner exception:", error);
      return rejectWithValue(error.message || "Failed to update banner");
    }
  }
);

// DELETE MOBILE BANNER
export const deleteMobileBanner = createAsyncThunk(
  "mobileBanner/deleteMobileBanner",
  async (id, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/mobile-banner/${id}`;
      console.log("Deleting banner at:", url);
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      
      console.log("Delete response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const jsonData = await response.json();
      return jsonData.data;
    } catch (error) {
      console.error("Delete mobile banner exception:", error);
      return rejectWithValue(error.message || "Failed to delete banner");
    }
  }
);

// ==================== INITIAL STATE ====================

const initialState = {
  banners: [],
  loading: false,
  error: null,
  success: false,
};

// ==================== SLICE ====================

const mobileBannerSlice = createSlice({
  name: "mobileBanner",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // GET ALL BANNERS
    builder
      .addCase(getAllMobileBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMobileBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
        state.success = true;
      })
      .addCase(getAllMobileBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // CREATE BANNER
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
      });

    // UPDATE BANNER
    builder
      .addCase(updateMobileBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMobileBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateMobileBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // DELETE BANNER
    builder
      .addCase(deleteMobileBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMobileBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(b => b._id !== action.payload._id);
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