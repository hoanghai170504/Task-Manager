import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import membersAPI from '../../services/Members/membersAPI';
import taskAPI from '../../services/Tasks/tasksAPI';

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    assignee: '',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
  });

  const [filters, setFilters] = useState({
    status: 'All',
    memberId: 'All',
    searchName: ''
  });

  const fetchMembers = async () => {
    const data = await membersAPI.getAllMembers();
    setMembers(data);
  };

  const fetchTasks = async () => {
    const data = await taskAPI.getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchMembers();
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentTask) {
      await taskAPI.updateTask(currentTask.id, formData);
    } else {
      await taskAPI.createTask(formData);
    }
    fetchTasks();
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      status: 'Todo',
      assignee: '',
      startDate: '',
      dueDate: '',
      priority: 'Medium'
    });
    setCurrentTask(null);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setFormData(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await taskAPI.deleteTask(id);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'All' && task.status !== filters.status) return false;
    if (filters.memberId !== 'All' && task.assignee !== filters.memberId) return false;
    if (filters.searchName && !task.assignee.toLowerCase().includes(filters.searchName.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-red-500">Quản lý công việc</h1>
          <button
            onClick={() => {
              setCurrentTask(null);
              setFormData({
                title: '',
                description: '',
                status: 'Todo',
                assignee: '',
                startDate: '',
                dueDate: '',
                priority: 'Medium'
              });
              setIsModalOpen(true);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Thêm công việc
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="flex gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 rounded-lg border border-red-200"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select
            value={filters.memberId}
            onChange={(e) => setFilters({ ...filters, memberId: e.target.value })}
            className="px-3 py-2 rounded-lg border border-red-200"
          >
            <option value="All">Tất cả người phụ trách</option>
            {members.map(m => (
              <option key={m.id} value={m.fullname}>{m.fullname}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tìm theo tên người phụ trách"
            value={filters.searchName}
            onChange={(e) => setFilters({ ...filters, searchName: e.target.value })}
            className="px-3 py-2 rounded-lg border border-red-200 w-64"
          />
        </div>

        {/* Bảng công việc */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-100">
                <th className="px-4 py-2 text-left whitespace-nowrap">Tiêu đề</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Người phụ trách</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Độ ưu tiên</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Ngày bắt đầu</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Hạn hoàn thành</th>
                <th className="px-4 py-2 text-left whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-red-100">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link to={`/tasks/${task.id}`} className="text-blue-500 hover:underline">
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{task.assignee}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">{task.startDate}</td>
                  <td className="px-4 py-2">{task.dueDate}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(task)} className="text-blue-500 hover:text-blue-700 mr-2">Sửa</button>
                    <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa công việc */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[800px] h-[650px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {currentTask ? 'Sửa công việc' : 'Thêm công việc mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields giống như bạn đã có - giữ nguyên */}
              {/* ... */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  {currentTask ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
