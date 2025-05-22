import axiosInstance from "../../config/axiosInstance";

const endpoint = "/tasks";

const tasksAPI = {
    getAllTasks: async () => {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    },
    createTask: async (taskData) => {
        const response = await axiosInstance.post(endpoint, taskData);
        return response.data;
    },
    updateTask: async (taskId, taskData) => {
        const response = await axiosInstance.put(`${endpoint}/${taskId}`, taskData);
        return response.data;
    },
    deleteTask: async (taskId) => {
        const response = await axiosInstance.delete(`${endpoint}/${taskId}`);
        return response.data;
    },
    getTaskById: async (taskId) => {
        const response = await axiosInstance.get(`${endpoint}/${taskId}`);
        return response.data;
    },
    getTasksByMemberId: async (memberId) => {
        const response = await axiosInstance.get(`${endpoint}/members/${memberId}`);
        return   response.data;
    },
    createTaskForMember: async (memberId, taskData) => {
        const response = await axiosInstance.patch(`${endpoint}/members/${memberId}`, taskData);
        return response.data;
    },
    deleteTaskFromMember: async (memberId, taskId) => {
        const response = await axiosInstance.delete(`${endpoint}/members/${memberId}/${taskId}`);
        return response.data;
    }
}    

export default tasksAPI;
