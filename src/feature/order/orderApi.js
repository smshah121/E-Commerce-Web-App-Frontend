// src/features/order/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,  // Your backend URL
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),

    getAllOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    getMyOrder: builder.query({
      query: ()=> "orders/my",
      providesTags: ["Order"]
    }),

    getOrdersForAdmin: builder.query({
  query: () => '/orders/admin',
}),


    // features/order/orderApi.js
getBuyersByProduct: builder.query({
  query: (productId) => `/order-item/buyers/${productId}`,
}),
updateOrderStatus: builder.mutation({
  query: ({ orderId, status }) => ({
    url: `/orders/${orderId}/status`,
    method: 'PATCH',
    body: { status },
  }),
  invalidatesTags: ['Order'],
}),


  }),
});

export const {
  
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetOrdersForAdminQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetMyOrderQuery,
  useGetBuyersByProductQuery
} = orderApi;
