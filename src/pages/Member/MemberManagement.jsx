import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MemberManagement = () => {
  const [members, setMembers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', role: 'Admin' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', role: 'User' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMember) {
      // Update existing member
      setMembers(members.map(member => 
        member.id === currentMember.id ? { ...formData, id: member.id } : member
      ));
    } else {
      // Add new member
      setMembers([...members, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'User' });
    setCurrentMember(null);
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setFormData(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="h-full">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">Quản lý Thành viên</h1>
          <button
            onClick={() => {
              setCurrentMember(null);
              setFormData({ name: '', email: '', role: 'User' });
              setIsModalOpen(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Thêm thành viên
          </button>
        </div>

        {/* Bảng thành viên */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Vai trò</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-red-100">
                  <td className="px-4 py-2">{member.id}</td>
                  <td className="px-4 py-2">{member.name}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">{member.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa thành viên */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {currentMember ? 'Sửa thành viên' : 'Thêm thành viên mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-red-700 font-semibold mb-2">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  required
                />
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  required
                />
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Vai trò</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
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
                  {currentMember ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement; 