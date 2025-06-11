import "./StudentSidebar.scss";
import {
  FaBook,
  FaCalendarAlt,
  FaCog,
  FaEnvelope,
  FaHome,
  FaFileInvoiceDollar,
  FaComments,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function StudentSideBar() {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const navigate = useNavigate(); // Điều hướng khi click vào mục

  const menuItems = [
    {
      name: "Overview",
      path: "/student/overview",
      icon: <FaHome className="sidebar-icon" />,
    },
    {
      name: "Course",
      path: "/student/course",
      icon: <FaBook className="sidebar-icon" />,
    },
    {
      name: "Schedule",
      path: "/student/schedule",
      icon: <FaCalendarAlt className="sidebar-icon" />,
    },
    {
      name: "Bill",
      path: "/student/bill",
      icon: <FaFileInvoiceDollar className="sidebar-icon" />,
    },
    {
      name: "Chat",
      path: "/student/chat",
      icon: <FaComments className="sidebar-icon" />,
    },
    {
      name: "Setting",
      path: "/student/setting",
      icon: <FaCog className="sidebar-icon" />,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-image"></div>
      </div>
      <div className="d-flex flex-column justify-content-between h-100">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)} // Điều hướng khi click
            >
              {item.icon} {item.name}
            </li>
          ))}
        </ul>
        <div className="sidebar-group"></div>
      </div>
    </div>
  );
}

export default StudentSideBar;
