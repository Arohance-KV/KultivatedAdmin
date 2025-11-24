// src/redux/slices/VoucherSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "https://kk-server-lqp8.onrender.com";

// GET TOKEN
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// FETCH WRAPPER
const fetchAPI = async (url, method = "GET", body = null) => {
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }
  return data;
};

// =========================
//  CREATE VOUCHER
// =========================
export const createVoucher = createAsyncThunk(
  "voucher/createVoucher",
  async (voucherData, { rejectWithValue }) => {
    try {
      return await fetchAPI(`${BASE_URL}/voucher`, "POST", voucherData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// =========================
//  UPDATE VOUCHER
// =========================
export const updateVoucher = createAsyncThunk(
  "voucher/updateVoucher",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await fetchAPI(`${BASE_URL}/voucher/${id}`, "PUT", data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// =========================
//  DELETE VOUCHER
// =========================
export const deleteVoucher = createAsyncThunk(
  "voucher/deleteVoucher",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchAPI(`${BASE_URL}/voucher/${id}`, "DELETE");
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// =========================
//  GET ALL VOUCHERS
// =========================
export const getAllVouchers = createAsyncThunk(
  "voucher/getAllVouchers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAPI(`${BASE_URL}/voucher/all`);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// =========================
//  GET VOUCHER STATS
// =========================
export const getVoucherStats = createAsyncThunk(
  "voucher/getVoucherStats",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAPI(`${BASE_URL}/voucher/stats`);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// =========================
//  SLICE
// =========================
const VoucherSlice = createSlice({
  name: "voucher",
  initialState: {
    loading: false,
    error: null,
    success: null,
    vouchers: [],
    stats: {},
  },

  reducers: {
    clearVoucherState: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE ---------------------
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message;
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // UPDATE ---------------------
      .addCase(updateVoucher.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message;
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // DELETE ---------------------
      .addCase(deleteVoucher.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.message;
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // GET ALL ---------------------
      .addCase(getAllVouchers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllVouchers.fulfilled, (state, action) => {
         state.loading = false;
       
         // Extract actual vouchers array
         const vouchers = action.payload?.data?.vouchers;
       
         // Ensure array
         state.vouchers = Array.isArray(vouchers) ? vouchers : [];
       })
      .addCase(getAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // STATS ---------------------
      .addCase(getVoucherStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVoucherStats.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        state.stats =
          payload?.stats ||
          payload?.data ||
          payload?.data?.stats ||
          {};
      })
      .addCase(getVoucherStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearVoucherState } = VoucherSlice.actions;
export default VoucherSlice.reducer;
