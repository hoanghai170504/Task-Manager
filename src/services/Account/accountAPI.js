import axiosInstance from "../../config/axiosInstance";

const endpoint = "/users";

const accountAPI = {
  login: async (data) => {
    try {
      const response = await axiosInstance.post(`${endpoint}/login`, data);
      console.log("api login:", response);
      const da = response.data;
      const { token, email, fullname, phone } = da;

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("token", token);
      // localStorage.setItem("email", JSON.stringify(user.email));
      localStorage.setItem("email", JSON.stringify(email));
      localStorage.setItem("fullname", JSON.stringify(fullname));
      localStorage.setItem("phone", JSON.stringify(phone));
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (data) => {
    try {
      const response = await axiosInstance.post(`${endpoint}/register`, data);

      // In ra phản hồi từ server để kiểm tra
      console.log("Server response:", response.data);

      // Nếu backend chỉ trả về message và status thì chỉ cần hiển thị thông báo
      return response.data; // trả về dữ liệu để component xử lý tiếp
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post(`${endpoint}/logout`);

      // Xoá localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("fullname");
      localStorage.removeItem("phone");

      return response.data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error.response?.data || { message: "Logout failed" };
    }
  },
};

export default accountAPI;
