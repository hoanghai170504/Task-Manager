import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import MemberManagement from "./pages/Member/MemberManagement";
import Layout from "./pages/Layout";
import TaskManagement from "./pages/Member/TaskManagement";
import GroupManagement from "./pages/Member/GroupManagenent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các route được bảo vệ bởi Layout */}
        <Route element={<Layout />}>
          <Route path="/groups" element={<GroupManagement />} />
          <Route path="/groups/:groupId/members" element={<MemberManagement />} />
          <Route path="/tasks" element={<TaskManagement />} />
          {/* Thêm các route khác ở đây */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
