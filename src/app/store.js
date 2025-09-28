import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice"
import { authApi } from "../feature/auth/authApi";
import { userApi } from "../feature/user/userApi";
import { productApi } from "../feature/product/productApi";
import { orderApi } from "../feature/order/orderApi";
import cartReducer from '../feature/cart/cartSlice';
import searchReducer from "../feature/search/searchSlice"
export const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer,
        cart: cartReducer,
        [authApi.reducerPath]:authApi.reducer,
        [userApi.reducerPath]:userApi.reducer,
        [productApi.reducerPath]:productApi.reducer,
        [orderApi.reducerPath]:orderApi.reducer

    },

    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            productApi.middleware,
            orderApi.middleware
        )
})