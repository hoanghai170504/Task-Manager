import axiosInstance from "../../config/axiosInstance";

const endpoint = "/account";

const accountAPI = {
    login: async (data) => {
        const response = await axiosInstance.post(`${endpoint}/login`, data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", JSON.stringify(response.data.user.email));
        return response.data;
    },
    register: async (data) => {
        const response = await axiosInstance.post(`${endpoint}/register`, data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", JSON.stringify(response.data.user.email));
        return response.data;
    },
    logout: async () => {
        const response = await axiosInstance.post(`${endpoint}/logout`);
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        return response.data;
    }
}   

export default accountAPI;
