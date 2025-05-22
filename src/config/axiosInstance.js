import axios from "axios";

const axiosInstance = axios.create({
  baseURL:  import.meta.env.VITE_API_KEY, 
  headers: { "Content-Type": "application/json" },
});

// 🛠️ Thêm interceptor để tự động gán token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;
