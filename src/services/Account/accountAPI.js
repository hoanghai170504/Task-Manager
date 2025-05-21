import axiosInstance from "../../config/axiosInstance";

const endpoint = "/users";

const accountAPI = {
  login: async (data) => {
    try {
      const response = await axiosInstance.post(`${endpoint}/login`, data);
      console.log("api login:", response);
      const da = response.data;
      const { token, email, fullname, phone, _id } = da;

      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.data._id);
      localStorage.setItem("email", response.data.data.email);
      localStorage.setItem("fullname", response.data.data.fullname);
      localStorage.setItem("phone", response.data.data.phone);
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
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    localStorage.removeItem("phone");
    localStorage.removeItem("userId");
  },
};

export default accountAPI;
