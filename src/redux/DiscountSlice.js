import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const local = "https://kk-server-lqp8.onrender.com"; // backend base URL

const getToken = () => localStorage.getItem("accessToken");

// Helper fetch wrapper
const fetchAPI = async (url, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const options = { method, headers };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) throw data;

  return data;
};

// ======================== CREATE ========================
export const createDiscount = createAsyncThunk(
  "discount/createDiscount",
  async (formData, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount`, "POST", formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== UPDATE ========================
export const updateDiscount = createAsyncThunk(
  "discount/updateDiscount",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/${id}`, "PUT", formData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== DELETE ========================
export const deleteDiscount = createAsyncThunk(
  "discount/deleteDiscount",
  async (id, thunkAPI) => {
    try {
      await fetchAPI(`${local}/discount/${id}`, "DELETE");
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== GET ALL ========================
export const getAllDiscounts = createAsyncThunk(
  "discount/getAllDiscounts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/all`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== GET EXPIRED ========================
export const getExpiredDiscounts = createAsyncThunk(
  "discount/getExpiredDiscounts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/expired`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== GET STATS ========================
export const getDiscountStats = createAsyncThunk(
  "discount/getDiscountStats",
  async (id, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/${id}/stats`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== GET ACTIVE ========================
export const getActiveDiscounts = createAsyncThunk(
  "discount/getActiveDiscounts",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/active`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== GET BY CODE ========================
export const getDiscountByCode = createAsyncThunk(
  "discount/getDiscountByCode",
  async (code, thunkAPI) => {
    try {
      const res = await fetchAPI(`${local}/discount/code/${code}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// ======================== SLICE ========================
const discountSlice = createSlice({
  name: "discount",
  initialState: {
    discounts: [],
    expiredDiscounts: [],
    activeDiscounts: [],
    discountStats: null,
    discountByCode: null,

    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts.push(action.payload);
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = state.discounts.map((d) =>
          d._id === action.payload._id ? action.payload : d
        );
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteDiscount.fulfilled, (state, action) => {
        state.discounts = state.discounts.filter(
          (d) => d._id !== action.payload
        );
      })

      // GET ALL
      .addCase(getAllDiscounts.fulfilled, (state, action) => {
        state.discounts = action.payload?.discounts || [];
      })

      // EXPIRED
      .addCase(getExpiredDiscounts.fulfilled, (state, action) => {
        state.expiredDiscounts = action.payload?.discounts || [];
      })

      // STATS
      .addCase(getDiscountStats.fulfilled, (state, action) => {
        state.discountStats = action.payload;
      })

      // ACTIVE
      .addCase(getActiveDiscounts.fulfilled, (state, action) => {
        state.activeDiscounts = action.payload || [];
      })

      // BY CODE
      .addCase(getDiscountByCode.fulfilled, (state, action) => {
        state.discountByCode = action.payload;
      });
  },
});

export default discountSlice.reducer;
