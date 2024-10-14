import { createSlice } from '@reduxjs/toolkit'
import { User } from '../../types/auth';



interface AuthState {
    isLoading: boolean,
    isLogin: boolean,
    user: User | null
}

const initialState: AuthState = {
    isLoading: true,
    isLogin: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state) => {
            state.isLogin = true;
        },
        loadUserSuccess(state, action) {
            state.isLoading = false;
            state.isLogin = true
            state.user = action.payload;
        },
        loadUserFail(state) {
            state.isLoading = false;
            state.isLogin = false
            state.user = null;
        },
        logout(state) {
            state.isLogin = false;
            state.user = null
        },
    },
})

export const { login, loadUserSuccess, logout, loadUserFail } =  authSlice.actions
export const isLogin =  (state: AuthState) => state.isLogin
export default authSlice.reducer