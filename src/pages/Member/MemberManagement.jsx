import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Thiết kế giao diện',
      description: 'Thiết kế UI/UX cho trang chủ',
      status: 'In Progress',
      assignee: 'Nguyễn Văn A',
      dueDate: '2024-03-20',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Phát triển API',
      description: 'Xây dựng REST API cho module user',
      status: 'Todo',
      assignee: 'Trần Thị B',
      dueDate: '2024-03-25',
      priority: 'Medium'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    assignee: '',
    dueDate: '',
    priority: 'Medium'
  });

  const [filters, setFilters] = useState({
    status: 'All',
    assignee: 'All'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTask) {
      setTasks(tasks.map(task => 
        task.id === currentTask.id ? { ...formData, id: task.id } : task
      ));
    } else {
      setTasks([...tasks, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      status: 'Todo',
      assignee: '',
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

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'All' && task.status !== filters.status) return false;
    if (filters.assignee !== 'All' && task.assignee !== filters.assignee) return false;
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
          <h1 className="text-3xl font-bold text-red-500">Quản lý Công việc</h1>
          <button
            onClick={() => {
              setCurrentTask(null);
              setFormData({
                title: '',
                description: '',
                status: 'Todo',
                assignee: '',
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
            value={filters.assignee}
            onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
            className="px-3 py-2 rounded-lg border border-red-200"
          >
            <option value="All">Tất cả người phụ trách</option>
            <option value="Nguyễn Văn A">Nguyễn Văn A</option>
            <option value="Trần Thị B">Trần Thị B</option>
          </select>
        </div>

        {/* Bảng công việc */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-red-100">
                <th className="px-4 py-2 text-left">Tiêu đề</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2 text-left">Người phụ trách</th>
                <th className="px-4 py-2 text-left">Độ ưu tiên</th>
                <th className="px-4 py-2 text-left">Hạn hoàn thành</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-red-100">
                  <td className="px-4 py-2">
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
                  <td className="px-4 py-2">{task.dueDate}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
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

      {/* Modal thêm/sửa công việc */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">
              {currentTask ? 'Sửa công việc' : 'Thêm công việc mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-red-700 font-semibold mb-2">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  required
                />
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Người phụ trách</label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                >
                  <option value="">Chọn người phụ trách</option>
                  <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                  <option value="Trần Thị B">Trần Thị B</option>
                </select>
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Độ ưu tiên</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                >
                  <option value="High">Cao</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Low">Thấp</option>
                </select>
              </div>
              <div>
                <label className="block text-red-700 font-semibold mb-2">Hạn hoàn thành</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                />
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