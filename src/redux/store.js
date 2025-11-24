// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import collectionReducer from './CollectionSlice';
import categoryReducer from './CategorySlice';
import voucherReducer from "./VoucherSlice"; 
import desktopBannerReducer from './DesktopBannerSlice';
import discountReducer  from './DiscountSlice';  


export const store = configureStore({
  reducer: {
    auth: authReducer,
    collections: collectionReducer,
    category: categoryReducer,
    desktopBanner: desktopBannerReducer,
    voucher: voucherReducer,
    discount: discountReducer,
  },
});

export default store;
