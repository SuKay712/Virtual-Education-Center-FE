import React, { useState } from "react";
import "./AdminLayout.scss";
import { Button, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { ToastContainer } from "react-toastify";
import {
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LogoutOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AccountContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const { Header, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

function AdminLayout(props) {
  const [collapsed, setCollapsed] = useState(false);
  const { account, setAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};

  const items = [
    getItem("Dashboard", "/admin/dashboard", <BarChartOutlined />),
    getItem("Account Management", "/admin/accounts", <UserOutlined />),
    getItem("Course Management", "/admin/courses", <BookOutlined />),
    getItem("Schedule Management", "/admin/schedules", <CalendarOutlined />),
    getItem("Booking Management", "/admin/bookings", <ScheduleOutlined />),
    getItem("Contact Management", "/admin/contacts", <TeamOutlined />),
    getItem("Chat", "/admin/chat", <MessageOutlined />),
    getItem("Setting", "/admin/setting", <UserOutlined />),
  ];

  const onMenuClick = (menuItem) => {
    navigate(menuItem.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
    setAccount(null);
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        className="admin-sider"
      >
        <div className="logo-container">
          <div className="site-title">Virtual Center</div>
        </div>
        <Menu
          className="admin-menu"
          defaultSelectedKeys={[location.pathname]}
          mode="inline"
          theme="light"
          items={items}
          onClick={onMenuClick}
        />
        <div className="d-flex justify-content-center admin-logout-button-container">
          <Button className="admin-logout-button" onClick={handleLogout}>
            {!collapsed && "Logout"}
          </Button>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header className="admin-header">
          <div className="d-flex justify-content-between align-items-center h-100">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-button"
            />
            <div className="admin-header-right d-flex align-items-center gap-3">
              <div className="admin-user-info d-flex align-items-center gap-3 position-relative">
                <span className="user-name">
                  Xin chào quản trị viên {userInfo.name}
                </span>
              </div>
            </div>
          </div>
        </Header>
        <Content className="admin-content">
          {props.component && <props.component />}
        </Content>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        hideProgressBar={false}
        rtl={false}
        closeOnClick
        draggable
        pauseOnFocusLoss
        theme="light"
        pauseOnHover
      />
    </Layout>
  );
}

export default AdminLayout;
