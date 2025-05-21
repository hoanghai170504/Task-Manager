import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import groupsAPI from "../../services/Groups/groupsAPI";
import membersAPI from "../../services/Members/membersAPI";

// Helper để giới hạn độ dài text
const truncateText = (text, maxLength = 30) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
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
    startDate: "",
    memberIds: [],
  });
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const groups = await groupsAPI.getAllGroups();
      setGroups(groups);
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      const members = await membersAPI.getAllMembers();
      setMembers(members);
    };
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (e) => {
    const value = parseInt(e.target.value);
    let newMemberIds = [...formData.memberIds];
    if (e.target.checked) {
      newMemberIds.push(value);
    } else {
      newMemberIds = newMemberIds.filter((id) => id !== value);
    }
    setFormData({ ...formData, memberIds: newMemberIds });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.memberIds || formData.memberIds.length < 2) {
      setFormError("Vui lòng chọn ít nhất 2 thành viên cho nhóm.");
      return;
    }
    setFormError("");

    if (currentGroup) {
      setGroups(
        groups.map((group) =>
          group.id === currentGroup.id ? { ...formData, id: group.id } : group
        )
      );
    } else {
      setGroups([...groups, { ...formData, id: Date.now() }]);
    }

    setIsModalOpen(false);
    setFormData({ nameGroup: "", startDate: "", memberIds: [] });
    setCurrentGroup(null);
  };

  const handleEdit = (group) => {
    setCurrentGroup(group);
    setFormData({
      nameGroup: group.nameGroup,
      startDate: group.startDate,
      memberIds: group.memberIds || [],
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  const handleGroupNameClick = (groupId) => {
    navigate(`/groups/${groupId}/members`);
  };

  const filteredGroups = groups.filter((group) =>
    group.nameGroup?.toLowerCase().trim().includes(groupSearch.toLowerCase().trim())
  );

  return (
    <div className="h-full">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">Quản lý danh sách nhóm</h1>
          <button
            onClick={() => {
              setCurrentGroup(null);
              setFormData({ nameGroup: "", startDate: "", memberIds: [] });
              setFormError("");
              setIsModalOpen(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Tạo nhóm
          </button>
        </div>

        <div className="mb-4 flex items-center">
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
                <th className="px-4 py-2 text-left">Ngày bắt đầu</th>
                <th className="px-4 py-2 text-left">Thành viên</th>
                <th className="px-4 py-2 text-left">Số lượng thành viên</th>
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
                    <td className="px-4 py-2">{group.startDate}</td>
                    <td className="px-4 py-2">
                      <div
                        className="max-w-[200px] truncate"
                        title={
                          group.memberIds?.length > 0
                            ? group.memberIds
                                .map((id) => members.find((m) => m.id === id)?.name || "Không rõ")
                                .join(", ")
                            : "Chưa có"
                        }
                      >
                        {group.memberIds?.length > 0 ? (
                          <>
                            {group.memberIds
                              .slice(0, 2)
                              .map((id) => members.find((m) => m.id === id)?.name || "Không rõ")
                              .join(", ")}
                            {group.memberIds.length > 2 && "..."}
                          </>
                        ) : (
                          "Chưa có"
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {group.memberIds ? group.memberIds.length : 0}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(group)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(group.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Không tìm thấy nhóm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tạo/sửa nhóm */}
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
                <label className="block text-red-700 font-semibold mb-2">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
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
                {memberSearch.trim() !== "" && (
                  <div className="max-h-32 overflow-y-auto border border-red-200 rounded-lg p-2 bg-red-50">
                    {members
                      .filter((member) =>
                        member.name.toLowerCase().includes(memberSearch.toLowerCase())
                      )
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
                    {members.filter((member) =>
                      member.name.toLowerCase().includes(memberSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="text-gray-500 text-sm">Không tìm thấy thành viên nào.</div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">(Chọn ít nhất 2 thành viên)</p>
                {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
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
