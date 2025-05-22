import React from 'react';
import { Link } from 'react-router-dom';
import accountAPI from '../../services/Account/accountAPI';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await accountAPI.logout();
    Swal.fire({
      title: 'Đăng xuất thành công',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    navigate('/login');
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-red-700 to-gray-900 text-white flex flex-col shadow-lg fixed">
      <div className="flex items-center justify-center h-20 border-b border-red-900">
        <span className="text-2xl font-bold tracking-wide">Task Manager</span>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        <Link
          to="/dashboard"
          className="block py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Bảng điều khiển
        </Link>
        <Link
          to="/tasks"
          className="block py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Công việc
        </Link>
        <Link
          to="/projects"
          className="block py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Dự án
        </Link>
        <Link
          to="/members"
          className="block py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Thành viên
        </Link>
        <Link
          to="/settings"
          className="block py-2 px-4 rounded-lg hover:bg-red-600 transition font-medium"
        >
          Cài đặt
        </Link>
      </nav>
      <div className="mt-auto p-4 border-t border-red-900">
        <button onClick={handleLogout} className="w-full py-2 bg-red-800 rounded-lg hover:bg-red-600 transition font-semibold">
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;