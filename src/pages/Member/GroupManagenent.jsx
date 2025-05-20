import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Danh sách thành viên mẫu (có thể lấy từ API hoặc props)
const allMembers = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
];

// Thêm hàm helper để giới hạn text
const truncateText = (text, maxLength = 30) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const GroupManagement = () => {
  // Thêm state memberSearch
  const [memberSearch, setMemberSearch] = useState("");
  // Thêm state groupSearch cho tìm kiếm tên nhóm
  const [groupSearch, setGroupSearch] = useState("");

  // Mỗi nhóm sẽ có thêm trường memberIds là mảng id thành viên
  const [groups, setGroups] = useState([
    {
      id: 1,
      nameGroup: "nhóm A",
      startDate: "2025-05-20",
      memberIds: [1, 2],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [formData, setFormData] = useState({
    nameGroup: "",
    startDate: "",
    memberIds: [],
  });
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  // Xử lý thay đổi input text/date
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý chọn thành viên
  const handleMemberChange = (e) => {
    const value = parseInt(e.target.value);
    let newMemberIds = [...formData.memberIds];
    if (e.target.checked) {
      newMemberIds.push(value);
    } else {
      newMemberIds = newMemberIds.filter((id) => id !== value);
    }
    setFormData({
      ...formData,
      memberIds: newMemberIds,
    });
  };

  // Xử lý submit form tạo/sửa nhóm
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate: phải chọn ít nhất 2 thành viên
    if (!formData.memberIds || formData.memberIds.length < 2) {
      setFormError("Vui lòng chọn ít nhất 2 thành viên cho nhóm.");
      return;
    }
    setFormError("");
    if (currentGroup) {
      setGroups(
        groups.map((group) =>
          group.id === currentGroup.id
            ? { ...formData, id: group.id }
            : group
        )
      );
    } else {
      setGroups([...groups, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({
      nameGroup: "",
      startDate: "",
      memberIds: [],
    });
    setCurrentGroup(null);
  };

  // Khi ấn Sửa
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

  // Khi ấn Xóa
  const handleDelete = (id) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  // Khi ấn vào tên nhóm, chuyển sang trang thành viên của nhóm đó
  const handleGroupNameClick = (groupId) => {
    // Giả sử route thành viên nhóm là /groups/:id/members
    navigate(`/groups/${groupId}/members`);
  };

  // Lọc nhóm theo tên nhóm (không phân biệt hoa thường, bỏ khoảng trắng đầu cuối)
  const filteredGroups = groups.filter((group) =>
    group.nameGroup
      .toLowerCase()
      .trim()
      .includes(groupSearch.toLowerCase().trim())
  );

  return (
    <div className="h-full">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">
            Quản lý danh sách nhóm
          </h1>
          <button
            onClick={() => {
              setCurrentGroup(null);
              setFormData({
                nameGroup: "",
                startDate: "",
                memberIds: [],
              });
              setFormError("");
              setIsModalOpen(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Tạo nhóm
          </button>
        </div>

        {/* Ô tìm kiếm tên nhóm */}
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
                      <div className="max-w-[200px] truncate" title={
                        group.memberIds && group.memberIds.length > 0
                          ? group.memberIds
                              .map(id => allMembers.find(m => m.id === id)?.name || "Không rõ")
                              .join(", ")
                          : "Chưa có"
                      }>
                        {group.memberIds && group.memberIds.length > 0 ? (
                          <>
                            {group.memberIds
                              .slice(0, 2)
                              .map(id => allMembers.find(m => m.id === id)?.name || "Không rõ")
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

      {/* Popup tạo/sửa nhóm */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {currentGroup ? "Sửa nhóm" : "Thêm nhóm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-red-700 font-semibold mb-2">
                  Tên nhóm
                </label>
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
                  Ngày bắt đầu
                </label>
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
                {/* Ô tìm kiếm thành viên */}
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full px-3 py-2 mb-2 rounded-lg border border-red-200"
                />
                {/* 
                  Chỉ hiển thị danh sách thành viên khi đã nhập từ khóa tìm kiếm.
                  Nếu ô tìm kiếm rỗng thì không hiển thị danh sách.
                */}
                {memberSearch.trim() !== "" && (
                  <div className="max-h-32 overflow-y-auto border border-red-200 rounded-lg p-2 bg-red-50">
                    {allMembers
                      .filter((member) =>
                        member.name
                          .toLowerCase()
                          .includes(memberSearch.toLowerCase())
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
                          <label htmlFor={`member-${member.id}`}>
                            {member.name}
                          </label>
                        </div>
                      ))}
                    {/* Nếu không tìm thấy thành viên nào */}
                    {allMembers.filter((member) =>
                      member.name
                        .toLowerCase()
                        .includes(memberSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="text-gray-500 text-sm">Không tìm thấy thành viên nào.</div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  (Chọn ít nhất 2 thành viên)
                </p>
                {formError && (
                  <p className="text-red-500 text-sm mt-1">{formError}</p>
                )}
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

/*
Giải thích bằng tiếng Việt:
- Đã thêm ô tìm kiếm theo tên nhóm (groupSearch). Khi nhập vào ô này, bảng danh sách nhóm sẽ chỉ hiển thị các nhóm có tên phù hợp với từ khóa tìm kiếm.
- Khi ấn vào tên nhóm sẽ chuyển hướng sang trang thành viên của nhóm đó (route: /groups/:id/members).
- Khi tạo/sửa nhóm, popup sẽ hiển thị danh sách các thành viên để chọn (checkbox).
- Validate: bắt buộc phải chọn ít nhất 2 thành viên, nếu không sẽ báo lỗi.
- Khi lưu nhóm, memberIds sẽ lưu danh sách id thành viên của nhóm.
- Đã thêm cột "Số lượng thành viên" để hiển thị tổng số thành viên trong mỗi nhóm.
*/
