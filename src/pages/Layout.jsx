import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-red-200 to-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-64 p-6"> {/* ml-64 để tạo khoảng cách với sidebar có width 64 */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
