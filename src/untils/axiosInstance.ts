// http.ts
import axios from 'axios';
import { handleApiError } from './errorHandler';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(async function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Interceptor phản hồi để xử lý lỗi
axiosInstance.interceptors.response.use(
    async function (response) {
        return response; // Trả về phản hồi bình thường
    },
    function (error) {
        // Gọi hàm xử lý lỗi ở đây
        handleApiError(error);
        return Promise.reject(error);
    }
);

// Định nghĩa các hàm HTTP cho tầng API sử dụng
const http = {
    get: <T>(url: string, config = {}) => axiosInstance.get<T>(url, config),
    post: <T>(url: string, body: any, config = {}) => axiosInstance.post<T>(url, body, config),
    put: <T>(url: string, body: any) => axiosInstance.put<T>(url, body),
    delete: <T>(url: string, config = {}) => axiosInstance.delete<T>(url, config),
};

export default http;
