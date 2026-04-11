import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
    reducerPath:"paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders:(headers)=> {
            const token = localStorage.getItem("token")
            if(token){
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }

    }),
    endpoints:(builder)=>({
        createPayment:builder.mutation({
            query:(data)=>({
                url:"payment/create-checkout-session",
                method:"POST",
                body:data
            })
        }),
        getSuccessPayment:builder.query({
            query:()=> "payment/success"
        })
    })
})

export const {useCreatePaymentMutation, useGetSuccessPaymentQuery} = paymentApi