import axiosInstance from "../../config/axiosInstance";

const endpoint = "/teams";

const groupsAPI = {
    createGroup: async (groupData) => {
        const response = await axiosInstance.post(endpoint, groupData);
        return response;
    },
    getDetailGroupById: async (groupId) => {
        const response = await axiosInstance.get(`${endpoint}/${groupId}`);
        return response;
    },
    addMemberIdToGroup: async (groupId, memberId) => {
        const response = await axiosInstance.patch(`${endpoint}/${groupId}`, {
          data: {
            userId: memberId
          }
        });
        return response;
    },
    deleteGroup: async (groupId) => {
        const response = await axiosInstance.delete(`${endpoint}/${groupId}`);
        return response.data;
    },
    getAllGroupsByMemberId: async (memberId) => {
            const response = await axiosInstance.get(`${endpoint}/user/${memberId}`);
            return response;
    }, 
    deleteMemberIdFromGroup: async (groupId, memberId) => {
        const response = await axiosInstance.patch(`${endpoint}/groups/${groupId}`, {
          data: {
            userId: memberId
          }
        });
      
        return response;
    }
}

export default groupsAPI;
