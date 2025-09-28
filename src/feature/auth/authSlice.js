import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem("role") || null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state,action)=> {
            const { token, role } = action.payload;
            state.token = token;
            state.role = role;
            localStorage.setItem('token', token);
            localStorage.setItem("role", role);
        },
        clearToken: (state)=> {
            state.token=null
            state.role=null
            localStorage.removeItem('token')
            localStorage.removeItem("role")

        }
    }

})

export const {setToken, clearToken}= authSlice.actions

export const selectToken = (state) => state.auth.token
export const selectRole = (state)=> state.auth.role
export default authSlice.reducer