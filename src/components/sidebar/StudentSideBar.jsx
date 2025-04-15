import { useState } from "react";
import "./StudentSidebar.scss";
import {
  FaBook,
  FaCalendarAlt,
  FaCog,
  FaEnvelope,
  FaHome,
} from "react-icons/fa";

function StudentSideBar() {
  const [activeItem, setActiveItem] = useState("Overview");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-image"></div>
      </div>
      <div className="d-flex flex-column justify-content-between h-100">
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeItem === "Overview" ? "active" : ""}`}
            onClick={() => handleItemClick("Overview")}
          >
            <FaHome className="sidebar-icon" /> Overview
          </li>
          <li
            className={`sidebar-item ${activeItem === "Course" ? "active" : ""}`}
            onClick={() => handleItemClick("Course")}
          >
            <FaBook className="sidebar-icon" /> Course
          </li>
          <li
            className={`sidebar-item ${activeItem === "Schedule" ? "active" : ""}`}
            onClick={() => handleItemClick("Schedule")}
          >
            <FaCalendarAlt className="sidebar-icon" /> Schedule
          </li>
          <li
            className={`sidebar-item ${activeItem === "Message" ? "active" : ""}`}
            onClick={() => handleItemClick("Message")}
          >
            <FaEnvelope className="sidebar-icon" /> Message
          </li>
          <li
            className={`sidebar-item ${activeItem === "Setting" ? "active" : ""}`}
            onClick={() => handleItemClick("Setting")}
          >
            <FaCog className="sidebar-icon" /> Setting
          </li>
        </ul>
        <div className="sidebar-group"></div>
      </div>
    </div>
  );
}

export default StudentSideBar;
