import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sellerApplicationApi = createApi({
  reducerPath: "sellerApplicationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["SellerApplication"],

  endpoints: (builder) => ({
    // Customer submits seller application
    createSellerApplication: builder.mutation({
      query: (body) => ({
        url: "seller-applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SellerApplication"],
    }),

    // Admin gets all seller applications
    getSellerApplications: builder.query({
      query: () => "seller-applications",
      providesTags: ["SellerApplication"],
    }),

    // Admin approves application
    approveSellerApplication: builder.mutation({
      query: (id) => ({
        url: `seller-applications/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["SellerApplication"],
    }),

    // Admin rejects application
    rejectSellerApplication: builder.mutation({
      query: (id) => ({
        url: `seller-applications/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["SellerApplication"],
    }),
  }),
});

export const {
  useCreateSellerApplicationMutation,
  useGetSellerApplicationsQuery,
  useApproveSellerApplicationMutation,
  useRejectSellerApplicationMutation,
} = sellerApplicationApi;