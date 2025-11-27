// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import collectionReducer from './CollectionSlice';
import categoryReducer from './CategorySlice';
import voucherReducer from "./VoucherSlice"; 
import desktopBannerReducer from './DesktopBannerSlice';
import discountReducer  from './DiscountSlice';  
import orderReducer from './OrderSlice';
import productReducer  from './ProductSlice';
import blogReducer from './BlogSlice';
import UploadImgReducer from './UploadImgSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionReducer,
    category: categoryReducer,
    desktopBanner: desktopBannerReducer,
    voucher: voucherReducer,
    discount: discountReducer,
    orders: orderReducer,
    products: productReducer,
    blogs: blogReducer,
    upload: UploadImgReducer,
  },
});

export default store;
