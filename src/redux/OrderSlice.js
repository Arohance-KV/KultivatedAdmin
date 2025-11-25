// src/redux/slices/OrderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Get Token
const getToken = () => localStorage.getItem("accessToken");

// ===================== 1. GET ALL ORDERS ======================
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/order/admin/all?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== 2. GET ORDER BY ID ======================
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/order/admin/order/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== 3. UPDATE ORDER STATUS ======================
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/order/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================== 4. UPDATE TRACKING NUMBER =====================
export const updateTrackingNumber = createAsyncThunk(
  "orders/updateTracking",
  async ({ id, trackingNumber }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/order/admin/${id}/tracking`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ trackingNumber }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===================================================================
// REDUX SLICE
// ===================================================================
const OrderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    singleOrder: null,
    total: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    // =============== FETCH ALL ORDERS =================
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.limit = action.payload.limit;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load orders";
      });

    // =============== FETCH ORDER BY ID =================
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load order";
      });

    // =============== UPDATE ORDER STATUS ===============
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.singleOrder = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update order status";
      });

    // =============== UPDATE TRACKING NUMBER ============
    builder
      .addCase(updateTrackingNumber.fulfilled, (state, action) => {
        state.singleOrder = action.payload;
      })
      .addCase(updateTrackingNumber.rejected, (state, action) => {
        state.error = action.payload || "Failed to update tracking number";
      });
  },
});

export default OrderSlice.reducer;
