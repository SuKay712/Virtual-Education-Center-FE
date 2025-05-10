import "./TeacherSidebar.scss";
import {
  FaBook,
  FaCalendarAlt,
  FaCog,
  FaEnvelope,
  FaHome,
  FaChalkboardTeacher,
  FaUsers,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

function TeacherSideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Overview",
      path: "/teacher/overview",
      icon: <FaHome className="teacher-sidebar-icon" />,
    },
    {
      name: "My Classes",
      path: "/teacher/classes",
      icon: <FaChalkboardTeacher className="teacher-sidebar-icon" />,
    },
    {
      name: "Students",
      path: "/teacher/students",
      icon: <FaUsers className="teacher-sidebar-icon" />,
    },
    {
      name: "Schedule",
      path: "/teacher/schedule",
      icon: <FaCalendarAlt className="teacher-sidebar-icon" />,
    },
    {
      name: "Message",
      path: "/teacher/message",
      icon: <FaEnvelope className="teacher-sidebar-icon" />,
    },
    {
      name: "Setting",
      path: "/teacher/setting",
      icon: <FaCog className="teacher-sidebar-icon" />,
    },
  ];

  return (
    <div className="teacher-sidebar">
      <div className="teacher-sidebar-header">
        <div className="teacher-sidebar-header-image"></div>
      </div>
      <div className="d-flex flex-column justify-content-between h-100">
        <ul className="teacher-sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`teacher-sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="teacher-sidebar-group"></div>
    </div>
  );
}

export default TeacherSideBar;
