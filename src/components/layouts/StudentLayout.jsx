import { IMAGES } from "../../constants/images";
import StudentSideBar from "../sidebar/StudentSideBar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./StudentLayout.scss";
import { useState } from "react";

function StudentLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem("user_info")) || {};

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_info");
    window.location.href = "/login"; // Điều hướng về trang đăng nhập
  };

  const currentPage = props.component.name; // Lấy tên của component hiện tại

  return (
    <div className="student-frame-wrapper">
      <StudentSideBar currentPage={currentPage} />
      <div className="frame-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="frame-header">
            <h4>Hello Bruno, welcome back!</h4>
          </div>
          <div className="frame-header d-flex justify-content-between align-items-center">
            <i className="fa fa-bell notification-icon"></i>
            <div className="user-info d-flex align-items-center gap-3 position-relative">
              <div className="user-avatar">
                <img src={IMAGES.student1_image} alt="User Avatar" />
              </div>
              <span className="user-name">John Doe</span>
              <i
                className={`fa fa-chevron-down dropdown-icon ${
                  isDropdownOpen ? "open" : ""
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ></i>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="btn btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <props.component />
      </div>
    </div>
  );
}

export default StudentLayout;
