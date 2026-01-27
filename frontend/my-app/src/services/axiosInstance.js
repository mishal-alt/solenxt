import axios from "axios";
import { BASE_URL } from "./api";

const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    // No refresh token available, logout user
                    localStorage.removeItem("token");
                    localStorage.removeItem("currentUser");
                    // Optional: Redirect to login
                    return Promise.reject(error);
                }

                const res = await axios.post(`${BASE_URL}/api/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = res.data;

                localStorage.setItem("token", accessToken);

                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Refresh token failed", err);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("currentUser");
                window.location.href = "/login";
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
