import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

/* =====================================================
                 UPLOAD PRODUCT IMAGE API
   ===================================================== */
export const uploadProductImage = createAsyncThunk(
  "product/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${BASE_URL}/product/upload-image`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data; // array of image URLs
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= CREATE PRODUCT =======================
export const createProduct = createAsyncThunk(
  "product/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= GET ALL PRODUCTS =======================
export const getAllProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product`);
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= GET PRODUCT BY ID =======================
export const getProductById = createAsyncThunk(
  "product/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${id}`);
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= GET PRODUCT BY PRODUCT-ID =======================
export const getProductByProductId = createAsyncThunk(
  "product/getByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/by-product-id/${productId}`);
      const data = await res.json();

      if (!res.ok) return rejectWithValue(data);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= UPDATE PRODUCT =======================
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= DELETE PRODUCT =======================
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= DELETE MULTIPLE PRODUCTS =======================
export const deleteMultipleProducts = createAsyncThunk(
  "product/deleteMultiple",
  async (ids, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/delete-multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= MAP IMAGES =======================
export const mapImages = createAsyncThunk(
  "product/mapImages",
  async (imageList, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/map-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageList }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= UPDATE ALL PRICES =======================
export const updateAllPrices = createAsyncThunk(
  "product/updateAllPrices",
  async (body, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/prices/update-all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= SET BASE PRICES =======================
export const setBasePrices = createAsyncThunk(
  "product/setBasePrices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/prices/set-base`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= ADD VARIANT =======================
export const addVariant = createAsyncThunk(
  "product/addVariant",
  async ({ productId, body }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/product/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================= SLICE =======================
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    uploadedImages: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearProductMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    const thunks = [
      uploadProductImage,
      createProduct,
      getAllProducts,
      getProductById,
      getProductByProductId,
      updateProduct,
      deleteProduct,
      deleteMultipleProducts,
      mapImages,
      updateAllPrices,
      setBasePrices,
      addVariant,
    ];

    thunks.forEach((th) => {
      builder
        .addCase(th.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(th.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;

          if (th === getAllProducts) state.products = action.payload;
          if (th === getProductById || th === getProductByProductId)
            state.product = action.payload;

          if (th === uploadProductImage)
            state.uploadedImages = action.payload; // array of URLs
        })
        .addCase(th.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Something went wrong";
        });
    });
  },
});

export const { clearProductMessages } = productSlice.actions;
export default productSlice.reducer;
