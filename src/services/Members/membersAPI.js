import axiosInstance from "../../config/axiosInstance";

const endpoint = "/members";

const membersAPI = {
    getAllMembers: async () => {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    },
    createMember: async (memberData) => {
        const response = await axiosInstance.post(endpoint, memberData);
        return response.data;
    },
    updateMember: async (memberId, memberData) => {
        const response = await axiosInstance.put(`${endpoint}/${memberId}`, memberData);
        return response.data;
    },
    deleteMember: async (memberId) => {
        const response = await axiosInstance.delete(`${endpoint}/${memberId}`);
        return response.data;
    },
    getMemberById: async (memberId) => {
        const response = await axiosInstance.get(`${endpoint}/${memberId}`);
        return response.data;
    },
    getMembersByGroupId: async (groupId) => {
        const response = await axiosInstance.get(`${endpoint}/members/${groupId}`);
        return response.data;
    },
    createMemberForGroup: async (groupId, memberData) => {
        const response = await axiosInstance.patch(`${endpoint}/members/${groupId}`, memberData);
        return response.data;
    },
    deleteMemberFromGroup: async (groupId, memberId) => {
        const response = await axiosInstance.delete(`${endpoint}/members/${groupId}/${memberId}`);
        return response.data;
    }
}   

export default membersAPI;
