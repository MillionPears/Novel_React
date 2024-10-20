import { useEffect } from "react"
import { useAppDispatch } from "../store/hooks"
import authApiRequest from "../apiRequest/auth"
import { loadUserFail, loadUserSuccess, login } from "../store/auth/auth.slice"

import axios from "axios"
import actionNotification from "../components/NotificationState/Toast"
import history from "../router/history"

export const  useAuth = ()=>{
     const dispatch = useAppDispatch()
    
    

    const handlelogin = async (email: string, password: string) => {
        try {
            const response = await authApiRequest.login(email,password)
            const data = response.data
            console.log("haha",response.data)
            const accessToken = data.accessToken

            localStorage.setItem('accessToken', accessToken)
            loadUser()
            dispatch(login())
            
            history.push('/')
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi không xác định.';
                actionNotification(`${errorMessage}`, "error");
            } else {
                actionNotification(`Đăng nhập thất bại.`, "error");
            }
            dispatch(loadUserFail())
        }
    }
    const handleRegister = async (email: string, password: string) => {
        try {
            const response = await authApiRequest.register(
                email,
                password
            )
            if (response.data) {
                handlelogin(email, password)
            }
        } catch (error: any) {
            actionNotification(error?.response?.data?.message, 'error')
            
        }
    }
    const loadUser = async() => {
        try {
            const res = await authApiRequest.getUser()
            if(res.data) {
                console.log(res.data)
                dispatch(loadUserSuccess(res.data))
            }
        } catch (error) {
            console.log(error)
            dispatch(loadUserFail())
        }
    }

    return { handlelogin,
       handleRegister,
        loadUser}
}