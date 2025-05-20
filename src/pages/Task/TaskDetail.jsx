import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Giả lập dữ liệu task
  const task = {
    id: id,
    title: 'Thiết kế giao diện',
    description: 'Thiết kế UI/UX cho trang chủ',
    status: 'In Progress',
    assignee: 'Nguyễn Văn A',
    dueDate: '2024-03-20',
    priority: 'High',
    createdAt: '2024-03-15',
    comments: [
      {
        id: 1,
        user: 'Nguyễn Văn A',
        content: 'Đã hoàn thành phần wireframe',
        timestamp: '2024-03-16 10:30'
      }
    ]
  };

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
          <h1 className="text-3xl font-bold text-red-500">{task.title}</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2">Thông tin chi tiết</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><span className="font-medium">Mô tả:</span> {task.description}</p>
                <p><span className="font-medium">Trạng thái:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </p>
                <p><span className="font-medium">Người phụ trách:</span> {task.assignee}</p>
                <p><span className="font-medium">Độ ưu tiên:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </p>
                <p><span className="font-medium">Hạn hoàn thành:</span> {task.dueDate}</p>
                <p><span className="font-medium">Ngày tạo:</span> {task.createdAt}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-red-700 mb-2">Bình luận</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {task.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{comment.user}</span>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                </div>
              ))}
              <div className="mt-4">
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-red-200"
                  rows="3"
                  placeholder="Thêm bình luận..."
                />
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 