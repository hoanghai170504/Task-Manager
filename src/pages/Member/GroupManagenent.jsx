import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import groupsAPI from "../../services/Groups/groupsAPI";

const truncateText = (text, maxLength = 30) => {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
};

const GroupManagement = () => {
  const [memberSearch, setMemberSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    nameGroup: "",
    memberIds: [],
  });
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  // Fetch nhóm của user
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const response = await groupsAPI.getAllGroupsByMemberId(userId);
        const rawGroups = response.data?.data || [];

        const mappedGroups = rawGroups.map((group) => ({
          id: group._id || group.id,
          nameGroup: group.name,
          memberIds: group.members?.map((m) => m.id || m._id) || [],
          memberCount: group.members?.length || 0,
        }));

        setGroups(mappedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  // Fetch tất cả thành viên
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await groupsAPI.getAllMembers();
        setMembers(res.data?.data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = async (e) => {
    const memberId = e.target.value;
    let updatedIds = [...formData.memberIds];

    if (e.target.checked) {
      updatedIds.push(memberId);
    } else {
      updatedIds = updatedIds.filter((id) => id !== memberId);

      // Nếu là chế độ sửa, xóa thành viên ngay lập tức khỏi nhóm
      if (currentGroup) {
        try {
          await groupsAPI.deleteMemberIdFromGroup(currentGroup.id, memberId);
        } catch (error) {
          console.error("Error removing member:", error);
        }
      }
    }

    setFormData({ ...formData, memberIds: updatedIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.memberIds.length < 2) {
      setFormError("Vui lòng chọn ít nhất 2 thành viên cho nhóm.");
      return;
    }

    try {
      if (currentGroup) {
        // Chế độ cập nhật nhóm
        const existingIds = currentGroup.memberIds || [];
        const newIds = formData.memberIds.filter((id) => !existingIds.includes(id));

        await Promise.all(
          newIds.map((id) => groupsAPI.addMemberIdToGroup(currentGroup.id, id))
        );

        const updatedGroups = groups.map((g) =>
          g.id === currentGroup.id
            ? { ...g, nameGroup: formData.nameGroup, memberIds: formData.memberIds }
            : g
        );

        setGroups(updatedGroups);
      } else {
        // Tạo nhóm mới
        const res = await groupsAPI.createGroup({
          nameGroup: formData.nameGroup,
        });

        const newGroupId = res.data?.id || res.data?._id;

        await Promise.all(
          formData.memberIds.map((id) => groupsAPI.addMemberIdToGroup(newGroupId, id))
        );

        setGroups([
          ...groups,
          { id: newGroupId, nameGroup: formData.nameGroup, memberIds: formData.memberIds, memberCount: formData.memberIds.length },
        ]);
      }

      setIsModalOpen(false);
      setFormData({ nameGroup: "", memberIds: [] });
      setCurrentGroup(null);
      setFormError("");
    } catch (error) {
      console.error("Error submitting group:", error);
    }
  };

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setFormData({
      nameGroup: group.nameGroup,
      memberIds: group.memberIds || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (groupId) => {
    try {
      await groupsAPI.deleteGroup(groupId);
      setGroups(groups.filter((g) => g.id !== groupId));
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleGroupNameClick = (groupId) => {
    navigate(`/groups/${groupId}/members`);
  };

  const filteredGroups = groups.filter((group) =>
    group.nameGroup?.toLowerCase().includes(groupSearch.trim().toLowerCase())
  );

  return (
    <div className="h-full">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">Quản lý danh sách nhóm</h1>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setCurrentGroup(null);
              setFormData({ nameGroup: "", memberIds: [] });
              setFormError("");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Tạo nhóm
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhóm..."
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-red-200"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-100">
                <th className="px-4 py-2 text-left">Tên nhóm</th>
                <th className="px-4 py-2 text-center">Số lượng</th>
                <th className="px-4 py-2 text-left">Thành viên</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="border-b border-red-100">
                    <td className="px-4 py-2">
                      <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleGroupNameClick(group.id)}
                      >
                        {truncateText(group.nameGroup)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">{group.memberIds?.length || 0}</td>
                    <td className="px-4 py-2">
                      <div className="max-w-[200px] truncate" title={
                        group.memberIds
                          .map((id) => members.find((m) => m.id === id)?.name || "Không rõ")
                          .join(", ")
                      }>
                        {group.memberIds
                          .slice(0, 2)
                          .map((id) => members.find((m) => m.id === id)?.name || "Không rõ")
                          .join(", ")}
                        {group.memberIds?.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button onClick={() => handleEdit(group)} className="text-blue-500 hover:text-blue-700 mr-2">
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(group.id)} className="text-red-500 hover:text-red-700">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Không tìm thấy nhóm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {currentGroup ? "Sửa nhóm" : "Thêm nhóm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-red-700 font-semibold mb-2">Tên nhóm</label>
                <input
                  type="text"
                  name="nameGroup"
                  value={formData.nameGroup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  required
                />
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">
                  Thành viên nhóm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-red-200"
                />
                <div className="max-h-40 overflow-y-auto border border-red-200 rounded-lg p-2 bg-red-50">
                  {members
                    .filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                    .map((member) => (
                      <div key={member.id} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          value={member.id}
                          checked={formData.memberIds.includes(member.id)}
                          onChange={handleMemberChange}
                          className="mr-2"
                        />
                        <label htmlFor={`member-${member.id}`}>{member.name}</label>
                      </div>
                    ))}
                  {!members.some((m) =>
                    m.name.toLowerCase().includes(memberSearch.toLowerCase())
                  ) && <p className="text-sm text-gray-500">Không tìm thấy thành viên nào.</p>}
                </div>
                {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                  Hủy
                </button>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  {currentGroup ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
