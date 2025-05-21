import axiosInstance from "../../config/axiosInstance";

const endpoint = "/groups";

const groupsAPI = {
    getAllGroups: async () => {
            const response = await axiosInstance.get(endpoint);
            return response.data;
    },
    createGroup: async (groupData) => {
        const response = await axiosInstance.post(endpoint, groupData);
        return response.data;
    },
    updateGroup: async (groupId, groupData) => {
        const response = await axiosInstance.put(`${endpoint}/${groupId}`, groupData);
        return response.data;
    },
    deleteGroup: async (groupId) => {
        const response = await axiosInstance.delete(`${endpoint}/${groupId}`);
        return response.data;
    },
    getGroupById: async (groupId) => {
        const response = await axiosInstance.get(`${endpoint}/${groupId}`);
        return response.data;
    }
}

export default groupsAPI;
